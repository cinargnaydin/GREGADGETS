import { getOptionalAdminDb } from '@/lib/firebase/firebase-admin';
import { getDevScheduleOverride, getDevScheduleSettings } from '@/lib/dev-store';

// The shop physically operates in London. Slot generation, working-hours checks
// and calendar events must all resolve against this zone regardless of where the
// server runs (Vercel functions run in UTC), otherwise every wall-clock time is
// off by the host<->London offset (an hour during BST).
export const SHOP_TIME_ZONE = 'Europe/London';

export const DEFAULT_START_TIME = '09:00';
export const DEFAULT_END_TIME = '17:00';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidDateStr(value: string): boolean {
  return DATE_RE.test(value);
}

export function isValidTimeStr(value: string): boolean {
  return TIME_RE.test(value);
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Offset (ms) of `timeZone` from UTC at a given absolute instant. Positive means
// the zone is ahead of UTC (e.g. +3600000 for London in BST).
function timeZoneOffsetMs(timeZone: string, date: Date): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  const parts = dtf.formatToParts(date);
  const map: Record<string, number> = {};
  for (const part of parts) {
    if (part.type !== 'literal') map[part.type] = Number(part.value);
  }
  // `hour` can come back as 24 for midnight in some engines; normalise to 0.
  const hour = map.hour === 24 ? 0 : map.hour;
  const asUtc = Date.UTC(map.year, map.month - 1, map.day, hour, map.minute, map.second);
  return asUtc - date.getTime();
}

// Convert a wall-clock date+time in `timeZone` to the correct absolute instant.
// Two-pass to stay correct across DST transitions.
export function zonedWallClockToUtc(dateStr: string, timeStr: string, timeZone = SHOP_TIME_ZONE): Date {
  const [y, mo, d] = dateStr.split('-').map(Number);
  const [hh, mm] = timeStr.split(':').map(Number);
  const guessUtc = Date.UTC(y, mo - 1, d, hh, mm, 0);
  const offset1 = timeZoneOffsetMs(timeZone, new Date(guessUtc));
  const candidate = new Date(guessUtc - offset1);
  const offset2 = timeZoneOffsetMs(timeZone, candidate);
  if (offset2 === offset1) return candidate;
  return new Date(guessUtc - offset2);
}

// Format an absolute instant as HH:mm in the shop's zone.
export function formatZonedTime(date: Date, timeZone = SHOP_TIME_ZONE): string {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
}

// Lowercase weekday name ('monday'...) for a calendar date in the shop's zone.
export function weekdayInZone(dateStr: string, timeZone = SHOP_TIME_ZONE): string {
  // Noon UTC avoids any risk of the date rolling over across the zone offset.
  const noon = new Date(`${dateStr}T12:00:00Z`);
  return new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' })
    .format(noon)
    .toLowerCase();
}

// Absolute-instant bounds of a shop-local calendar day.
export function zonedDayBounds(dateStr: string): { dayStart: Date; dayEnd: Date } {
  const dayStart = zonedWallClockToUtc(dateStr, '00:00');
  const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000 - 1);
  return { dayStart, dayEnd };
}

export type WorkingWindow = {
  isClosed: boolean;
  startTime: string;
  endTime: string;
};

type DayScheduleData = {
  isClosed?: boolean;
  startTime?: string | null;
  endTime?: string | null;
};

// Resolves the working window for a date, honouring per-date overrides then the
// weekly schedule, from Firestore in production or the dev store locally. Shared
// by the available-slots and booking routes so they can never disagree.
export async function resolveWorkingWindow(dateStr: string): Promise<WorkingWindow> {
  const dayOfWeek = weekdayInZone(dateStr);
  const adminDb = getOptionalAdminDb();

  let settings: Record<string, DayScheduleData | undefined>;
  let override: DayScheduleData | undefined;

  if (adminDb) {
    const [settingsDoc, overrideDoc] = await Promise.all([
      adminDb.collection('schedule_settings').doc('default').get(),
      adminDb.collection('schedule_overrides').doc(dateStr).get(),
    ]);
    settings = (settingsDoc.data() || {}) as Record<string, DayScheduleData | undefined>;
    override = overrideDoc.data() as DayScheduleData | undefined;
  } else {
    settings = getDevScheduleSettings();
    override = getDevScheduleOverride(dateStr);
  }

  if (override?.isClosed) {
    return { isClosed: true, startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME };
  }
  if (override?.startTime && override?.endTime) {
    return { isClosed: false, startTime: override.startTime, endTime: override.endTime };
  }

  const day = settings[dayOfWeek];
  if (day?.isClosed) {
    return { isClosed: true, startTime: DEFAULT_START_TIME, endTime: DEFAULT_END_TIME };
  }

  return {
    isClosed: false,
    startTime: day?.startTime || DEFAULT_START_TIME,
    endTime: day?.endTime || DEFAULT_END_TIME,
  };
}
