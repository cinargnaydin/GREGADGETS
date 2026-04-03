import * as admin from 'firebase-admin';

function getApp(): admin.app.App {
  if (admin.apps.length) return admin.app();

  try {
    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Replace escaped newlines when passed via environment variable string
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error: any) {
    console.error('Firebase admin initialization error', error.message);
    throw error;
  }
}

// Lazy accessor — never evaluated at module load / build time
export function getAdminDb(): admin.firestore.Firestore {
  return getApp().firestore();
}

/** @deprecated Use getAdminDb() instead */
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_target, prop) {
    return (getAdminDb() as any)[prop];
  },
});
