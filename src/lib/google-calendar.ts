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

export async function getBusySlots(timeMin: string, timeMax: string) {
  if (!calendarId) return [];

  try {
    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin,
        timeMax,
        timeZone: 'UTC', // Will assume UTC, format input properly
        items: [{ id: calendarId }],
      },
    });

    const busy = response.data.calendars?.[calendarId]?.busy || [];
    return busy;
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
