import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import * as firebaseui from 'firebaseui';
import firebase from 'firebase/app';
import 'firebase/auth';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements AfterViewInit {

  @ViewChild('signin') signinElement?: ElementRef;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
    const firebaseConfig = {
      apiKey: 'AIzaSyB7-Ci3HY80mwyFW9mFuUQ6E7R0NT2FXck',
      authDomain: 'ssbcsj-registration.firebaseapp.com',
      projectId: 'ssbcsj-registration',
      storageBucket: 'ssbcsj-registration.appspot.com',
      messagingSenderId: '684263653197',
      appId: '1:684263653197:web:86c82474dace8489fcc104'
    };
    firebase.initializeApp(firebaseConfig);
  }

  ngAfterViewInit(): void {
    if (this.signinElement) {
      const ui = new firebaseui.auth.AuthUI(firebase.auth());
      ui.start(this.signinElement.nativeElement, {
        signInSuccessUrl: 'signups',
        callbacks: {
          signInSuccessWithAuthResult: (authResult: any, redirectUrl?: string): boolean => {
            this.login(firebase.auth().currentUser);
            return false;
          }
        },
        signInOptions: [
          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        ]
      });

      firebase.auth().onAuthStateChanged(user => {
        this.login(user);
      });
    }
  }

  private login(u: firebase.User | null): void {
    u?.getIdToken().then((idToken) => {
      this.authService.setAuthToken(idToken);
      if (this.route.snapshot.queryParamMap && this.route.snapshot.queryParamMap.has('returnUrl')) {
        const url = this.route.snapshot.queryParamMap.get('returnUrl');
        if (url) {
          this.router.navigateByUrl(url);
        }
      } else {
        this.router.navigate(['signups']);
      }
    });
  }
}
