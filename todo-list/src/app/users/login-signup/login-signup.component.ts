import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'src/app/core/message.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators'
import { ErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['../login/login.component.scss']
})
export class LoginSignupComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  showSignup = true;
  passReset: boolean = false;
  matcher = new ErrorStateMatcher();
  hide = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.buildForm();
    this.authService.getSignup().pipe(takeUntil(this.destroy$)).subscribe(signup => {
      this.showSignup = signup;
    });
  }

  toggleForm(): void {
    this.authService.setSignup(false);
  }

  async signUp() {
    await this.authService.emailSignUp(this.userForm.value['email'], this.userForm.value['passwordRegister']);
    this.messageService.msg.pipe(takeUntil(this.destroy$)).subscribe(msg => this._snackBar.open(msg.content, 'Okay'));
    await this.router.navigate(['/']);
  }

  signInWithGoogle() {
    this.authService.googleLogin().then(
      () => this.router.navigate(['/'])
    )
  }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.passwordRegister.value;
    let confirmPass = group.controls.repeatPassword.value;

    return pass === confirmPass ? null : { notSame: true }
  }

  private buildForm(): void {
    this.userForm = this.formBuilder.group({
      'email': ['', [
        Validators.required,
        Validators.email
      ]
      ],
      'passwordRegister': ['', [
        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
        Validators.minLength(6),
        Validators.maxLength(25)
      ]
      ],
      'repeatPassword': ['']
    }, { validator: this.checkPasswords });

    this.userForm.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.userForm) { return; }
    const form = this.userForm;
    for (const field in this.formErrors) {
      // clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);
      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  formErrors = {
    'email': '',
    'passwordRegister': '',
    'repeatPassword': '',
  };

  validationMessages = {
    'email': {
      'required': 'Bitte Email eintragen!',
      'email': 'Bitte eine valide Email eintragen!'
    },
    'passwordRegister': {
      'required': 'Bitte Passwort eintragen',
      'pattern': 'Das Passwort muss mindestens einen Buchstaben und eine Zahl enthalten!',
      'minlength': 'Das Passwort muss mindestens 6 Zeichen lang sein!',
      'maxlength': 'Das Passwort darf höchstens 25 Zeichen lang sein!'
    },
    'repeatPassword': {
      'notSame': 'Die Passwörter stimmen nicht überein!'
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty && control.touched);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty && control.touched);

    return (invalidCtrl || invalidParent);
  }
}
