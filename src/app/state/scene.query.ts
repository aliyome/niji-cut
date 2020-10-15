import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { SceneStore, SceneState } from './scene.store';
import { Observable } from 'rxjs';
import { Subtitle } from './subtitle.model';
import { map, switchMap } from 'rxjs/operators';
import { SubtitleQuery } from './subtitle.query';

@Injectable({ providedIn: 'root' })
export class SceneQuery extends QueryEntity<SceneState> {
  constructor(
    protected store: SceneStore,
    private subtitleQuery: SubtitleQuery,
  ) {
    super(store);
  }

  subtitles(): Observable<Subtitle[]> {
    return this.selectActive().pipe(
      switchMap((scene) =>
        this.subtitleQuery
          .selectAll()
          .pipe(
            map((subs) =>
              subs.filter(
                (sub) => scene?.from <= sub.to && sub.from <= scene?.to,
              ),
            ),
          ),
      ),
    );
  }
}
