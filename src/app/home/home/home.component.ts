import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatDialog} from '@angular/material/dialog';
import {VerifyPhoneComponent} from '../verify-phone/verify-phone.component';
import firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy, OnInit {
  mobileQuery: MediaQueryList;
  user: firebase.User | null = null;


  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private dialog: MatDialog) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  mobileQueryListener(): void {
    if (this.changeDetectorRef) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  openVerifyPhoneNumberDialog(): void {
    this.dialog.open(VerifyPhoneComponent);
  }

  ngOnInit(): void {
    this.user = firebase.auth().currentUser;
  }
}
