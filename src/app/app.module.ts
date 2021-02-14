import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {AuthModule} from './auth/auth.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SignupsModule} from './signups/signups.module';
import {SigninComponent} from './auth/signin/signin.component';
import {RouterModule, Routes} from '@angular/router';
import {SignupsComponent} from './signups/signups/signups.component';
import {ProfileComponent} from './home/profile/profile.component';
import {HomeComponent} from './home/home/home.component';
import {HomeModule} from './home/home.module';
import {AuthGuard} from './auth/auth.guard';
import {MySignupsComponent} from './signups/my-signups/my-signups.component';

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
        path: 'signups', component: SignupsComponent
      },
      {
        path: 'mySignups', component: MySignupsComponent
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
    AuthModule,
    SignupsModule,
    HomeModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(routes, {useHash: true}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
