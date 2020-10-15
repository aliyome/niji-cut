import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Subtitle, Scene } from '../../../state/models';
import { YouTubePlayer } from '@angular/youtube-player';
import {
  first,
  filter,
  tap,
  switchMapTo,
  map,
  takeUntil,
  repeat,
  shareReplay,
  share,
  switchMap,
  startWith,
} from 'rxjs/operators';
import {
  interval,
  Subscription,
  Observable,
  BehaviorSubject,
  Subject,
  of,
  zip,
} from 'rxjs';
import { SceneQuery } from '@/store/scene.query';
import { SubtitleQuery } from '@/store/subtitle.query';
import { PlayerQuery } from '@/store/player.query';
import { PlayerService } from '@/store/player.service';
import { convertHMSFtoSeconds } from 'src/app/utils';
import { isEqual } from 'lodash-es';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayerComponent implements OnInit, AfterViewInit {
  @ViewChild(YouTubePlayer)
  readonly preview!: YouTubePlayer;

  @Input()
  readonly videoId: string = '';

  @Input()
  readonly scene: Scene | null = null;

  @Input()
  readonly subtitles: Subtitle[] | null = null;

  get computedSubtitles() {
    return this.subtitles?.map((sub) => ({
      ...sub,
      fromNum: convertHMSFtoSeconds(sub.from),
      toNum: convertHMSFtoSeconds(sub.to),
    }));
  }

  get from() {
    return this.scene?.from ?? 0;
  }
  get to() {
    return this.scene?.to ?? 0;
  }

  currentSubtitles$ = new BehaviorSubject<Subtitle[]>([]);

  private subscription = new Subscription();

  constructor() {}

  ngOnInit(): void {}

  async ngAfterViewInit(): Promise<void> {
    await this.preview.ready.pipe(first()).toPromise();
    this.observeCurrentSubtitles();
  }

  getCurrentTime(): number {
    return this.preview.getCurrentTime();
  }

  seekTo(to: number): void {
    return this.preview.seekTo(to, true);
  }

  play(): void {
    this.preview.playVideo();
  }

  stop(): void {
    this.preview.stopVideo();
  }

  private observeCurrentSubtitles() {
    const isPlaying$ = this.preview.stateChange.pipe(
      map((state) => state.data === YT.PlayerState.PLAYING),
    );
    const isNotPlaying$ = isPlaying$.pipe(filter((playing) => !playing));

    const currentTime$ = isPlaying$.pipe(
      switchMapTo(interval(100)),
      map(() => this.preview.getCurrentTime()),
      takeUntil(isNotPlaying$),
      repeat(),
      shareReplay(1),
    );

    const currentSubtitles$ = currentTime$.pipe(
      map(
        (secs) =>
          this.computedSubtitles?.filter(
            (sub) => sub.fromNum <= secs && secs <= sub.toNum,
          ) ?? [],
      ),
      share(),
    );

    const zip$ = zip(
      currentSubtitles$.pipe(startWith('INITIAL')),
      currentSubtitles$,
    ).pipe(
      filter(([prev, curr]) => !isEqual(prev, curr)),
      map(([prev, curr]) => curr),
      share(),
    );

    this.subscription.add(
      zip$.subscribe((subs) => {
        console.log(subs);
        this.currentSubtitles$.next(subs);
      }),
    );
  }
}
