import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SubtitleStore, SubtitleState } from './subtitle.store';
import { Scene } from './scene.model';
import { Subtitle } from './subtitle.model';
import { map } from 'rxjs/operators';
import { convertHMSFtoSeconds } from '../utils';
import { Observable } from 'rxjs';
import { orderBy } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class SubtitleQuery extends QueryEntity<SubtitleState> {
  constructor(protected store: SubtitleStore) {
    super(store);
  }

  selectAllSorted() {
    return this.selectAll().pipe(
      map((subs) => orderBy(subs, ['from'], ['asc'])),
    );
  }
}
