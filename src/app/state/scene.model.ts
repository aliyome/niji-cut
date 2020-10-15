export interface Scene {
  id: number | string;
  name: string;
  from: string;
  to: string;
}

export function createScene(params: Partial<Scene>) {
  return {
    ...params,
  } as Scene;
}
