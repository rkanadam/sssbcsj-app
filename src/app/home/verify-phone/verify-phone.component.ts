import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from '../../common-ui/utils.service';
import {AuthService} from '../../auth/auth.service';
import {FormControl} from '@angular/forms';
import firebase from 'firebase/app';
import {isEmpty} from 'lodash-es';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss']
})
export class VerifyPhoneComponent implements AfterViewInit {

  isVerifying = false;
  phoneNumber = new FormControl('');
  verificationCode = new FormControl('');
  @ViewChild('recaptcha') recaptcha?: ElementRef;
  private recaptchaToken = '';
  private recaptchaVerifier: firebase.auth.RecaptchaVerifier | null = null;
  private verificationToken = '';


  constructor(
    private dialogRef: MatDialogRef<VerifyPhoneComponent>,
    private httpClient: HttpClient,
    private utils: UtilsService,
    private authService: AuthService) {
  }

  cancel(): void {
    this.dialogRef.close();
  }

  verify(): void {
    this.isVerifying = true;
    this.httpClient.post<boolean>(`${this.utils.getBaseApiUrl()}/profile/verifyPhoneSMSCode`, {
      verificationToken: this.verificationToken,
      verificationCode: this.verificationCode.value
    }, {
      headers: this.authService.getHeaders(),
    }).subscribe(isSuccessful => {
      console.log(isSuccessful);
    });
  }

  sendVerificationCode(): void {
    this.isVerifying = true;
    this.httpClient.post<{ verificationToken: string }>(`${this.utils.getBaseApiUrl()}/profile/sendVerificationCode`, {
      recaptchaToken: this.recaptchaToken,
      phoneNumber: this.phoneNumber.value
    }, {
      headers: this.authService.getHeaders(),
    }).subscribe(({verificationToken}) => {
      this.verificationToken = verificationToken;
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
