import * as admin from 'firebase-admin';

export function hasFirebaseAdminConfig(): boolean {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
    process.env.FIREBASE_CLIENT_EMAIL &&
    process.env.FIREBASE_PRIVATE_KEY
  );
}

function getApp(): admin.app.App {
  if (admin.apps.length) return admin.app();

  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Firebase admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Firebase admin initialization error', message);
    throw error;
  }
}

// Lazy accessor — never evaluated at module load / build time
export function getAdminDb(): admin.firestore.Firestore {
  return getApp().firestore();
}

export function getOptionalAdminDb(): admin.firestore.Firestore | null {
  if (!hasFirebaseAdminConfig()) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Firebase admin is not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY.');
    }

    console.warn('Firebase admin is not configured. Using development-only booking fallback.');
    return null;
  }

  return getAdminDb();
}

/** @deprecated Use getAdminDb() instead */
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop, receiver) {
    return Reflect.get(getAdminDb(), prop, receiver);
  },
});
