import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  ngOnInit(): void {}

  async loginAnonymously() {
    await this.auth.signInAnonymously();
    this.router.navigate(['/', 'home']);
  }

  async loginWithTwitterId() {
    await this.auth.signInWithPopup(new auth.TwitterAuthProvider());
    this.router.navigate(['/', 'home']);
  }
}
