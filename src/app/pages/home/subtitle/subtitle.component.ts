import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Subtitle } from '../../../state/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-subtitle',
  templateUrl: './subtitle.component.html',
  styleUrls: ['./subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubtitleComponent implements OnInit {
  @Input()
  subtitles!: Subtitle[];

  @Output()
  subtitleSelect = new EventEmitter();

  form = new FormControl();

  constructor() {}

  ngOnInit(): void {}

  onSelectChange() {
    const subtitle = this.form.value[0];
    this.subtitleSelect.emit(subtitle);
  }

  onClick(subtitle: Subtitle) {
    this.subtitleSelect.emit(subtitle);
  }
}
