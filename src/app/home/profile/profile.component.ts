import {Component, OnInit} from '@angular/core';
import firebase from 'firebase/app';
import {MatDialog} from '@angular/material/dialog';
import {VerifyPhoneComponent} from '../verify-phone/verify-phone.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: firebase.User | null = null;

  constructor(private dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.user = firebase.auth().currentUser;
  }

  openVerifyPhoneNumberDialog(): void {
    this.dialog.open(VerifyPhoneComponent);
  }
}
