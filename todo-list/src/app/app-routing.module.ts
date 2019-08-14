import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { redirectUnauthorizedTo, redirectLoggedInTo, AngularFireAuthGuard } from '@angular/fire/auth-guard';

import { TodoTaskComponent } from './users/todo-task/todo-task.component';
import { TodoListComponent } from './users/todo-list/todo-list.component';
import { LoginComponent } from './users/login/login.component';

const redirectLoggedInToOverview = () => redirectLoggedInTo(['lists']);
const redirectUnauthorizedToAuthorize = () => redirectUnauthorizedTo(['authorize']);


const routes: Routes = [
  { path: 'authorize', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToOverview} },
  { path: '', component: LoginComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectLoggedInToOverview}, },
  { path: 'lists', component: TodoListComponent, canActivate: [AngularFireAuthGuard], data: { animation: 'ListPage', authGuardPipe: redirectUnauthorizedToAuthorize } },
  { path: 'list/:id/tasks', component: TodoTaskComponent, canActivate: [AngularFireAuthGuard], data: { animation: 'TaskPage', authGuardPipe: redirectUnauthorizedToAuthorize } }
];
//data : {animation: 'ListPage'}
//data : {animation: 'TaskPage'}


@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
