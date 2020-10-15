export interface Subtitle {
  id: number | string;
  sceneId: number | string;
  name: string;
  from: string;
  to: string;
  text: string;
  option?: {};
}

export function createSubtitle(params: Partial<Subtitle>) {
  return {
    ...params,
  } as Subtitle;
}
