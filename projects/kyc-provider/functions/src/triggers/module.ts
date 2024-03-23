import admin from 'firebase-admin';

export const collectionPath = 'triggers';

export async function isTriggeredOnce(eventId: string) {
  return await admin.firestore().runTransaction(async (t) => {
    const ref = admin.firestore().collection(collectionPath).doc(eventId);

    const doc = await t.get(ref);
    if (doc.exists) {
      return true;
    }
    t.set(ref, {});
    return false;
  });
}
