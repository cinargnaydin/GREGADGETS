import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { getBusySlots } from '@/lib/google-calendar';
import { parseISO, format, addMinutes, isBefore, startOfDay, endOfDay, isSameDay } from 'date-fns';

const APPOINTMENT_DURATION_MINUTES = 60; // Configurable duration

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const dateStr = searchParams.get('date'); // YYYY-MM-DD

  if (!dateStr) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 });
  }

  try {
    const targetDate = parseISO(dateStr);
    const dayOfWeek = format(targetDate, 'EEEE').toLowerCase(); // e.g., 'monday'

    // 1. Fetch Schedule Settings & Overrides
    const [settingsDoc, overrideDoc] = await Promise.all([
      adminDb.collection('schedule_settings').doc('default').get(),
      adminDb.collection('schedule_overrides').doc(dateStr).get()
    ]);

    const settings = settingsDoc.data() || {};
    const override = overrideDoc.data();

    // Check if store is overridden to closed
    if (override && override.isClosed) {
      return NextResponse.json({ slots: [] }); // No availability
    }

    // Determine working hours
    let startTimeStr = '09:00';
    let endTimeStr = '17:00';

    if (override && override.startTime && override.endTime) {
      startTimeStr = override.startTime;
      endTimeStr = override.endTime;
    } else if (settings[dayOfWeek]) {
      if (settings[dayOfWeek].isClosed) {
        return NextResponse.json({ slots: [] });
      }
      startTimeStr = settings[dayOfWeek].startTime || '09:00';
      endTimeStr = settings[dayOfWeek].endTime || '17:00';
    }

    // Create start and end Date objects
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const [endH, endM] = endTimeStr.split(':').map(Number);
    
    let workStart = new Date(targetDate);
    workStart.setHours(startH, startM, 0, 0);
    
    let workEnd = new Date(targetDate);
    workEnd.setHours(endH, endM, 0, 0);

    // 2. Build Potential Slots
    const potentialSlots: { start: Date; end: Date }[] = [];
    let currentSlot = new Date(workStart);

    while (isBefore(currentSlot, workEnd)) {
      const slotEnd = addMinutes(currentSlot, APPOINTMENT_DURATION_MINUTES);
      if (isBefore(slotEnd, workEnd) || slotEnd.getTime() === workEnd.getTime()) {
        potentialSlots.push({ start: new Date(currentSlot), end: slotEnd });
      }
      currentSlot = addMinutes(currentSlot, APPOINTMENT_DURATION_MINUTES);
    }

    // 3. Fetch Booked slots from Firestore
    const dayStart = startOfDay(targetDate);
    const dayEnd = endOfDay(targetDate);
    
    const appointmentsSnapshot = await adminDb.collection('appointments')
      .where('startTime', '>=', dayStart)
      .where('startTime', '<=', dayEnd)
      .get();

    const firestoreBookings = appointmentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        start: data.startTime.toDate(),
        end: data.endTime.toDate(),
      };
    });

    // 4. Fetch Google Calendar Busy Times
    const gCalBusyTimes = await getBusySlots(dayStart.toISOString(), dayEnd.toISOString());

    // 5. Filter Potential Slots
    const now = new Date();
    const availableSlots = potentialSlots.filter(slot => {
      // Don't show past slots
      if (isBefore(slot.start, now)) return false;

      // Check Firestore conflicts
      const hasDbConflict = firestoreBookings.some(booking => {
        return (slot.start < booking.end && slot.end > booking.start);
      });
      if (hasDbConflict) return false;

      // Check GCal conflicts
      const hasGCalConflict = gCalBusyTimes.some((busy: any) => {
        const busyStart = new Date(busy.start);
        const busyEnd = new Date(busy.end);
        return (slot.start < busyEnd && slot.end > busyStart);
      });
      if (hasGCalConflict) return false;

      return true;
    });

    const formattedSlots = availableSlots.map(slot => format(slot.start, 'HH:mm'));

    return NextResponse.json({ slots: formattedSlots });
  } catch (error: any) {
    console.error('Error fetching available slots:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
