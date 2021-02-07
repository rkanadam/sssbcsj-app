import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupsHomeComponent} from './signups-home/signups-home.component';
import {CommonUiModule} from '../common-ui/common-ui.module';
import { SmsReminderComponent } from './sms-reminder/sms-reminder.component';
import { EmailReminderComponent } from './email-reminder/email-reminder.component';


@NgModule({
  declarations: [SignupsHomeComponent, SmsReminderComponent, EmailReminderComponent],
  exports: [
    SignupsHomeComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
  ]
})
export class SignupsModule {
}
