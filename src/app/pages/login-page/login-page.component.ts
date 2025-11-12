import { Component, OnDestroy } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { Subject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnDestroy {

  private readonly _destroying$ = new Subject<void>();
  isIframe = false;
  loginDisplay = false;

  constructor(
    private _msService: MsalService,
    private _authService: AuthService,
  ) { }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  public setLoginDisplay() {
    this.loginDisplay = this._msService.instance.getAllAccounts().length > 0;
  }

  public login() {
    return this._authService.msLogin();
  }

  public logout() {
    return this._authService.msLogout();
  }
}
