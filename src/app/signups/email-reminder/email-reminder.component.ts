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

  template = `<!DOCTYPE html>
<html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
<head>
    <meta name="viewport" content="width=device-width"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
    <title>Sri Sathya Sai Baba Center of Central San Jose - Service Signup Confirmation</title>


    <style type="text/css">
        img {
            max-width: 100%;
        }

        body {
            -webkit-font-smoothing: antialiased;
            -webkit-text-size-adjust: none;
            width: 100% !important;
            height: 100%;
            line-height: 1.6em;
        }

        body {
            background-color: #f6f6f6;
        }

        .itemsTable {
            width: 100%;
            border: 1px solid #AAA;
            border-collapse: collapse;
        }

        .itemsTable td:first-child {
            width: 25%;
            font-weight: bold;
        }

        .itemsTable td {
            padding: 1em;
        }

        .logoContainer {
            text-align: center;
            display: flex;
            align-content: center;
            justify-content: center;
        }

        .logo {
            height: 64px;
            width: 64px;
            background-image: url('http://region7saicenters.org/csj/beta/signups/assets/favicon.png');
            background-size: contain;
            background-position: center;
        }

        @media only screen and (max-width: 640px) {
            body {
                padding: 0 !important;
            }

            h1 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }

            h2 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }

            h3 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }

            h4 {
                font-weight: 800 !important;
                margin: 20px 0 5px !important;
            }

            h1 {
                font-size: 22px !important;
            }

            h2 {
                font-size: 18px !important;
            }

            h3 {
                font-size: 16px !important;
            }

            .container {
                padding: 0 !important;
                width: 100% !important;
            }

            .content {
                padding: 0 !important;
            }

            .content-wrap {
                padding: 10px !important;
            }

            .invoice {
                width: 100% !important;
            }
        }
    </style>
</head>

<body
        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;"
        bgcolor="#f6f6f6">

<table class="body-wrap"
       style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;"
       bgcolor="#f6f6f6">
    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;"
            valign="top"></td>
        <td class="container" width="600"
            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;"
            valign="top">
            <div class="content"
                 style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
                <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope
                       itemtype="http://schema.org/ConfirmAction"
                       style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;"
                       bgcolor="#fff">
                    <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                        <td class="content-wrap"
                            style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;"
                            valign="top">
                            <meta itemprop="name" content="Confirm Email"
                                  style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"/>
                            <table width="100%" cellpadding="0" cellspacing="0"
                                   style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                <tr>
                                    <td class="logoContainer" align="center">
                                        <div class="logo">

                                        </div>
                                    </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <td class="content-block"
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                        valign="top">
                                        <p>Sairam! <b>@name</b></p>
                                        <p>Thank you signing up for the items below. Please treat this e-mail as a gentle reminder</p>
                                    </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <td class="content-block"
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                        valign="top">
                                        <table border="1" class="itemsTable">
                                            <tr>
                                                <td>Service</td>
                                                <td>@title</td>
                                            </tr>
                                            <tr>
                                                <td>Description</td>
                                                <td>@description</td>
                                            </tr>
                                            <tr>
                                                <td>Where</td>
                                                <td>@location</td>
                                            </tr>
                                            <tr>
                                                <td>When</td>
                                                <td>@date</td>
                                            </tr>
                                            <tr>
                                                <td>Item</td>
                                                <td>@item</td>
                                            </tr>
                                            <tr>
                                                <td>Quantity</td>
                                                <td>@itemCount</td>
                                            </tr>
                                            <tr>
                                                <td>Notes</td>
                                                <td>@notes</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                                <tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
                                    <td class="content-block"
                                        style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;"
                                        valign="top">
                                        &mdash; Sri Sathya Sai Baba Center of Central San Jose
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
        </td>
        <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;"
            valign="top"></td>
    </tr>
</table>
</body>
</html>
`;
  disableSend = false;


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
          subject: `[SSSBCSJ] Signup Reminder - ${this.data.signupSheet.title} - ${this.data.signupSheet.date}`,
          to: signee.email
        };
      });
      this.disableSend = true;
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
