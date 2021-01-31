import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SignupsModule} from './signups/signups.module';
import {SigninComponent} from './auth/signin/signin.component';
import {RouterModule, Routes} from '@angular/router';
import {SignupsHomeComponent} from './signups/signups-home/signups-home.component';
import {ProfileComponent} from './home/profile/profile.component';
import {HomeComponent} from './home/home/home.component';
import {HomeModule} from './home/home.module';
import {AuthGuard} from './auth/auth.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'signups'},
  {path: 'login', component: SigninComponent, pathMatch: 'full'},
  {
    path: '',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'profile', component: ProfileComponent
      },
      {
        path: 'signups', component: SignupsHomeComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AuthModule,
    SignupsModule,
    HomeModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
