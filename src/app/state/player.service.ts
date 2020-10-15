import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { PlayerStore } from './player.store';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  constructor(private playerStore: PlayerStore) {}
}
