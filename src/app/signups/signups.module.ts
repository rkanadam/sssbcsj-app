import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SignupsHomeComponent} from './signups-home/signups-home.component';
import {CommonUiModule} from '../common-ui/common-ui.module';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';


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
