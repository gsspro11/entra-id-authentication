import { Component, OnInit } from '@angular/core';
import { environment } from '../environments/environment';
import { LoadingService } from './services/loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'entra-id-authentication';
  private _environmentFile = environment;
  public isLoading: boolean = true;

  constructor(
    private _loadingService: LoadingService,
    private _router: Router
  ) {}

  ngOnInit() {
    this._forceHttps();
    this._logVersionApp();
    this._loadingService.loadingStatus.subscribe((status: boolean) => {
      this.isLoading = status;
    });
  }

  get hideNavbar(): boolean {
    return this._router.url === '/auth';
  }

  private _logVersionApp() {
    console.info("VersionApp: " + this._environmentFile.versionAPP);
  }

  private _forceHttps(): any {
    if (typeof window !== "undefined") {
      if (window.location.protocol == 'http:') {
        return location.replace('https://' + window.location.href.split('//')[1]);
      }
    }
  }
}
