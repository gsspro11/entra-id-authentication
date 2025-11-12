import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {

  private readonly _destroying$ = new Subject<void>();
  loginDisplay = false;

  constructor(
    private _router: Router
  ) { }

  ngOnInit(): void {
    this.navigateBy('home');
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }

  public navigateBy(url: string): any {
    return this._router.navigateByUrl(url.startsWith('/') ? url : `/${url}`);
  }
}
