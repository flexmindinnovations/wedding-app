import { ChangeDetectorRef, Injectable, inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse,
    HttpInterceptorFn
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, first, last, take, takeLast, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';
import { jwtDecode } from "jwt-decode";
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert/alert.service';
import { AlertType } from '../enums/alert-types';

export const customInterceptor: HttpInterceptorFn = (req, next) => {

    const authService = inject(AuthService);
    const sharedService = inject(SharedService);
    const token = authService.getAuthToken();
    let isTokenValid = true;
    let authReq = req;

    if (token) {
        const expiryDate = getTokenExpirationDate(token);
        isTokenValid = expiryDate && expiryDate > new Date() ? true : false;
    }
    if (authService.isLoggedIn()) {
        authReq = authReq.clone(
            {
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
    }


    return next(authReq).pipe(
        catchError((error: any) => {
            if (error instanceof HttpErrorResponse) {
                if (error.status === 401) {
                    sharedService.isUnAuthorizedRequest.next(true);
                }
            }
            return throwError(() => error);
        })
    );

    function getTokenExpirationDate(token: string): any {
        try {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp === undefined) {
                return null;
            }
            const date = new Date(0); // Initialize with epoch time
            date.setUTCSeconds(decodedToken.exp); // Set seconds since epoch
            return date;
        } catch (error) {
            return null;
        }
    }
};


// @Injectable()
// export class CustomHttpInterceptor implements HttpInterceptor {
//     sharedService = inject(SharedService);
//     authService = inject(AuthService);
//     alertService = inject(AlertService);
//     router = inject(Router);
//     isTokenValid = true;
//     publicRoutes = ['login', 'createToken', 'register'];
//     intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
//         const token = localStorage.getItem('token');
//         if (token) {
//             const expiryDate = this.getTokenExpirationDate(token);
//             this.isTokenValid = expiryDate && expiryDate > new Date() ? true : false;
//         }

//         if (!this.publicRoutes.includes(req.url)) {
//             if (this.isTokenValid) {
//                 req = req.clone({
//                     setHeaders: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//             } else {
//                 this.sharedService.isUnAuthorizedRequest.next(true);
//             }
//         }
//         return next.handle(req).pipe(
//             catchError((error: HttpErrorResponse) => {
//                 const statusCode = error?.status;
//                 if (statusCode === 401) {
//                     this.sharedService.isUnAuthorizedRequest.next(true);
//                 }
//                 return throwError(() => error);
//             })
//         );
//     }

//     getTokenExpirationDate(token: string): any {
//         try {
//             const decodedToken = jwtDecode(token);
//             if (decodedToken.exp === undefined) {
//                 return null;
//             }
//             const date = new Date(0); // Initialize with epoch time
//             date.setUTCSeconds(decodedToken.exp); // Set seconds since epoch
//             return date;
//         } catch (error) {
//             return null;
//         }
//     }
// }