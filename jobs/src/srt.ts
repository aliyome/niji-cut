import { convertSecondsToHMSF, convertHMSFtoSeconds } from './util';
import { Scene, Subtitle } from './models';
import { createWriteStream } from 'fs';
import { orderBy } from 'lodash';
import { dummyScenes, dummySubtitles } from '../dummy';

type SrtLine = {
  from: string;
  to: string;
  color?: string;
  text: string;
  fontsize: number;
};

export const subtract = (leftHmsf: string, rightHmsf: string) => {
  return convertSecondsToHMSF(
    convertHMSFtoSeconds(leftHmsf) - convertHMSFtoSeconds(rightHmsf),
  );
};

export const getDuration = (from: string, to: string) => {
  const fromSec = convertHMSFtoSeconds(from);
  const toSec = convertHMSFtoSeconds(to);
  const duration = toSec - fromSec;
  return duration;
};

const createSrtLines = (
  scenes: Scene[],
  subtitles: Subtitle[],
  videoWidth: number,
) => {
  const fontsize = calcFontSize(videoWidth);
  const outputLines: SrtLine[] = [];
  let sceneDuration = 0;
  scenes.forEach((scene) => {
    const subs = subtitles.filter((sub) => sub.sceneId === scene.id);
    subs.forEach((sub) => {
      const start = subtract(sub.from, scene.from);
      const from = convertSecondsToHMSF(
        convertHMSFtoSeconds(start) + sceneDuration,
      );
      const duration = getDuration(sub.from, sub.to);
      const to = convertSecondsToHMSF(convertHMSFtoSeconds(from) + duration);

      outputLines.push({
        from: from.replace('.', ','),
        to: to.replace('.', ','),
        text: sub.text,
        fontsize,
      });
    });

    sceneDuration += getDuration(scene.from, scene.to);
  });
  return outputLines;
};

const writeSrtLines = (lines: SrtLine[], filePath: string) => {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath, { encoding: 'utf8' });
    const orderdLines: SrtLine[] = orderBy(lines, 'from');
    orderdLines.forEach((line, index) => {
      stream.write(`${index + 1}\n`);
      stream.write(`${line.from} --> ${line.to}\n`);
      stream.write(
        `<font color="#FEFEFE" size="${line.fontsize}px" weight="900">${line.text}</font>\n\n`,
      );
    });
    stream.on('close', resolve);
    stream.on('error', reject);
    stream.close();
  });
};

const outputPath = 'video.srt';
export const outputSrt = async (
  scenes: Scene[],
  subtitles: Subtitle[],
  videoWidth: number,
) => {
  const lines = createSrtLines(scenes, subtitles, videoWidth);
  await writeSrtLines(lines, outputPath);
  return outputPath;
};

const BASE_WIDTH = 1280;
const BASE_FONT_SIZE = 32;
export const calcFontSize = (videoWidth: number) =>
  Math.floor((BASE_FONT_SIZE * videoWidth) / BASE_WIDTH);

// (async () => {
//   await outputSrt(dummyScenes, dummySubtitles);
// })().catch(console.error);
