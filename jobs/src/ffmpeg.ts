// https://creazy.net/2018/03/ffmpeg-no-deterioration-combine-cutout.html

import ffmpegPath from 'ffmpeg-static';
import * as ffprobeStatic from 'ffprobe-static';
import ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobeStatic.path);

export const cutScene = (
  srcFile: string,
  sceneId: string,
  from: string, // HH:mm:ss.fff
  duration: number, // secs
): Promise<string> =>
  new Promise((resolve, reject) => {
    const filename = `${sceneId}.mp4`;
    ffmpeg(srcFile)
      .seekInput(from)
      .inputOption(`-t ${duration}`)
      .output(filename)
      .on('end', () => resolve(filename))
      .run();
  });

export const formatFiles = (filenames: string[]) =>
  filenames.map((name) => `file '${name}'`).join('\n');

export const concatScenes = (filelistPath: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const output = 'concat.mp4';
    ffmpeg()
      .input(filelistPath)
      .inputFormat('concat')
      .inputOptions(['-f concat', '-safe 0'])
      .videoCodec('copy')
      .audioCodec('copy')
      .outputOptions(['-map 0:v', '-map 0:a'])
      .output(output)
      .on('end', () => resolve(output))
      .run();
  });

export const burnSubtitle = (
  videofile: string,
  srtfile: string,
  outfile: string = 'result.mp4',
) =>
  new Promise((resolve, reject) => {
    ffmpeg(videofile)
      .videoFilters([
        {
          filter: 'subtitles',
          options: [`./${srtfile}`, `fontsdir='./fonts'`],
        },
      ])
      .output(outfile)
      .on('end', () => resolve(outfile))
      .run();
  });

export const getVideoInfo = (filename: string): Promise<ffmpeg.FfprobeData> =>
  new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filename, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    });
  });

export const getVideoWidth = async (filename: string) => {
  const probe = await getVideoInfo(filename);
  const info = probe.streams.find((x) => x.codec_type === 'video');
  return info?.width ?? 1280;
};

// exports.outputEncoderInfo = () => {
//   return new Promise((resolve, reject) => {
//     ffmpeg.getAvailableEncoders((err, encoders) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(encoders);
//       }
//     });
//   });
// };
// outputEncoderInfo().then(console.log);
// ffmpeg('video.mp4').output(fs.createWriteStream('out.mp4'), { end: true });
