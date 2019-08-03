import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ServiceWorkerModule } from '@angular/service-worker';
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de'

//Firebase
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from "@angular/fire";
import {  AngularFireDatabase } from "@angular/fire/database";

//Material
import { MaterialModule } from '../material-module';
import { MAT_DATE_LOCALE } from '@angular/material/core';

//Components
import { LoginSignupComponent } from './users/login-signup/login-signup.component';
import { OverviewComponent, CreateListDialog } from './users/overview/overview.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { TodoListComponent, DeleteDialog } from './users/todo-list/todo-list.component';
import { TodoTaskComponent } from './users/todo-task/todo-task.component';
import { AuthService } from './core/auth.service';
import { AuthGuard } from './core/auth.guard';
import { LoginComponent } from './users/login/login.component';

registerLocaleData(localeDe);

@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    OverviewComponent,
    TodoListComponent,
    TodoTaskComponent,
    CreateListDialog,
    LoginComponent,
    DeleteDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule.enablePersistence(),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireAuthGuard,
    AngularFireDatabase,
    AuthService,
    AuthGuard,
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'},
    {provide: LOCALE_ID, useValue: 'de-DE'},

  ],
  bootstrap: [AppComponent],
  entryComponents: [OverviewComponent, CreateListDialog, DeleteDialog]
})
export class AppModule { }
