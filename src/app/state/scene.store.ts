import { Injectable } from '@angular/core';
import { Scene } from './scene.model';
import {
  EntityState,
  ActiveState,
  EntityStore,
  StoreConfig,
} from '@datorama/akita';

export interface SceneState extends EntityState<Scene>, ActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'scene' })
export class SceneStore extends EntityStore<SceneState> {
  constructor() {
    super();
  }
}
