import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../_services/authorization.service';
import { Observable } from 'rxjs';
import { AuthResponseData } from '../shared/authData.model';
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

  constructor(private authService: AuthorizationService, private router: Router) {}

  onSwitchMode() {
    this.cleanErrorAndSuccessMsg();
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
      next: (res) => {
        this.handleCurrentMode(mode);
        this.isLoading = false;
        this.succesSignUpMsg = "Success! You're now signed up. Please login to access the site."
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
    } else if (state === 'login') {
      this.isLoginMode = false;
      this.router.navigate(['/recipes']);
    }
  }

  dismissAlert() {
    this.cleanErrorAndSuccessMsg();
  }

  cleanErrorAndSuccessMsg() {
    this.errorMsg = null;
    this.succesSignUpMsg = null;
  }
}
