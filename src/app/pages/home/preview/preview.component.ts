import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
} from '@angular/core';
import { SubtitleQuery } from '@/store/subtitle.query';
import { SceneQuery } from '@/store/scene.query';
import { PlayerComponent } from '../player/player.component';
import { BehaviorSubject, interval } from 'rxjs';
import { switchMap, map, startWith } from 'rxjs/operators';
import { convertSecondsToHMSF, convertHMSFtoSeconds } from 'src/app/utils';
import { createScene, Scene, Subtitle } from '@/store/models';
import { orderBy } from 'lodash-es';

const dummyScene: Scene = {
  id: 'dummy',
  name: 'dummy',
  from: '00:00:00.000',
  to: '12:00:00.000',
};

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviewComponent implements OnInit {
  @ViewChild(PlayerComponent)
  player!: PlayerComponent;

  @Input()
  videoId!: string;

  currentTimeSub = new BehaviorSubject<number>(0);

  currentScene: Scene = dummyScene;
  subtitles: Subtitle[] = [];

  currentScene$ = this.currentTimeSub.pipe(
    switchMap((time) =>
      this.sceneQuery
        .selectAll()
        .pipe(
          map((scenes) =>
            scenes.find(
              (scene) =>
                scene.from <= convertSecondsToHMSF(time) &&
                convertSecondsToHMSF(time) <= scene.to,
            ),
          ),
        ),
    ),
    startWith(dummyScene),
  );

  subtitles$ = this.subtitleQuery.selectAll();

  constructor(
    private sceneQuery: SceneQuery,
    private subtitleQuery: SubtitleQuery,
  ) {}

  ngOnInit(): void {}

  startPreview(): void {
    const scenes = this.sceneQuery.getAll();
    if (!scenes || scenes.length === 0) {
      return;
    }
    this.subtitles = this.subtitleQuery.getAll();

    const sorted = orderBy(scenes, 'from');

    let current = 0;
    this.currentScene = sorted[current];
    this.player.seekTo(convertHMSFtoSeconds(this.currentScene.from));
    const sub = interval(100).subscribe(() => {
      const time = this.player.getCurrentTime();
      console.log(time);
      if (convertHMSFtoSeconds(this.currentScene.to) <= time) {
        if (current + 1 < sorted.length) {
          this.currentScene = sorted[++current];
          this.player.seekTo(convertHMSFtoSeconds(this.currentScene.from));
        } else {
          this.player.stop();
          sub.unsubscribe();
        }
      }
    });
  }
}
