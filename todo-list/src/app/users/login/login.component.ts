import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/core/auth.service';
import { MessageService } from 'src/app/core/message.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  userForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  showSignup = true;
  hide = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loginUser();
    // this.buildForm();
    // this.authService.getSignup().pipe(takeUntil(this.destroy$)).subscribe(signup => {
    //   this.showSignup = signup;
    // })
  }
  
  async loginUser() {
    this.authService.anonLogin().
    //@ts-ignore
    then(async success => await this.router.navigate(['/lists']));
    
  }

  // toggleForm() {
  //   this.authService.setSignup(true);
  // }

  // async login() {
  //   await this.authService.emailLogin(this.userForm.value['email'], this.userForm.value['passwordLogin']);
  //   await this.messageService.msg.pipe(takeUntil(this.destroy$)).subscribe(msg => this._snackBar.open(msg.content, 'Okay'));
  //   await this.router.navigate(['/lists']);
  // }

  // signInWithGoogle() {
  //   this.authService.googleLogin().then(
  //     () => this.router.navigate(['/lists'])
  //   )
  // }

  // private buildForm(): void {
  //   this.userForm = this.formBuilder.group({
  //     'email': ['', [
  //       Validators.required,
  //       Validators.email
  //     ]
  //     ],
  //     'passwordLogin': ['', [
  //       Validators.required
  //     ]
  //     ]
  //   });

  //   this.userForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(data => this.onValueChanged(data));
  //   this.onValueChanged();
  // }

  // onValueChanged(data?: any) {
  //   if (!this.userForm) { return; }
  //   const form = this.userForm;
  //   for (const field in this.formErrors) {
  //     // clear previous error message (if any)
  //     this.formErrors[field] = '';
  //     const control = form.get(field);
  //     if (control && control.dirty && !control.valid) {
  //       const messages = this.validationMessages[field];
  //       for (const key in control.errors) {
  //         this.formErrors[field] += messages[key] + ' ';
  //       }
  //     }
  //   }
  // }

  // formErrors = {
  //   'email': '',
  //   'passwordLogin': ''
  // };

  // validationMessages = {
  //   'email': {
  //     'required': 'Bitte Email eintragen!',
  //     'email': 'Bitte eine valide Email eintragen!'
  //   },
  //   'passwordLogin': {
  //     'required': 'Bitte Passwort eintragen',
  //   }
  // }

  // ngOnDestroy() {
  //   this.destroy$.next(true);
  //   this.destroy$.unsubscribe();
  // }
}
