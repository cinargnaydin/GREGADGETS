export type DaySchedule = {
  startTime: string;
  endTime: string;
  isClosed: boolean;
};

export type ScheduleSettings = Record<string, DaySchedule>;

export type ScheduleOverride = {
  isClosed: boolean;
  startTime: string | null;
  endTime: string | null;
};

export type DevAppointment = {
  id: string;
  name: string;
  email: string;
  phone: string;
  issue?: string;
  leadId?: string;
  startTime: string;
  endTime: string;
  calendarEventId: string | null;
  createdAt: string;
  storage: 'memory';
};

type CreateDevAppointmentInput = Omit<DevAppointment, 'id' | 'createdAt' | 'storage'>;

declare global {
  var __greenwichGadgetsDevAppointments: DevAppointment[] | undefined;
  var __greenwichGadgetsDevScheduleSettings: ScheduleSettings | undefined;
  var __greenwichGadgetsDevScheduleOverrides:
    | Record<string, ScheduleOverride>
    | undefined;
}

export const defaultScheduleSettings: ScheduleSettings = {
  monday: { startTime: '08:30', endTime: '20:00', isClosed: false },
  tuesday: { startTime: '08:30', endTime: '20:00', isClosed: false },
  wednesday: { startTime: '08:30', endTime: '20:00', isClosed: false },
  thursday: { startTime: '08:30', endTime: '20:00', isClosed: false },
  friday: { startTime: '08:30', endTime: '20:00', isClosed: false },
  saturday: { startTime: '09:00', endTime: '20:00', isClosed: false },
  sunday: { startTime: '12:00', endTime: '15:00', isClosed: false },
};

function getDevAppointmentsStore() {
  globalThis.__greenwichGadgetsDevAppointments ??= [];
  return globalThis.__greenwichGadgetsDevAppointments;
}

function getDevScheduleOverridesStore() {
  globalThis.__greenwichGadgetsDevScheduleOverrides ??= {};
  return globalThis.__greenwichGadgetsDevScheduleOverrides;
}

export function getDevScheduleSettings(): ScheduleSettings {
  globalThis.__greenwichGadgetsDevScheduleSettings ??= structuredClone(
    defaultScheduleSettings
  );
  return globalThis.__greenwichGadgetsDevScheduleSettings;
}

export function setDevScheduleSettings(settings: Partial<ScheduleSettings>) {
  const nextSettings: ScheduleSettings = { ...getDevScheduleSettings() };

  Object.entries(settings).forEach(([day, value]) => {
    if (value) nextSettings[day] = value;
  });

  globalThis.__greenwichGadgetsDevScheduleSettings = nextSettings;

  return getDevScheduleSettings();
}

export function listDevScheduleOverrides() {
  return getDevScheduleOverridesStore();
}

export function getDevScheduleOverride(date: string) {
  return getDevScheduleOverridesStore()[date];
}

export function setDevScheduleOverride(date: string, override: ScheduleOverride) {
  const overrides = getDevScheduleOverridesStore();
  overrides[date] = override;
  return overrides[date];
}

export function deleteDevScheduleOverride(date: string) {
  const overrides = getDevScheduleOverridesStore();
  delete overrides[date];
}

export function createDevAppointment(input: CreateDevAppointmentInput) {
  const now = new Date().toISOString();
  const appointment: DevAppointment = {
    ...input,
    id: `dev-appointment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    storage: 'memory',
  };

  getDevAppointmentsStore().push(appointment);
  return appointment;
}

export function listDevAppointments(futureOnly = false) {
  const now = Date.now();

  return getDevAppointmentsStore()
    .filter((appointment) => {
      if (!futureOnly) return true;
      return new Date(appointment.startTime).getTime() >= now;
    })
    .sort((a, b) => {
      const direction = futureOnly ? 1 : -1;
      return (
        (new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) *
        direction
      );
    });
}

export function deleteDevAppointment(id: string) {
  const appointments = getDevAppointmentsStore();
  const index = appointments.findIndex((appointment) => appointment.id === id);

  if (index === -1) return null;

  const [deleted] = appointments.splice(index, 1);
  return deleted;
}

export function hasDevAppointmentConflict(startTime: Date, endTime: Date) {
  return getDevAppointmentsStore().some((appointment) => {
    const bookedStart = new Date(appointment.startTime);
    const bookedEnd = new Date(appointment.endTime);

    return startTime < bookedEnd && endTime > bookedStart;
  });
}

export function listDevAppointmentBookingsForDay(dayStart: Date, dayEnd: Date) {
  return getDevAppointmentsStore().flatMap((appointment) => {
    const start = new Date(appointment.startTime);
    const end = new Date(appointment.endTime);

    if (start >= dayStart && start <= dayEnd) {
      return [{ start, end }];
    }

    return [];
  });
}
