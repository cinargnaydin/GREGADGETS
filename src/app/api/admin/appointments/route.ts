import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';
import { deleteCalendarEvent } from '@/lib/google-calendar';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const futureOnly = searchParams.get('future') === 'true';

    let query: FirebaseFirestore.Query<FirebaseFirestore.DocumentData> = adminDb.collection('appointments');

    if (futureOnly) {
      query = query.where('startTime', '>=', new Date());
    }

    // Default order by startTime descending (newest first or upcoming)
    query = query.orderBy('startTime', futureOnly ? 'asc' : 'desc');

    const snapshot = await query.get();
    
    const appointments = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        startTime: data.startTime.toDate().toISOString(),
        endTime: data.endTime.toDate().toISOString(),
        createdAt: data.createdAt?.toDate().toISOString() || null,
      };
    });

    return NextResponse.json({ appointments });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const docRef = adminDb.collection('appointments').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    const data = doc.data();

    // Try to delete from Google Calendar if event ID exists
    if (data?.calendarEventId) {
      await deleteCalendarEvent(data.calendarEventId);
    }

    // Delete from Firestore
    await docRef.delete();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
