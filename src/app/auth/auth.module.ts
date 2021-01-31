import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SigninComponent} from './signin/signin.component';
import {CommonUiModule} from '../common-ui/common-ui.module';
import {AuthService} from './auth.service';
import {AuthGuard} from './auth.guard';

@NgModule({
  declarations: [SigninComponent],
  exports: [
    SigninComponent,
  ],
  imports: [
    CommonModule,
    CommonUiModule
  ],
  providers: [AuthService, AuthGuard]
})
export class AuthModule {
}
