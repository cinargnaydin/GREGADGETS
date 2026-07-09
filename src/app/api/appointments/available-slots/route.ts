import { NextResponse } from 'next/server';
import { getOptionalAdminDb } from '@/lib/firebase/firebase-admin';
import { getBusySlots } from '@/lib/google-calendar';
import { listDevAppointmentBookingsForDay } from '@/lib/dev-store';
import {
  isValidDateStr,
  resolveWorkingWindow,
  timeToMinutes,
  zonedDayBounds,
  zonedWallClockToUtc,
  formatZonedTime,
} from '@/lib/schedule';

const APPOINTMENT_DURATION_MINUTES = 60; // Configurable duration

type AppointmentData = {
  startTime?: { toDate?: () => Date };
  endTime?: { toDate?: () => Date };
};
type CalendarBusySlot = {
  start?: string | null;
  end?: string | null;
};

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date'); // YYYY-MM-DD

  if (!dateStr || !isValidDateStr(dateStr)) {
    return NextResponse.json({ error: 'A valid date (YYYY-MM-DD) is required' }, { status: 400 });
  }

  try {
    const adminDb = getOptionalAdminDb();

    // 1. Resolve working hours (honours overrides + weekly schedule, shop TZ)
    const window = await resolveWorkingWindow(dateStr);
    if (window.isClosed) {
      return NextResponse.json({ slots: [] });
    }

    const startMinutes = timeToMinutes(window.startTime);
    const endMinutes = timeToMinutes(window.endTime);

    // 2. Build potential slots as absolute instants in the shop's timezone
    const potentialSlots: { start: Date; end: Date }[] = [];
    for (let m = startMinutes; m + APPOINTMENT_DURATION_MINUTES <= endMinutes; m += APPOINTMENT_DURATION_MINUTES) {
      const start = zonedWallClockToUtc(dateStr, minutesToTime(m));
      const end = new Date(start.getTime() + APPOINTMENT_DURATION_MINUTES * 60 * 1000);
      potentialSlots.push({ start, end });
    }

    // 3. Fetch booked slots (single-field range query -> no composite index)
    const { dayStart, dayEnd } = zonedDayBounds(dateStr);
    const appointmentsSnapshot = adminDb
      ? await adminDb.collection('appointments')
          .where('startTime', '>=', dayStart)
          .where('startTime', '<=', dayEnd)
          .get()
      : null;

    const firestoreBookings = appointmentsSnapshot
      ? appointmentsSnapshot.docs.flatMap(doc => {
          const data = doc.data() as AppointmentData;
          const start = data.startTime?.toDate?.();
          const end = data.endTime?.toDate?.();
          return start && end ? [{ start, end }] : [];
        })
      : listDevAppointmentBookingsForDay(dayStart, dayEnd);

    // 4. Fetch Google Calendar busy times
    const gCalBusyTimes = await getBusySlots(dayStart.toISOString(), dayEnd.toISOString());

    // 5. Filter potential slots
    const now = new Date();
    const availableSlots = potentialSlots.filter(slot => {
      if (slot.start < now) return false; // Don't show past slots

      const hasDbConflict = firestoreBookings.some(booking =>
        slot.start < booking.end && slot.end > booking.start
      );
      if (hasDbConflict) return false;

      const hasGCalConflict = gCalBusyTimes.some((busy: CalendarBusySlot) => {
        if (!busy.start || !busy.end) return false;
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return slot.start < busyEnd && slot.end > busyStart;
      });
      if (hasGCalConflict) return false;

      return true;
    });

    const formattedSlots = availableSlots.map(slot => formatZonedTime(slot.start));

    return NextResponse.json({ slots: formattedSlots });
  } catch (error: unknown) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
