import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  currentSession: any;
  constructor(
    private _loadingService: LoadingService,
    private _authService: AuthService,
  ) {
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    this.currentSession = this._authService.currentUserSession.getValue();
    let idTokenSession = this.currentSession && this.currentSession.idToken ? this.currentSession.idToken : '';

    req = req.clone({
      setHeaders: {
        "X-JWT-Assertion": idTokenSession,
      },
    });

    this._loadingService.showLoading();

    return next.handle(req).pipe(

      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      }),
      finalize(() => {
        this._loadingService.hideLoading();
      })
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      // Lógica para tratar o erro 401
      console.error('Erro 401: Não autorizado', error);

      this._authService.msLogin();
    }

    return throwError(error);
  }
}

