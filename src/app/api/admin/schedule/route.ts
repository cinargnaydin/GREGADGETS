import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase/firebase-admin';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    const [settingsDoc, overridesSnapshot] = await Promise.all([
      adminDb.collection('schedule_settings').doc('default').get(),
      adminDb.collection('schedule_overrides').get()
    ]);

    const settings = settingsDoc.exists ? settingsDoc.data() : {
      monday: { startTime: '09:00', endTime: '17:00', isClosed: false },
      tuesday: { startTime: '09:00', endTime: '17:00', isClosed: false },
      wednesday: { startTime: '09:00', endTime: '17:00', isClosed: false },
      thursday: { startTime: '09:00', endTime: '17:00', isClosed: false },
      friday: { startTime: '09:00', endTime: '17:00', isClosed: false },
      saturday: { startTime: '10:00', endTime: '14:00', isClosed: true },
      sunday: { startTime: '10:00', endTime: '14:00', isClosed: true },
    };

    const overrides: Record<string, any> = {};
    overridesSnapshot.docs.forEach(doc => {
      overrides[doc.id] = doc.data();
    });

    return NextResponse.json({ settings, overrides });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (type === 'settings') {
      await adminDb.collection('schedule_settings').doc('default').set(data, { merge: true });
    } else if (type === 'override') {
      const { date, ...overrideData } = data;
      if (!date) return NextResponse.json({ error: 'Date is required for override' }, { status: 400 });
      
      await adminDb.collection('schedule_overrides').doc(date).set(overrideData);
    } else if (type === 'delete_override') {
      const { date } = data;
      await adminDb.collection('schedule_overrides').doc(date).delete();
    } else {
      return NextResponse.json({ error: 'Invalid update type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
