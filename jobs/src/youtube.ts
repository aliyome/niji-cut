import ytdl from 'ytdl-core';
import * as fs from 'fs';

const isMp4 = (format: ytdl.videoFormat) => format.container === 'mp4';

export const downloadYoutube = (videoId: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const filename = `${videoId}.mp4`;
    const writeStream = fs.createWriteStream(filename);
    return ytdl(videoId, {
      quality: 'highest',
      filter: isMp4,
      lang: 'ja',
    })
      .pipe(writeStream)
      .on('close', () => resolve(filename))
      .on('error', reject);
  });
