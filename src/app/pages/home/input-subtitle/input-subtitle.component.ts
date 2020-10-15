import { EditorState } from '@/store/editor.store';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';

import { Subtitle } from '../../../state/models';
import { PlayerComponent } from '../player/player.component';
import { convertSecondsToHMSF } from 'src/app/utils';
import { guid } from '@datorama/akita';

const timeSecondsValidator = [Validators.min(0), Validators.max(60 * 60 * 12)];
const MAX_TEXT_LENGTH = 21;
const MAX_NAME_LENGTH = 32;

@Component({
  selector: 'app-input-subtitle',
  templateUrl: './input-subtitle.component.html',
  styleUrls: ['./input-subtitle.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSubtitleComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  subtitle?: Subtitle | null;

  @Input()
  player!: PlayerComponent;

  @Input()
  mode!: 'subtitle-add' | 'subtitle-edit';

  @Output()
  submitForm = new EventEmitter<Subtitle>();

  @Output()
  add = new EventEmitter<Subtitle>();

  @Output()
  edit = new EventEmitter<Subtitle>();

  @Output()
  delete = new EventEmitter<Subtitle>();

  form = new FormGroup({
    id: new FormControl(guid(), Validators.maxLength(MAX_NAME_LENGTH)),
    from: new FormControl('', timeSecondsValidator),
    to: new FormControl('', timeSecondsValidator),
    text: new FormControl('', Validators.maxLength(MAX_TEXT_LENGTH)),
  });

  constructor(private formsManager: AkitaNgFormsManager<EditorState>) {}

  ngOnInit(): void {
    this.formsManager.upsert('subtitle', this.form);
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['subtitle']?.currentValue) {
      return;
    }
    if (
      changes['subtitle']?.currentValue === changes['subtitle']?.previousValue
    ) {
      return;
    }
    const subtitle = changes['subtitle'].currentValue as Subtitle;
    // console.log(subtitle);
    this.form.patchValue(subtitle);
  }

  // FIXME: クソ
  syncCurrentTime(target: 'from' | 'to') {
    const time = this.player.getCurrentTime();
    const hmsf = convertSecondsToHMSF(time);
    this.form.get(target)?.patchValue(hmsf);
  }

  onSubmit() {
    const subtitle = this.form.value;
    this.submitForm.emit(subtitle);
  }

  onAdd() {
    const subtitle = this.form.value;
    this.add.emit({ ...subtitle, id: null });
  }

  onEdit() {
    const subtitle = this.form.value;
    this.edit.emit(subtitle);
  }

  onDelete() {
    const subtitle = this.form.value;
    this.delete.emit(subtitle);
  }
}
