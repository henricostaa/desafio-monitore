import { Injectable, signal } from '@angular/core';

export interface NotificationMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly _notifications = signal<NotificationMessage[]>([]);
  readonly notifications = this._notifications.asReadonly();
  private counter = 0;

  success(message: string): void {
    this.addNotification('success', message);
  }

  error(message: string): void {
    this.addNotification('error', message);
  }

  info(message: string): void {
    this.addNotification('info', message);
  }

  private addNotification(type: 'success' | 'error' | 'info', message: string): void {
    const id = ++this.counter;
    const newNotification: NotificationMessage = { id, type, message };
    this._notifications.update(prev => [...prev, newNotification]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      this.remove(id);
    }, 5000);
  }

  remove(id: number): void {
    this._notifications.update(prev => prev.filter(n => n.id !== id));
  }
}
