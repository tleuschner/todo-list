import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, canActivate } from '@angular/fire/auth-guard';

import { OverviewComponent } from './users/overview/overview.component';
import { LoginSignupComponent } from './users/login-signup/login-signup.component';
import { TodoTaskComponent } from './users/todo-task/todo-task.component';

const redirectLoggedInToOverview = redirectLoggedInTo(['/']);
const redirectUnauthorizedToAuthorize = redirectUnauthorizedTo(['authorize']);


const routes: Routes = [
  // { path: '', component: OverviewComponent, canActivate: [AuthGuard] },
  //{ path: 'authorize', component: LoginSignupComponent, canActivate: [RedirectLoggedInGuard]}
  { path: '', component: OverviewComponent, ...canActivate(redirectUnauthorizedToAuthorize), data : {animation: 'ListPage'} },
  { path: 'authorize', component: LoginSignupComponent, ...canActivate(redirectLoggedInToOverview)},
  { path: 'list/:id/tasks', component: TodoTaskComponent, ...canActivate(redirectUnauthorizedToAuthorize), data : {animation: 'TaskPage'}}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
