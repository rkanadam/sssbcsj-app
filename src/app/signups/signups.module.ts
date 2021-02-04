import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupsHomeComponent} from './signups-home/signups-home.component';
import {CommonUiModule} from '../common-ui/common-ui.module';


@NgModule({
  declarations: [SignupsHomeComponent],
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
