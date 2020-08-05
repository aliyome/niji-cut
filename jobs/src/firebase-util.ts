import * as admin from 'firebase-admin';
import { Scene, Subtitle } from './models';
import { dummyScenes, dummySubtitles } from '../dummy';
import dayjs from 'dayjs';

admin.initializeApp({
  databaseURL: 'https://niji-cut.firebaseio.com',
  storageBucket: 'niji-cut.appspot.com',
});

export type Job = {
  id: string;
  videoId: string;
  scenes: Scene[];
  subtitles: Subtitle[];
  createdAt: admin.firestore.Timestamp;
};

export const getJob = async (id: string): Promise<Job> => {
  const entry = await admin.firestore().doc(`jobs/${id}`).get();
  return entry.data() as Job;
};

export const uploadVideo = async (filename: string, jobId: string) => {
  const res = await admin
    .storage()
    .bucket()
    .upload(filename, {
      destination: `${jobId}.mp4`,
      gzip: true,
      public: true,
    });
  const url = await res[0].getSignedUrl({
    action: 'read',
    expires: dayjs().add(1, 'day').format(),
  });
  return url[0];
};

export const setJobUrl = async (id: string, videoUrl: string) => {
  await admin.firestore().doc(`jobs/${id}`).update({
    url: videoUrl,
  });
};
