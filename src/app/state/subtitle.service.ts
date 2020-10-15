import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { SubtitleStore } from './subtitle.store';
import { Subtitle } from './subtitle.model';
import { tap } from 'rxjs/operators';

const dummySubtitles: Subtitle[] = [
  {
    id: 1,
    sceneId: 1,
    name: '1',
    from: '00:00:00.780',
    to: '00:01:00.990',
    text: 'ほげほげ',
  },
  {
    id: 2,
    sceneId: 1,
    name: '2',
    from: '00:00:00.780',
    to: '01:00:00.990',
    text: 'ずっと表示',
  },
];

@Injectable({ providedIn: 'root' })
export class SubtitleService {
  constructor(private subtitleStore: SubtitleStore) {}

  getDummy() {
    this.subtitleStore.add(dummySubtitles);
  }

  // upsert(id: ID, subtitle: Partial<Subtitle>) {
  //   this.subtitleStore.upsert(id, subtitle);
  // }

  add(subtitle: Subtitle) {
    this.subtitleStore.add(subtitle);
  }

  update(id: ID, subtitle: Partial<Subtitle>) {
    this.subtitleStore.update(id, subtitle);
  }

  remove(id: ID) {
    this.subtitleStore.remove(id);
  }

  clear() {
    this.subtitleStore.reset();
  }
}
