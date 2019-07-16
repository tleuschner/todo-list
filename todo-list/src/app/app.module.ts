import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { NgModel } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from "../environments/environment";
import { ReactiveFormsModule } from '@angular/forms';

//Firebase
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from "@angular/fire";
import { AngularFireDatabaseModule, AngularFireDatabase } from "@angular/fire/database";

//Material
import { MaterialModule } from '../material-module';

//Components
import { LoginSignupComponent } from './users/login-signup/login-signup.component';
import { OverviewComponent, CreateListDialog } from './users/overview/overview.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { TodoListComponent } from './users/todo-list/todo-list.component';
import { TodoTaskComponent } from './users/todo-task/todo-task.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginSignupComponent,
    OverviewComponent,
    TodoListComponent,
    TodoTaskComponent,
    CreateListDialog,
    NgModel,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  providers: [
    AngularFireAuth,
    AngularFirestore,
    AngularFireAuthGuard,
    AngularFireDatabase,
  ],
  bootstrap: [AppComponent],
  entryComponents: [OverviewComponent, CreateListDialog]
})
export class AppModule { }
