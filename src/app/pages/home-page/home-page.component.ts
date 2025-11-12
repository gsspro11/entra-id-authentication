import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../../services/loading.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit, OnDestroy {
  public _formSearch: FormGroup;
  public _isLoading: boolean = true;

  private readonly destroy$ = new Subject<void>();
  currentUser: any;
  swaggerUrl = environment.entraIdApiUrl + '/swagger';

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _toastService: ToastService,
    private _loadingService: LoadingService
  ) {
    this._loadingService.showLoading();
    this._authService.getCurrentSession();
    this._formSearch = this._initFormToken();
  }

  ngOnInit(): void {
    this._formSearch.get('search')?.setValue('Loading...');

    this._autoSignIn();

    this._authService.currentUserSession
      .pipe(takeUntil(this.destroy$))
      .subscribe((session: any) => {
        this.currentUser = session;

        if (this.currentUser?.idToken) {
          this._formSearch
            .get('search')
            ?.setValue(this.currentUser.idToken.substring(0, 500) + '...');

          this._isLoading = false;
          this._loadingService.hideLoading();
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get formInstance(): FormGroup {
    return this._formSearch;
  }

  private _initFormToken(): FormGroup {
    return this._formBuilder.group({
      search: [''],
    });
  }

  async openSwagger() {
    try {
      const swaggerWithToken = `${this.swaggerUrl}`;
      window.open(swaggerWithToken, '_blank');
    } catch (error) {
      console.error('Error acquiring token', error);
    }
  }

  private _autoSignIn(): void {
    const currentSession = this._authService.currentUserSession.getValue();

    if (typeof window !== 'undefined' && currentSession === null) {
      this._authService.msLogin();
    }
  }

  public copyToClipBoard() {
    if (this.currentUser?.idToken) {
      navigator.clipboard
        .writeText(this.currentUser.idToken)
        .then((r) => this._toastService.add('Copied to clipboard!'))
        .catch(() => this._toastService.add('Failed to copy.'));
    } else {
      this._toastService.add('Nothing to copy.');
    }
  }
}
