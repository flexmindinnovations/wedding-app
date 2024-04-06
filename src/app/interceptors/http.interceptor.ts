import { Injectable, inject } from '@angular/core';
import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse,
    HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SharedService } from '../services/shared.service';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
    sharedService = inject(SharedService);
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!req.url.includes('login') || !req.url.includes('createToken') || !req.url.includes('register')) {
            const authToken = localStorage.getItem('token');
            if (authToken) {
                req = req.clone({
                    setHeaders: {
                        Authorization: `Bearer ${authToken}`
                    }
                });
            }
        }
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                return throwError(() => error);
            })
        );
    }
}