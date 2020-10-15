import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { SceneStore } from './scene.store';
import { Scene } from './scene.model';
import { SubtitleStore } from './subtitle.store';
import { SubtitleQuery } from './subtitle.query';

const dummyScenes: Scene[] = [
  { id: 1, name: 'しーん1', from: '00:05:00.000', to: '00:05:30.000' },
  { id: 2, name: 'しーん2', from: '00:15:00.000', to: '00:15:30.000' },
];

@Injectable({ providedIn: 'root' })
export class SceneService {
  constructor(
    private sceneStore: SceneStore,
    private subtitleStore: SubtitleStore,
    private subtitleQuery: SubtitleQuery,
  ) {}

  getDummy() {
    this.sceneStore.add(dummyScenes);
  }

  add(scene: Scene) {
    this.sceneStore.add(scene);
  }

  update(id: ID, scene: Partial<Scene>) {
    this.sceneStore.update(id, scene);
  }

  remove(id: ID) {
    this.sceneStore.remove(id);
  }

  clear() {
    this.sceneStore.reset();
  }

  activate(id: ID) {
    this.sceneStore.setActive(id);
    const subIds = this.subtitleQuery
      .getAll()
      .filter((sub) => sub.sceneId === id)
      .map((sub) => sub.id);
    // FIXME: dont work setActive for multi. is it a bug?
    this.subtitleStore.setActive(subIds);
  }
}
