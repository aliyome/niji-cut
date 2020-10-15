import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { EditorStore, EditorState } from './editor.store';

@Injectable({ providedIn: 'root' })
export class EditorQuery extends Query<EditorState> {
  constructor(protected store: EditorStore) {
    super(store);
  }
}
