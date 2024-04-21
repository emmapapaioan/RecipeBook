import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../_services/authorization.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../_models/authData.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent {
  isLoginMode: boolean = false;
  isLoading: boolean = false;
  errorMsg: string = null;
  succesSignUpMsg: string = null;
  selectedTabIndex: number = 0;

  tabs = [
    {
      isLoginMode: false,
      name: 'Sign up',
      index: 0
    },
    {
      isLoginMode: true,
      name: 'Login',
      index: 1
    }
  ];

  constructor(private authService: AuthorizationService, private router: Router) {}

  onChangeTab() {
    (this.isLoginMode && this.succesSignUpMsg) ? null : this.cleanErrorAndSuccessMsg();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.cleanErrorAndSuccessMsg();
    if (!form.valid) {
      return;
    }
    this.isLoading = true;
    const email = form.value.email;
    const password = form.value.password;
    this.isLoginMode ? this.login(email, password) : this.signup(email, password);
    form.reset();
  }

  signup(email: string, password: string) {
    this.cleanErrorAndSuccessMsg();
    this.handleSubscribe(this.authService.signup(email, password), 'signup');
  }

  login(email: string, password: string) {
    this.cleanErrorAndSuccessMsg();
    this.handleSubscribe(this.authService.login(email, password), 'login');
  }

  handleSubscribe(authObservable: Observable<AuthResponseData>, mode: string) {
    authObservable.subscribe({
      next: () => {
        this.handleCurrentMode(mode);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMsg = error.message;
        this.isLoading = false;
      }
    });
  }

  handleCurrentMode(state: string) {
    if (state === 'signup') {
      this.isLoginMode = true;
      this.selectedTabIndex = 1;
      this.succesSignUpMsg = "Success! You're now signed up. Please login to access the site."
    } else if (state === 'login') {
      this.isLoginMode = false;
      this.router.navigate(['/recipes']);
    }
  }

  cleanErrorAndSuccessMsg() {
    this.errorMsg = null;
    this.succesSignUpMsg = null;
  }
}
