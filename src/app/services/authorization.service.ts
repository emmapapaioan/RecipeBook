import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthRequestData, AuthResponseData } from "../shared/authData.model";
import { BehaviorSubject, Subject, catchError, tap, throwError } from "rxjs";
import { User } from "../shared/user.model";

@Injectable({ providedIn: 'root' })
export class AuthorizationService {
    user = new BehaviorSubject<User>(null);
    apiKey: string = `AIzaSyCEpvKA9xVT1-Lvx4f_SBAtx5BbXy6Fn_E`;
    signupEndpoint: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${this.apiKey}`;
    loginEndpoint: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${this.apiKey}`;

    errorMessages = {
        'EMAIL_EXISTS': 'The email address is already in use by another account.',
        'OPERATION_NOT_ALLOWED': 'Password sign-in is disabled for this project.',
        'TOO_MANY_ATTEMPTS_TRY_LATER': 'We have blocked all requests from this device due to unusual activity. Try again later.',
        'EMAIL_NOT_FOUND': 'There is no user record corresponding to this identifier. The user may have been deleted.',
        'INVALID_PASSWORD': 'The password is invalid or the user does not have a password.',
        'USER_DISABLED': 'The user account has been disabled by an administrator.'
    };

    constructor(private http: HttpClient) { }

    signup(email: string, password: string) {
        const request = this.getRequest(email, password);
        return this.http.post<AuthResponseData>(this.signupEndpoint, request)
            .pipe(
                catchError(this.handleError),
                tap(res => {
                    this.handleAuthentication(
                        res.email,
                        res.localId,
                        res.idToken,
                        +res.expiresIn
                    );
                })
            );
    }

    login(email: string, password: string) {
        const request = this.getRequest(email, password);
        return this.http.post<AuthResponseData>(this.loginEndpoint, request)
            .pipe(
                catchError(this.handleError),
                tap(res => {
                    this.handleAuthentication(
                        res.email,
                        res.localId,
                        res.idToken,
                        +res.expiresIn
                    );
                })
            );
    }

    logout() {
        this.user.next(null);
    }

    getRequest(email: string, password: string) {
        return {
            email: email,
            password: password,
            returnSecureToken: true
        } as AuthRequestData;
    }

    private handleError = (errorMsg: HttpErrorResponse) => {
        let errorMessage: string;
        if (errorMsg.error || errorMsg.error.error) {
            errorMessage = this.errorMessages[errorMsg.error.error.message];
        }
        return throwError(() => new Error(errorMessage || 'An unknown error occured.'));
    }

    private handleAuthentication(email: string, localId: string, idToken: string, expiresIn: number) {
        const expirationDate = new Date(
            new Date().getTime() + expiresIn * 1000
        );
        const user = new User(
            email,
            localId,
            idToken,
            expirationDate
        );
        this.user.next(user);
    }
}