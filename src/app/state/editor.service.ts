import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { EditorStore } from './editor.store';
import { SceneService } from './scene.service';
import { SubtitleService } from './subtitle.service';
import { tap } from 'rxjs/operators';
import { convertSecondsToHMSF } from '../utils';

export type SyncTimeTarget =
  | 'subtitle-from'
  | 'subtitle-to'
  | 'scene-from'
  | 'scene-to';

@Injectable({ providedIn: 'root' })
export class EditorService {
  constructor(
    private editorStore: EditorStore,
    private sceneService: SceneService,
    private subtitleService: SubtitleService,
  ) {}

  setVideoId(videoId: string) {
    this.editorStore.update({ videoId });
    this.sceneService.clear();
    this.subtitleService.clear();
  }

  setTime(time: number, target: SyncTimeTarget) {
    if (target === 'scene-from') {
      this.editorStore.update((state) => ({
        ...state,
        scene: {
          ...state.scene,
          from: convertSecondsToHMSF(time),
        },
      }));
    } else if (target === 'scene-to') {
      this.editorStore.update((state) => ({
        ...state,
        scene: {
          ...state.scene,
          to: convertSecondsToHMSF(time),
        },
      }));
    } else if (target === 'subtitle-from') {
      this.editorStore.update((state) => ({
        ...state,
        subtitle: {
          ...state.subtitle,
          from: convertSecondsToHMSF(time),
        },
      }));
    } else if (target === 'subtitle-to') {
      this.editorStore.update((state) => ({
        ...state,
        subtitle: {
          ...state.subtitle,
          to: convertSecondsToHMSF(time),
        },
      }));
    } else {
      const a: never = target;
    }
  }
}
