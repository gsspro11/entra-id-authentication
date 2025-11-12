import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponentComponent } from './components/navbar-component/navbar-component.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HttpClientModule } from '@angular/common/http';
import { LoadingComponent } from './components/loading/loading.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';

// Required for MSAL
import {PublicClientApplication, InteractionType, BrowserCacheLocation, LogLevel, IPublicClientApplication } from '@azure/msal-browser';
import { MsalService, MSAL_INSTANCE, MSAL_GUARD_CONFIG, MsalGuardConfiguration, MsalGuard, MsalBroadcastService } from '@azure/msal-angular';
import { AuthPageComponent } from './pages/auth-page/auth-page.component';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastsComponent } from './components/toasts/toasts.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import {NgOptimizedImage} from "@angular/common";



export function loggerCallback(logLevel: LogLevel, message: string) {
  console.log(message);
}

export function MSALInstanceFactory(): IPublicClientApplication{

  return new PublicClientApplication({

    auth: {
      clientId: environment.baseUrlMSTokenId,
      authority: environment.baseUrlMSAuth,
      redirectUri: environment.baseUrlMSRedirect,
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage,
      storeAuthStateInCookie: true, // set to true for IE 11
    },
    system: {
      loggerOptions: {
        loggerCallback,
        logLevel: LogLevel.Info,
        piiLoggingEnabled: false,
      },
    },
  });
}


// MSAL Guard is required to protect routes and require authentication before accessing protected routes
export function MSALGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect,
    authRequest: {
      scopes: ['user.read'],
    },
  };
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponentComponent,
    SideNavComponent,
    HomePageComponent,
    NotFoundPageComponent,
    LoadingComponent,
    LoginPageComponent,
    AuthPageComponent,
    ToastsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClipboardModule,
    NgOptimizedImage
  ],
  providers: [
    provideClientHydration(),
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    {
      provide: MSAL_GUARD_CONFIG,
      useFactory: MSALGuardConfigFactory,
    }
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
