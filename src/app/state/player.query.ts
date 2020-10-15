import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { PlayerStore, PlayerState } from './player.store';

@Injectable({ providedIn: 'root' })
export class PlayerQuery extends Query<PlayerState> {
  constructor(protected store: PlayerStore) {
    super(store);
  }
}
