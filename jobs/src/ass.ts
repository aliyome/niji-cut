import { Scene, Subtitle } from './models';
import { calcFontSize, subtract, getDuration } from './srt';
import { convertSecondsToHMSF, convertHMSFtoSeconds } from './util';
import { createWriteStream } from 'fs';
import { orderBy } from 'lodash';

/**
 * FIXME: other font styles
 * %size%: 32
 * %weight%: 900
 * %outline%: 4
 * %color%: FFFFFF
 * %outline_color%: 000000
 */
const TEMPLATE = `[Script Info]
; This is an Advanced Sub Station Alpha v4+ script.
Title: Converted at http://convert.jamack.net
ScriptType: v4.00+
Collisions: Normal
PlayDepth: 0

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans Jp,%size%,&H00%color%,&H0300FFFF,&H00%outline_color%,&H02000000,%weight%,0,0,0,100,100,0,0,1,%outline%,1,2,10,10,10,1

[Events]
Format: Layer, Start, End, Style, Actor, MarginL, MarginR, MarginV, Effect, Text
`;

/**
 * %from%: 00:00:00.00
 * %to%: 00:00:00.00
 * %style%: Default
 * %text%: じまく
 */
const LINE = `Dialogue: 0,%from%,%to%,Default,,0,0,0,,%text%`;

type AssLine = {
  from: string;
  to: string;
  style: string;
  text: string;
};

const outputPath = 'video.ass';
export const outputAss = async (
  scenes: Scene[],
  subtitles: Subtitle[],
  videoWidth: number,
) => {
  const lines = createAssLines(scenes, subtitles, videoWidth);
  await writeAss(lines, outputPath, videoWidth);
  return outputPath;
};

const createAssLines = (
  scenes: Scene[],
  subtitles: Subtitle[],
  videoWidth: number,
) => {
  const outputLines: AssLine[] = [];
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
        from: from,
        to: to,
        text: sub.text,
        style: 'Default', // FIXME: other styles
      });
    });

    sceneDuration += getDuration(scene.from, scene.to);
  });
  return outputLines;
};

const createHeader = (videoWidth: number) => {
  const fontsize = calcFontSize(videoWidth);
  const weight = '900';
  const outline = '4';
  const color = 'FFFFFF';
  const outlineColor = '000000';
  return TEMPLATE.replace('%size%', fontsize.toString())
    .replace('%weight%', weight)
    .replace('%outline%', outline)
    .replace('%color%', color)
    .replace('%outline_color%', outlineColor);
};

const createLine = (line: AssLine) => {
  return LINE.replace('%from%', line.from.substr(0, 11))
    .replace('%to%', line.to.substr(0, 11))
    .replace('%style%', line.style)
    .replace('%text%', line.text);
};
const writeAss = (lines: AssLine[], filePath: string, videoWidth: number) => {
  return new Promise((resolve, reject) => {
    const stream = createWriteStream(filePath, { encoding: 'utf8' });
    stream.write(createHeader(videoWidth));
    const orderedLines: AssLine[] = orderBy(lines, 'from');
    orderedLines.map(createLine).forEach((line) => {
      stream.write(`${line}\n`);
    });
    stream.on('close', resolve);
    stream.on('error', reject);
    stream.close();
  });
};
