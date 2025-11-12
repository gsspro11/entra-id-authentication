import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, from, finalize } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { MsalService } from '@azure/msal-angular';
import { SilentRequest } from '@azure/msal-browser';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';

@Injectable()
export class CustomMsalInterceptor implements HttpInterceptor {

  constructor(
    private _msService: MsalService,
    private _authService: AuthService,
    private _loadingService: LoadingService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const account = this._msService.instance.getAllAccounts();
    this._loadingService.showLoading();

    if (account) {
      const request: SilentRequest = {
        account: account[0],
        scopes: ['user.read']
      };

      return from(this._msService.acquireTokenSilent(request)).pipe(
        switchMap((result) => {
          const token = result.idToken;
          const authReq = req.clone({
            setHeaders: {
              "X-JWT-Assertion": token,
              "ProfileService": this.getLocalStorageProfileService()
            },
          });
          return next.handle(authReq).pipe(
            catchError((error) => this.handleAuthError(error, req, next)),
            finalize(() => { this._loadingService.hideLoading() })
          );
        }),
        catchError((error) => this.handleAuthError(error, req, next)),
        finalize(() => { this._loadingService.hideLoading() })
      );
    }

    return next.handle(req).pipe(
      catchError((error) => this.handleAuthError(error, req, next)),
      finalize(() => { this._loadingService.hideLoading() })
    );
  }

  private handleAuthError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (error.status === 500 || error.status === 400)
      return throwError(() => error);

    const account = this._msService.instance.getAllAccounts();

    const request: SilentRequest = {
      account: account[0],
      scopes: ['user.read'],
      forceRefresh: true,
    };

    if (account.length) {
      return this._msService.acquireTokenSilent(request).pipe(
        switchMap((result) => {
          const token = result.idToken;
          req = req.clone({
            setHeaders: {
              "X-JWT-Assertion": token,
            },
          });
          return next.handle(req);
        }),
        catchError((err) => {
          console.error('Request Error API', err); // pode cair aqui quando der erro 500 ou alguma instabilidade da infra
          return throwError(() => err);
        }
        )
      );
    } else {
      console.log('Active sesstion not found, please sign in again.'); // se o login não der certo irá cair aqui.
      this._authService.msLogin();
    }

    return throwError(() => error);
  }

  private getLocalStorageProfileService() {
    return (localStorage.getItem('ProfileService') === 'true').toString();
  }
}
