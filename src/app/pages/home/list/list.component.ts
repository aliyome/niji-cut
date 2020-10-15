import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { map, share, switchMap } from 'rxjs/operators';
import { Scene, Subtitle } from '@/store/models';

export type Job = {
  id: string;
  videoId: string;
  scenes: Scene[];
  subtitles: Subtitle[];
};

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  uid$ = this.auth.user.pipe(
    map((user) => user?.uid),
    share(),
  );

  jobs$ = this.uid$.pipe(
    switchMap((uid) =>
      this.firestore
        .collection('jobs', (query) => query.where('uid', '==', uid))
        .get(),
    ),
    map((collection) => (collection.docs as unknown) as Job[]),
  );
  // jobs$ = this.uid$.pipe(uid: string) =>
  //   this.firestore.collection('jobs', (query) => query.where('uid', '==', uid));

  constructor(
    private firestore: AngularFirestore,
    private auth: AngularFireAuth,
  ) {}

  ngOnInit(): void {}
}
