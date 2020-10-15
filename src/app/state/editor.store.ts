import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';

export interface SubtitleFormState {
  id: string;
  name: string;
  from: string;
  to: string;
  text: string;
}

export interface SceneFormState {
  id: string;
  name: string;
  from: string;
  to: string;
}

export interface EditorState {
  videoId: string;
  subtitle: SubtitleFormState;
  scene: SceneFormState;
}

export function createInitialState(): EditorState {
  return {
    videoId: '',
    subtitle: {
      id: '',
      name: '',
      from: '0',
      to: '0',
      text: '',
    },
    scene: {
      id: '',
      name: '',
      from: '0',
      to: '0',
    },
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'editor' })
export class EditorStore extends Store<EditorState> {
  constructor() {
    super(createInitialState());
  }
}
