import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {UtilsService} from '../../common-ui/utils.service';
import {AuthService} from '../../auth/auth.service';
import {FormControl, Validators} from '@angular/forms';
import firebase from 'firebase/app';
import {isEmpty} from 'lodash-es';
import {MatSnackBar} from '@angular/material/snack-bar';
import {ApiService} from '../../common-ui/api.service';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements AfterViewInit {

  isVerifying = false;
  phoneNumber = new FormControl('', [
    Validators.required,
    Validators.pattern(/^\d{10}$/),
  ]);
  verificationCode = new FormControl('');
  @ViewChild('recaptcha') recaptcha?: ElementRef;
  private recaptchaToken = '';
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier | null = null;
  private verificationToken = '';


  constructor(
    private dialogRef: MatDialogRef<VerifyPhoneComponent>,
    private api: ApiService,
    private utils: UtilsService,
    private authService: AuthService,
    private snackBar: MatSnackBar) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  verify(): void {
    this.isVerifying = true;
    this.api.post<boolean>('profile/verifyPhoneSMSCode', {
      phoneNumber: this.phoneNumber.value,
      verificationToken: this.verificationToken,
      verificationCode: this.verificationCode.value
    }).subscribe(isSuccessful => {
      this.snackBar.open('SMS successfully verified. Will refresh page');
      window.location.reload();
    }, (error) => {
      this.snackBar.open('Could not verify phone. Please retry in some time');
    });
  }

  sendVerificationCode(): void {
    this.isVerifying = true;
    this.api.post<{ verificationToken: string }>('profile/sendVerificationCode', {
      recaptchaToken: this.recaptchaToken,
      phoneNumber: this.phoneNumber.value
    }).subscribe(({verificationToken}) => {
      this.verificationToken = verificationToken;
      this.snackBar.open('SMS for phone verification send. Please enter verification code to finish verification');
    }, (error) => {
      console.error(error);
      this.snackBar.open('Could not verify phone. Please retry in some time');
    });
  }

  ngAfterViewInit(): void {
    if (this.recaptcha) {
      this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.recaptcha.nativeElement, {
        callback: (recapchaToken: any) => {
          this.recaptchaToken = recapchaToken;
        },
        'expired-callback': () => {
          this.recaptchaToken = '';
        }
      });
      this.recaptchaVerifier.render();
    }
  }

  isRecaptchaVerified(): boolean {
    return !isEmpty(this.recaptchaToken);
  }
}
