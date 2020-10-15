import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { Scene } from '../../../state/models';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-scene',
  templateUrl: './scene.component.html',
  styleUrls: ['./scene.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SceneComponent implements OnInit {
  @Input()
  scenes: Scene[] = [];

  @Output()
  selectScene = new EventEmitter<Scene>();

  form = new FormControl();

  constructor() {}

  ngOnInit(): void {}

  onSelectChange() {
    const scene = this.form.value[0];
    this.selectScene.emit(scene);
  }

  onClick(scene: Scene) {
    this.selectScene.emit(scene);
  }
}
