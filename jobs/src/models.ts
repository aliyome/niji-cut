export interface Subtitle {
  id: string;
  sceneId: number | string;
  name: string;
  from: string;
  to: string;
  text: string;
  option?: {};
}

export interface Scene {
  id: string;
  name: string;
  from: string;
  to: string;
}
