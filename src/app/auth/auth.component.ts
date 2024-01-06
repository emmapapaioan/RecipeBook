import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthorizationService } from '../services/authorization.service';
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
  errorMessage: string = null;

  constructor(private authService: AuthorizationService, private router: Router) {}

  onSwitchMode() {
    this.cleanErrorMsg();
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    this.cleanErrorMsg();
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
    this.cleanErrorMsg();
    this.handleSubscribe(this.authService.signup(email, password), 'signup');
  }

  login(email: string, password: string) {
    this.cleanErrorMsg();
    this.handleSubscribe(this.authService.login(email, password), 'login');
  }

  handleSubscribe(authObservable: Observable<AuthResponseData>, mode: string) {
    authObservable.subscribe({
      next: (res) => {
        this.handleCurrentMode(mode, res.registered);
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  handleCurrentMode(state: string, isRegistered: boolean) {
    if (state === 'signup') {
      this.isLoginMode = true;
    } else if (state === 'login') {
      this.isLoginMode = false;
      this.router.navigate(['/recipes']);
    }
  }

  dismissAlert() {
    this.cleanErrorMsg();
  }

  cleanErrorMsg() {
    this.errorMessage = null;
  }
}
