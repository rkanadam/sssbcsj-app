import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupsComponent} from './signups/signups.component';
import {CommonUiModule} from '../common-ui/common-ui.module';
import { SmsReminderComponent } from './sms-reminder/sms-reminder.component';
import { EmailReminderComponent } from './email-reminder/email-reminder.component';
import { MySignupsComponent } from './my-signups/my-signups.component';
import { DevotionComponent } from './devotion/devotion.component';


@NgModule({
  declarations: [SignupsComponent, SmsReminderComponent, EmailReminderComponent, MySignupsComponent, DevotionComponent],
  exports: [
    SignupsComponent
  ],
  imports: [
    CommonModule,
    CommonUiModule,
  ]
})
export class SignupsModule {
}
