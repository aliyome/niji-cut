import { Injectable } from '@angular/core';
import { StoreConfig, Store } from '@datorama/akita';

export interface PlayerState {}

export function createInitialState(): PlayerState {
  return {};
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'player' })
export class PlayerStore extends Store<PlayerState> {
  constructor() {
    super(createInitialState());
  }
}
