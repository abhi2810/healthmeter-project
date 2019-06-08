import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './dashboard/home/home.component';
import { DatadumpComponent } from './dashboard/datadump/datadump.component';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { ScoreComponent } from './dashboard/score/score.component';
import { ErrorComponent } from './common/error/error.component';
import { AuthGuard } from './auth/auth.guard';
import { ViewChannelComponent } from './monitoring/view-channel/view-channel.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'signup', component: SignupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'healthdata', component: DatadumpComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},
  {path: 'score', component: ScoreComponent, canActivate: [AuthGuard]},
  {path: 'viewchannel', component: ViewChannelComponent, canActivate: [AuthGuard]},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
