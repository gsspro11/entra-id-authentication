import { Injectable } from '@angular/core';

interface IToast {
  id: number;
  message: string;
  duration: number;
  type: 'success' | 'error',
  isHiding: boolean
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  toasts: IToast[] = [];
  private _idSeq = 0;

  add(message: string, type: 'success' | 'error' = 'success', seconds: number = 3) {
    const duration = seconds * 1000;
    const id = ++this._idSeq;
    this.toasts.push({ id, message, duration, type, isHiding: false });

    setTimeout(() => {
      this._removeById(id);
    }, duration);
  }

  remove(index: number) {
    if (index < 0 || index >= this.toasts.length) return;
    this.toasts[index].isHiding = true;
    setTimeout(() => {
      this.toasts.splice(index, 1);
    }, 150);
  }

  private _removeById(id: number) {
    const index = this.toasts.findIndex(t => t.id === id);
    if (index === -1) return;
    this.remove(index);
  }
}
