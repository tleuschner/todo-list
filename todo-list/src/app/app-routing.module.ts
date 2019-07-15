import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo, canActivate, loggedIn } from '@angular/fire/auth-guard';

import { OverviewComponent } from './users/overview/overview.component';
import { LoginSignupComponent } from './users/login-signup/login-signup.component';

const redirectLoggedInToOverview = redirectLoggedInTo(['/']);
const redirectUnauthorizedToAuthorize = redirectUnauthorizedTo(['authorize']);


const routes: Routes = [
  {path: '', component: OverviewComponent, ...canActivate(redirectUnauthorizedToAuthorize) },
  {path: 'authorize', component: LoginSignupComponent, ...canActivate(redirectLoggedInToOverview) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
