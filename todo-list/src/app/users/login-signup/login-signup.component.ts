import { Component, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from 'src/app/core/message.service';

@Component({
  selector: 'app-login-signup',
  templateUrl: './login-signup.component.html',
  styleUrls: ['./login-signup.component.scss']
})
export class LoginSignupComponent implements OnInit {
  userForm: FormGroup;
  newUser: boolean = true;
  passReset: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.buildForm();
  }

  toggleForm(): void {
    this.newUser = !this.newUser;
  }

  async signUpLogin() {
    if (this.newUser) {
      await this.authService.emailSignUp(this.userForm.value['email'], this.userForm.value['passwordRegister']);
      this.messageService.msg.subscribe(msg => this._snackBar.open(msg.content, 'Okay'));
      await this.router.navigate(['/']);
    } else {
      await this.authService.emailLogin(this.userForm.value['email'], this.userForm.value['passwordLogin']);
      this.messageService.msg.subscribe(msg => this._snackBar.open(msg.content, 'Okay'))
    }
  }

  signInWithGoogle() {
    this.authService.googleLogin().then(
      () => this.router.navigate(['/'])
    )
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
      'repeatPassword': ['', [
      ]
      ],
      'passwordLogin': ['', [
        //Validators.required
      ]
      ]
    });

    this.userForm.valueChanges.subscribe(data => this.onValueChanged(data));
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
    'password': ''
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
    'passwordLogin': {
      'required': 'Bitte Passwort eintragen',
    }
  }

}
