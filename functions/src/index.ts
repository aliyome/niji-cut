import * as functions from 'firebase-functions';
import { createVm } from './gce';
import { storeJob } from './firestore';

const TOKYO = 'asia-northeast1';

export const register = functions
  .region(TOKYO)
  .https.onCall(async (job, context) => {
    try {
      const uid = context.auth?.uid;
      const jobId = (await storeJob(job, uid)).toLowerCase();
      await createVm(jobId);
      return jobId;
    } catch (err) {
      functions.logger.error(err);
      return null;
    }
  });
