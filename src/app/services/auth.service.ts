import { Inject, Injectable } from '@angular/core';
import { MsalService, MSAL_GUARD_CONFIG, MsalGuardConfiguration } from '@azure/msal-angular';
import { AccountInfo, AuthenticationResult, InteractionType, PopupRequest, RedirectRequest } from '@azure/msal-browser';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public _MS_SESSION_LOGGED = new BehaviorSubject<Array<AccountInfo> | null>(null);
  public currentUserSession = new BehaviorSubject<any>(null);
  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private _msService: MsalService,
    ) {
    }

    getCurrentSession(){
      const accounts = this._msService.instance.getAllAccounts();
      if (accounts.length > 0 && (accounts[0] != this.currentUserSession.getValue() || accounts != this._MS_SESSION_LOGGED.getValue())) {
        this._MS_SESSION_LOGGED.next(accounts);
        this.currentUserSession.next(accounts[0])
      }
      else{
        this._msService.instance.loginRedirect()
      }
    }

    getNameUser(): string {
      const session = this._MS_SESSION_LOGGED.getValue();
      return session && session[0] ? session[0].name || '' : '';
    }

    userInitials(): any {
      const name = this.getNameUser();
      if (!name) return ;

      const names = name.split(' ');
      let initials = names[0].substring(0, 1).toUpperCase();

      if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
      }
      return initials;
    }

    getEmailUser(): string | undefined {
      const session = this._MS_SESSION_LOGGED.getValue();
      return session && session[0] ? session[0].username : undefined;
    }

    public msLogin() {
      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        if (this.msalGuardConfig.authRequest) {
          this._msService.loginPopup({ ...this.msalGuardConfig.authRequest } as PopupRequest)
          .subscribe((response: AuthenticationResult) => {
            this._msService.instance.setActiveAccount(response.account);
            this._MS_SESSION_LOGGED.next(this._msService.instance.getAllAccounts());
          });
        } else {
          this._msService.loginPopup()
          .subscribe((response: AuthenticationResult) => {
            this._msService.instance.setActiveAccount(response.account);
            this._MS_SESSION_LOGGED.next(this._msService.instance.getAllAccounts());
          });
        }
      } else {
        if (this.msalGuardConfig.authRequest) {
          this._msService.loginRedirect({ ...this.msalGuardConfig.authRequest } as RedirectRequest);
        } else {
          this._msService.loginRedirect();
        }
      }
    }

    public msLogout() {
      const urlLogoutRedirect = null;

      if (this.msalGuardConfig.interactionType === InteractionType.Popup) {
        this._msService.logoutPopup({
          postLogoutRedirectUri: urlLogoutRedirect,
        }).subscribe(() => {
          this._MS_SESSION_LOGGED.next(null);
          this.currentUserSession.next(null);
        });
      } else {
        this._msService.logoutRedirect({
          postLogoutRedirectUri: urlLogoutRedirect,
        }).subscribe(() => {
          this._MS_SESSION_LOGGED.next(null);
          this.currentUserSession.next(null);
        });
      }
    }
  }
