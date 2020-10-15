export const convertSecondsToHMSF = (seconds: number): string => {
  const minutes = seconds / 60;
  const hours = minutes / 60;
  // console.log(hours, minutes, seconds);

  const h = Math.floor(hours).toString().padStart(2, '0');
  const m = Math.floor(minutes % 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  const f = seconds.toFixed(3).split('.')[1];
  // console.log(h, m, s);

  const result = `${h}:${m}:${s}.${f}`;

  return result;
};

const regHMSF = /(\d{2}):(\d{2}):(\d{2}).(\d{3})/;
export const convertHMSFtoSeconds = (hmsf: string): number => {
  const match = regHMSF.exec(hmsf);
  if (!match) {
    throw new Error('hmsf');
  }
  const [, h, m, s, f] = match;
  const time = Number(h) * 3600 + Number(m) * 60 + Number(s) + Number(f) / 1000;
  return time;
};
