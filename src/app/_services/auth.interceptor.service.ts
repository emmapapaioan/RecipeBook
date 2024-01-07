import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, exhaustMap, take } from "rxjs";
import { AuthorizationService } from "./authorization.service";
import { User } from "../shared/user.model";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthorizationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.authService.user.pipe(
            take(1),
            exhaustMap((user: User) => {
                // Check if the request is to Firebase Storage
                if (req.url.includes('firebasestorage.googleapis.com')) {
                    // If yes, bypass the interceptor and proceed with the request
                    return next.handle(req);
                }
                if (!user) {
                    return next.handle(req);
                }
                const modifiedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifiedReq);
            })
        );
    }
}