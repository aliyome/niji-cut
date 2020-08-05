export type Job = {
  videoId: string;
  scenes: Scene[];
  subtitles: Subtitle[];
};

export type Scene = {
  id: number | string;
  name: string;
  from: number;
  to: number;
};

export type Subtitle = {
  id: number | string;
  sceneId: number | string;
  name: string;
  from: number;
  to: number;
  text: string;
  option?: {};
};
