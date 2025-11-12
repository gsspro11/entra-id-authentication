import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { HomePageComponent } from './home-page.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { LoadingService } from '../../services/loading.service';

// Simple stubs/mocks for required services
const currentUserSession$ = new BehaviorSubject<any>(null);
const authServiceMock = {
  getCurrentSession: jasmine.createSpy('getCurrentSession'),
  msLogin: jasmine.createSpy('msLogin'),
  currentUserSession: currentUserSession$,
};

const toastServiceMock = {
  add: jasmine.createSpy('add'),
};

const loadingServiceMock = {
  showLoading: jasmine.createSpy('showLoading'),
  hideLoading: jasmine.createSpy('hideLoading'),
};

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [HomePageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: LoadingService, useValue: loadingServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
