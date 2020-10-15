import { EditorState } from '@/store/editor.store';
import { Scene } from '@/store/models';
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
import { guid } from '@datorama/akita';
import { AkitaNgFormsManager } from '@datorama/akita-ng-forms-manager';
import { convertSecondsToHMSF } from 'src/app/utils';

import { PlayerComponent } from '../player/player.component';

const timeSecondsValidator = [Validators.min(0), Validators.max(60 * 60 * 12)];
const MAX_NAME_LENGTH = 32;

@Component({
  selector: 'app-input-scene',
  templateUrl: './input-scene.component.html',
  styleUrls: ['./input-scene.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputSceneComponent implements OnInit, OnDestroy, OnChanges {
  @Input()
  scene?: Scene | null;

  @Input()
  player!: PlayerComponent;

  @Input()
  mode!: 'scene-add' | 'scene-edit';

  @Output()
  submitForm = new EventEmitter<Scene>();

  @Output()
  add = new EventEmitter<Scene>();

  @Output()
  edit = new EventEmitter<Scene>();

  @Output()
  delete = new EventEmitter<Scene>();

  form = new FormGroup({
    id: new FormControl(guid(), Validators.maxLength(MAX_NAME_LENGTH)),
    name: new FormControl('', Validators.maxLength(MAX_NAME_LENGTH)),
    from: new FormControl('', timeSecondsValidator),
    to: new FormControl('', timeSecondsValidator),
  });

  constructor(private formsManager: AkitaNgFormsManager<EditorState>) {}

  ngOnInit(): void {
    this.formsManager.upsert('scene', this.form);
  }

  ngOnDestroy(): void {
    this.formsManager.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['scene']?.currentValue) {
      return;
    }
    if (changes['scene']?.currentValue === changes['scene']?.previousValue) {
      return;
    }
    const scene = changes['scene'].currentValue as Scene;
    // console.log(scene);
    this.form.patchValue(scene);
  }

  // FIXME: クソ
  syncCurrentTime(target: 'from' | 'to') {
    const time = this.player.getCurrentTime();
    const hmsf = convertSecondsToHMSF(time);
    this.form.get(target)?.patchValue(hmsf);
  }

  onSubmit() {
    const scene = this.form.value;
    this.submitForm.emit(scene);
  }

  onAdd() {
    const scene = this.form.value;
    this.add.emit({ ...scene, id: null });
  }

  onEdit() {
    const scene = this.form.value;
    this.edit.emit(scene);
  }

  onDelete() {
    const scene = this.form.value;
    this.delete.emit(scene);
  }
}
