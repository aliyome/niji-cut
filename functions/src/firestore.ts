import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Job } from './model';

admin.initializeApp();
const db = admin.firestore();

export const storeJob = async (job: Job, uid?: string) => {
  functions.logger.info('store job: ', job);
  const id = db.collection('jobs').doc().id;
  await db.doc(`jobs/${id}`).set({
    ...job,
    id,
    uid,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return id;
};
