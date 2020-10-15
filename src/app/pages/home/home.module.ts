import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  AngularFireFunctionsModule,
  ORIGIN,
  REGION,
} from '@angular/fire/functions';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { YouTubePlayerModule } from '@angular/youtube-player';

import { environment } from '../../../environments/environment';
import { HmsfPipe } from '../../hmsf-pipe';
import { SecondsPipe } from '../../seconds-pipe';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { InputSceneComponent } from './input-scene/input-scene.component';
import { InputSubtitleComponent } from './input-subtitle/input-subtitle.component';
import { InputVideoUrlComponent } from './input-video-url/input-video-url.component';
import { PlayerComponent } from './player/player.component';
import { SceneComponent } from './scene/scene.component';
import { SubtitleComponent } from './subtitle/subtitle.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PreviewComponent } from './preview/preview.component';
import { ListComponent } from './list/list.component';

const materials = [
  MatInputModule,
  MatSliderModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatListModule,
  MatTooltipModule,
  MatSlideToggleModule,
];

const debugProviders = environment.production
  ? []
  : [{ provide: ORIGIN, useValue: 'http://localhost:5001' }];

@NgModule({
  declarations: [
    HomeComponent,
    InputVideoUrlComponent,
    PlayerComponent,
    InputSubtitleComponent,
    HmsfPipe,
    SecondsPipe,
    SceneComponent,
    SubtitleComponent,
    InputSceneComponent,
    PreviewComponent,
    ListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    YouTubePlayerModule,
    ...materials,
    AngularFireFunctionsModule,
    AngularFirestoreModule,
  ],
  providers: [
    { provide: REGION, useValue: 'asia-northeast1' },
    // ...debugProviders,
  ],
})
export class HomeModule {}
