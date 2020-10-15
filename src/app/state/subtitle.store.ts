import { Injectable } from '@angular/core';
import {
  EntityState,
  EntityStore,
  MultiActiveState,
  StoreConfig,
} from '@datorama/akita';

import { Subtitle } from './subtitle.model';

export interface SubtitleState
  extends EntityState<Subtitle>,
    MultiActiveState {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'subtitle' })
export class SubtitleStore extends EntityStore<SubtitleState> {
  constructor() {
    super();
  }
}
