import { EditorQuery } from '@/store/editor.query';
import { EditorService, SyncTimeTarget } from '@/store/editor.service';
import { Scene, Subtitle } from '@/store/models';
import { SceneQuery } from '@/store/scene.query';
import { SceneService } from '@/store/scene.service';
import { SubtitleQuery } from '@/store/subtitle.query';
import { SubtitleService } from '@/store/subtitle.service';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { PlayerComponent } from './player/player.component';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { EditorState } from '@/store/editor.store';
import { guid } from '@datorama/akita';
import { map, combineLatest } from 'rxjs/operators';
import { AngularFireFunctions } from '@angular/fire/functions';
import { convertHMSFtoSeconds } from 'src/app/utils';

type Mode = 'scene-add' | 'scene-edit' | 'subtitle-add' | 'subtitle-edit';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  @ViewChild(PlayerComponent)
  player!: PlayerComponent;

  // reactive
  videoId$ = this.editorQuery.select('videoId');
  scene$ = this.sceneQuery.selectActive();
  scenes$ = this.sceneQuery.selectAll();
  // subtitles$ = this.sceneQuery.subtitles();
  subtitles$ = this.subtitleQuery.selectAllSorted();

  // mode
  mode: Mode = 'scene-add';

  subtitle: Subtitle | null = null;

  get sceneInputMode() {
    if (this.mode === 'scene-add' || this.mode === 'scene-edit') {
      return this.mode;
    } else {
      return null;
    }
  }

  get subtitleInputMode() {
    if (this.mode === 'subtitle-add' || this.mode === 'subtitle-edit') {
      return this.mode;
    } else {
      return null;
    }
  }

  // FIXME: use select active. but dont work for now.
  // subtitles$ = this.subtitleQuery.selectAll().pipe(
  //   combineLatest(this.scene$),
  //   map(([subs, scene]) => subs.filter((sub) => sub.sceneId === scene?.id)),
  // );

  // TODO: extract to service
  registerData = this.func.httpsCallable('register');

  constructor(
    private readonly editorService: EditorService,
    private readonly editorQuery: EditorQuery,
    private readonly sceneQuery: SceneQuery,
    private readonly sceneService: SceneService,
    private readonly subtitleQuery: SubtitleQuery,
    private readonly subtitleService: SubtitleService,
    private readonly formsManager: AkitaNgFormsManager<EditorState>,
    private readonly func: AngularFireFunctions,
  ) {}

  ngOnInit(): void {
    this.initYouTubePlayer();
  }

  setVideoId(videoId: string) {
    this.editorService.setVideoId(videoId);
  }

  onSelectScene(scene: Scene) {
    this.sceneService.activate(scene.id);
    const time = convertHMSFtoSeconds(scene.from);
    this.player.seekTo(time);
  }

  onSelectSubtitle(subtitle: Subtitle) {
    const time = convertHMSFtoSeconds(subtitle.from);
    this.subtitle = subtitle;
    this.player.seekTo(time);
  }

  commitScene(scene: Scene) {
    scene.id = scene.id ? scene.id : guid();
    this.sceneService.add(scene);
  }

  deleteScene(scene: Scene) {
    this.sceneService.remove(scene.id);
  }

  commitSubtitle(sub: Subtitle) {
    sub.id = sub.id ? sub.id : guid();
    sub.sceneId = this.sceneQuery.getActive().id;
    this.subtitleService.add(sub);
  }

  deleteSubtitle(sub: Subtitle) {
    this.subtitleService.remove(sub.id);
  }

  // FIXME: クソ
  syncCurrentTime(target: SyncTimeTarget) {
    const time = this.player.getCurrentTime();
    this.editorService.setTime(time, target);
  }

  async register() {
    const videoId = this.editorQuery.getValue().videoId;
    const scenes = this.sceneQuery.getAll();
    const subtitles = this.subtitleQuery.getAll();
    const id = await this.registerData({
      videoId,
      scenes,
      subtitles,
    }).toPromise();
    console.log(id);
  }

  private initYouTubePlayer() {
    // This code loads the IFrame Player API code asynchronously, according to the instructions at
    // https://developers.google.com/youtube/iframe_api_reference#Getting_Started
    const tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }
}
