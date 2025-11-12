import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

   private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get loadingStatus() {
    return this.loadingSubject.asObservable();
  }

  showLoading(): void {
    this.loadingSubject.next(true);
  }

  hideLoading(): void {
    this.loadingSubject.next(false);
  }
}
