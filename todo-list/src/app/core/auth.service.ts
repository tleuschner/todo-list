import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth} from 'firebase';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';
import { Observable, of, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';
import { User } from '../models/user.model';
import { MessageService } from './message.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User | null>;
  signupSubject$ = new BehaviorSubject<boolean>(true); 

  constructor(
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    private router: Router,
    private messageService: MessageService,
  ) {
    this.user = this.angularFireAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.angularFirestore.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  //OAuth methods
  googleLogin() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider: any) {
    return this.angularFireAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        this.messageService.update('Erfolgreich eingeloggt', 'success');
        return this.updateUserData(credential.user);
      })
      .catch(error => {
        this.messageService.update(error.message, 'error');
        this.handleError(error)
      });
  }

  //Email password sign auth

  emailSignUp(email: string, password: string) {
    this.angularFireAuth.auth
    .createUserWithEmailAndPassword(email, password)
    .then(credentials => {
      this.messageService.update('Erfolgreich registriert', 'success');
      return this.updateUserData(credentials.user);
    })
    .catch(error => {
      this.messageService.update(error.message, 'error');
      this.handleError(error)
    });
  }

  emailLogin(email: string, password: string) {
    return this.angularFireAuth.auth
    .signInWithEmailAndPassword(email, password)
    .then(crendentials => {
      this.messageService.update('Erfolgreich eingeloggt', 'success');
      return this.updateUserData(crendentials.user);
    })
    .catch(error => {
      this.messageService.update(error.message, 'error');
      this.handleError(error)
      return true;
    });
  }

  logout() {
    return this.angularFireAuth.auth.signOut();
  }

  get authenticated(): boolean {
    return this.angularFireAuth.auth !== null;
  }

  get currentUserObservable(): any {
    return this.angularFireAuth.authState;
  }

  setSignup(signUp: boolean) {
    this.signupSubject$.next(signUp);
  }

  getSignup(): Observable<boolean> {
    return this.signupSubject$.asObservable();
  }


  //Just print the error 
  private handleError(error: Error) {
    this.messageService.update(error.message, 'error')
  }

  // Sets user data to firestore after succesful login
  private updateUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.angularFirestore.doc(
      `users/${user.uid}`
    );

    const data: User = {
      uid: user.uid,
      email: user.email || null,
      username: user.username || 'nameless user',
    };
    return userRef.set(data);
  }
}
