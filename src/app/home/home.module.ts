import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProfileComponent} from './profile/profile.component';
import {HomeComponent} from './home/home.component';
import {CommonUiModule} from '../common-ui/common-ui.module';
import {AuthModule} from '../auth/auth.module';
import { VerifyPhoneComponent } from './verify-phone/verify-phone.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ProfileComponent, HomeComponent, VerifyPhoneComponent],
  imports: [
    CommonModule,
    AuthModule,
    CommonUiModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class HomeModule {
}
