import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ApiService} from '../../common-ui/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Signee, SignupSheet} from '../types';
// @ts-ignore
import * as ClassicEditor from '../../../../lib/ckeditor';

@Component({
  selector: 'app-email-reminder',
  templateUrl: './email-reminder.component.html',
  styleUrls: ['./email-reminder.component.scss']
})
export class EmailReminderComponent {
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
    <p>Sairam @name,</p>

<p>&nbsp;Thank you for signing up for @item. Please do remember to drop this off by @date. Please do use this a gentle reminder.</p>

<p>
<br>
</p>

<table style="width: 100%;">
  <tbody>
    <tr>
      <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>Service</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">
  <div style="text-align: center;">@description</div>
  </td>
  </tr>
  <tr>
  <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>When</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">
  <div style="text-align: center;">@date</div>
  </td>
  </tr>
  <tr>
  <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>Drop Off Location</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">
  <div style="text-align: center;">@location</div>
  </td>
  </tr>
  <tr>
  <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>Item</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">
  <div style="text-align: center;">@item</div>
  </td>
  </tr>
  <tr>
  <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>Quantity</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">
  <div style="text-align: center;">@itemCount</div>
  </td>
  </tr>
  <tr>
  <td style="width: 22.5771%;">
  <div style="text-align: center;"><strong>Notes</strong></div>
</td>
<td style="width: 77.3128%; text-align: center;">@notes</td>
    </tr>
    </tbody>
    </table>

    <p>
    <br>
      </p>

    <p>Thank you! Sairam!</p>
`;


  constructor(private dialogRef: MatDialogRef<EmailReminderComponent>, private api: ApiService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) private data: { signees: Array<Signee>, signupSheet: SignupSheet }) {
  }

  sendSMS(): void {
    if (this.data.signupSheet && this.data.signees) {
      // '@date', '@description', '@email', '@item', '@itemCount', '@name', '@notes', '@phoneNumber', '@quantity', '@signedUpOn', '@title'
      const emails = this.data.signees.map(signee => {
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
        let email = this.template;
        for (const mention of this.config.mention.feeds[0].feed) {
          email = email.replace(new RegExp(mention, 'g'), context.get(mention) || '');
        }
        return {
          message: email,
          subject: `[SSSBCSJ] Signup Reminder - ${this.data.signupSheet.description} - ${this.data.signupSheet.date}`,
          to: signee.email
        };
      });
      this.api.post<boolean>('sendEMail', emails).subscribe((result) => {
        if (result) {
          this.snackBar.open(`Emails were successfully sent to ${this.data.signees?.length} numbers.`, 'OK', {
            duration: 2000
          });
        } else {
          this.snackBar.open(`Something went wrong, please try again in sometime.`, 'OK', {
            duration: 2000
          });
        }
        this.dialogRef.close();
      }, (error) => {
        this.snackBar.open(`Something went wrong, please try again in sometime.`, 'OK', {
          duration: 2000
        });
      });
    }
  }
}
