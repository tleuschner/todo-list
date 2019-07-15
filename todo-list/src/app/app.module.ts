import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { environment } from "../environments/environment";
import { ReactiveFormsModule } from '@angular/forms';

//Firebase
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule } from "@angular/fire/database";

//Material
import { MaterialModule } from '../material-module';

//Components
import { LoginSignupComponent } from './users/login-signup/login-signup.component';
import { OverviewComponent } from './users/overview/overview.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';


@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    OverviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
