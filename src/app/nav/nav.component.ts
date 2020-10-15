import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent {
  // FIXME: always handset mode for now.
  isHandset$: Observable<boolean> = of(true);
  // isHandset$: Observable<boolean> = this.breakpointObserver
  //   .observe(Breakpoints.Handset)
  //   .pipe(
  //     map((result) => result.matches),
  //     shareReplay(),
  //   );

  user$ = this.auth.user;

  formDark = new FormControl(false);
  // window.matchMedia('(prefers-color-scheme: dark)').matches,

  constructor(
    private breakpointObserver: BreakpointObserver,
    private auth: AngularFireAuth,
    private router: Router,
  ) {}

  async logout() {
    await this.auth.signOut();
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.router.navigate(['home']);
  }

  navigateToList() {
    this.router.navigate(['home', 'list']);
  }
}
