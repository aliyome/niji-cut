import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

const regYoutubeVideoId = /(?=v=([^&?]{11}))|(?=^\s*([^&?]{11})\s*$)|(?=youtu\.be\/([^&?]{11}))/;

@Component({
  selector: 'app-input-video-url',
  templateUrl: './input-video-url.component.html',
  styleUrls: ['./input-video-url.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputVideoUrlComponent implements OnInit {
  @Output()
  submitVideoId = new EventEmitter<string>();

  url = new FormControl('https://youtu.be/H5aQwFhjYzI', [
    Validators.required,
    Validators.pattern(regYoutubeVideoId),
  ]);

  form = new FormGroup({ url: this.url });

  constructor() {}

  ngOnInit(): void {}

  onSubmit() {
    if (this.url.invalid) {
      return;
    }

    const match = regYoutubeVideoId.exec(this.url.value);
    if (!match) {
      throw new Error(`${this.url.value} is not a youtube live url`);
    }
    const [, v1, v2, v3] = match;
    const videoId = v1 ?? v2 ?? v3;

    this.submitVideoId.emit(videoId);
  }
}
