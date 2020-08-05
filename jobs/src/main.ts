import * as child_process from 'child_process';
import { deleteVm } from './gce';
import { downloadYoutube } from './youtube';
import {
  cutScene,
  concatScenes,
  burnSubtitle,
  getVideoInfo,
  getVideoWidth,
} from './ffmpeg';
import { getJob, uploadVideo, setJobUrl } from './firebase-util';
import { convertSecondsToHMSF, convertHMSFtoSeconds } from './util';
import { Scene, Subtitle } from './models';
import { outputSrt } from './srt';
import { writeFileSync } from 'fs';
import { outputAss } from './ass';

const id = process.argv[2];
if (!id) {
  console.log('usage: node main.js _cut_scene_id_');
  process.exit(-1);
}

const cutScenes = async (
  originalFileName: string,
  scenes: Scene[],
  subtitles: Subtitle[],
  width: number,
): Promise<string[]> => {
  const filenames = [];
  for (const scene of scenes) {
    const duration =
      convertHMSFtoSeconds(scene.to) - convertHMSFtoSeconds(scene.from);
    const videofile = await cutScene(
      originalFileName,
      scene.id,
      scene.from,
      duration,
    );
    const subs = subtitles.filter((s) => s.sceneId === scene.id);
    // const srtfile = await outputSrt([scene], subs, width);
    const srtfile = await outputAss([scene], subs, width);
    const burnedfile = `${scene.id}_burned.mp4`;
    await burnSubtitle(videofile, srtfile, burnedfile);
    filenames.push(burnedfile);
  }
  return filenames;
};

const writeFilelist = (scenes: Scene[], outputFile: string) => {
  const list = scenes.map((s) => `file '${s.id}_burned.mp4'`).join('\n');
  writeFileSync(outputFile, list, 'utf8');
};

(async () => {
  const entry = await getJob(id);
  const originalFileName = `H5aQwFhjYzI.mp4`;
  // const originalFileName = await downloadYoutube(entry.videoId);
  const width = await getVideoWidth(originalFileName);
  const filelist = 'filelist.txt';
  await cutScenes(originalFileName, entry.scenes, entry.subtitles, width);
  writeFilelist(entry.scenes, filelist);
  const concatFileName = await concatScenes(filelist);

  // const concatFileName = 'concat.mp4';
  // const url = await uploadVideo(concatFileName, id);
  // await setJobUrl(id, url);
  // console.log(url);
  // const srtFile = await outputSrt(entry.scenes, entry.subtitles);
  // await burnSubtitle(concatFile, srtFile);
  // const filename = 'violet.mp4';
  // const from = '00:10:00.000';
  // const duration = 30.5;
  // const sceneId = '2';
  // await cutScene(filename, sceneId, from, duration);
  // const filelist = 'files.txt';
  // const resultfile = 'concat.mp4';
  // const srtfile = 'video.srt';
  // // await concatScenes(filelist);

  // await burnSubtitle('concat.mp4', 'video.ass', 'ass.mp4');
})().catch(console.error);
