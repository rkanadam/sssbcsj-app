import {Component, Inject} from '@angular/core';
// @ts-ignore
import * as ClassicEditor from '../../../../lib/ckeditor';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../common-ui/api.service';
import {Signee, SignupSheet} from '../types';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-sms-reminder',
  templateUrl: './sms-reminder.component.html',
  styleUrls: ['./sms-reminder.component.scss']
})
export class SmsReminderComponent {

  Editor = ClassicEditor;

  config = {
    mention: {
      feeds: [
        {
          marker: '@',
          feed: ['@date', '@description', '@email', '@itemCount', '@item', '@location', '@name', '@notes', '@phoneNumber', '@quantity', '@signedUpOn', '@title'],
          minimumCharacters: 1
        }
      ]
    }
  };
  template = `
    Sairam @name,

     Thank you for signing up for @item. Please do remember to drop this off by @date. Please do use this a gentle reminder.

     Service: @description
     When: @date
     Drop Off Location: @location
     Item: @item
     Quantity: @itemCount
     Notes: @notes

    Thank you! Sairam!
`;
  disableSend = false;

  constructor(private dialogRef: MatDialogRef<SmsReminderComponent>, private api: ApiService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: { signees: Array<Signee>, signupSheet: SignupSheet }) {
  }

  sendSMS(): void {
    this.disableSend = true;
    if (this.data.signupSheet && this.data.signees) {
      // '@date', '@description', '@email', '@item', '@itemCount', '@name', '@notes', '@phoneNumber', '@quantity', '@signedUpOn', '@title'
      const smses = this.data.signees.map(signee => {
        const context = new Map<string, any>();
        context.set('@date', this.data.signupSheet?.date);
        context.set('@description', this.data.signupSheet?.description);
        context.set('@email', signee.email);
        context.set('@item', signee.item);
        context.set('@itemCount', signee.itemCount);
        context.set('@location', this.data.signupSheet.location);
        context.set('@name', signee.name);
        context.set('@notes', signee.notes);
        context.set('@phoneNumber', signee.phoneNumber);
        context.set('@quantity', signee.quantity);
        context.set('@signedUpOn', signee.signedUpOn);
        context.set('@title', this.data.signupSheet?.title);
        let sms = this.template;
        for (const mention of this.config.mention.feeds[0].feed) {
          sms = sms.replace(new RegExp(mention, 'g'), context.get(mention) || '');
        }
        return {
          message: sms,
          to: signee.phoneNumber
        };
      });
      this.api.post<boolean>('sendSMS', smses).subscribe((result) => {
        if (result) {
          this.snackBar.open(`SMSes were successfully sent to ${this.data.signees?.length} numbers.`, 'OK', {
            duration: 2000
          });
        } else {
          this.snackBar.open(`Something went wrong, please try again in sometime.`, 'OK', {
            duration: 2000
          });
        }
        this.disableSend = false;
        this.dialogRef.close();
      }, (error) => {
        this.disableSend = false;
        this.snackBar.open(`Something went wrong, please try again in sometime.`, 'OK', {
          duration: 2000
        });
      });
    }
  }
}
