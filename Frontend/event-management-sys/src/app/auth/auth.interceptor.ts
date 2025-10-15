import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const user = this.authService.getUser();
    if (user && user.token) {
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      return next.handle(clonedRequest);
    }
    return next.handle(req);
  }
}
