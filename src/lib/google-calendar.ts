import { google } from 'googleapis';

const calendarId = process.env.GOOGLE_CALENDAR_ID;

const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  },
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

const calendar = google.calendar({ version: 'v3', auth });

// Returns the busy time ranges on the calendar between timeMin and timeMax.
//
// We deliberately use events.list instead of freebusy.query: freebusy collapses
// everything into opaque busy blocks and reports ALL-DAY events (leave, "busy"
// day markers, some synced entries) as busy for the whole day. On a personal or
// shared calendar that means a single all-day entry wipes out every bookable
// slot. events.list lets us keep only genuine *timed*, busy (opaque) conflicts:
//   - all-day events (have `start.date`, no `start.dateTime`) are ignored
//   - events marked free / transparent are ignored
//   - cancelled events and non-blocking types (working location) are ignored
export async function getBusySlots(timeMin: string, timeMax: string) {
  if (!calendarId) return [];

  try {
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true, // expand recurring events into individual instances
      orderBy: 'startTime',
      maxResults: 2500,
    });

    const items = response.data.items || [];

    return items.flatMap((event) => {
      if (event.status === 'cancelled') return [];
      if (event.transparency === 'transparent') return []; // marked "free"
      if (event.eventType === 'workingLocation') return []; // never blocks time

      const start = event.start?.dateTime;
      const end = event.end?.dateTime;
      // No dateTime => all-day event (start.date only). These must not block the day.
      if (!start || !end) return [];

      return [{ start, end }];
    });
  } catch (error) {
    console.error('Error fetching Google Calendar busy slots:', error);
    return [];
  }
}

export async function createCalendarEvent(
  startTime: string,
  endTime: string,
  summary: string,
  description: string
) {
  if (!calendarId) return null;

  try {
    const response = await calendar.events.insert({
      calendarId,
      requestBody: {
        summary,
        description,
        start: { dateTime: startTime },
        end: { dateTime: endTime },
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error creating Google Calendar event:', error);
    return null;
  }
}

export async function deleteCalendarEvent(eventId: string) {
  if (!calendarId) return false;

  try {
    await calendar.events.delete({
      calendarId,
      eventId,
    });
    return true;
  } catch (error) {
    console.error('Error deleting Google Calendar event:', error);
    return false;
  }
}
