import { Injectable, TemplateRef } from "@angular/core";

export interface ToastInfo {
    header: string;
    body: string;
    classList: string,
    icon: string,
    delay?: number;
}

@Injectable({ providedIn: 'root' })
export class AppToastService {
    toasts: ToastInfo[] = [];

    show(header: string, body: string, delay: number, classList: string, icon: string) {
        this.toasts.push({ header, body, delay, classList, icon });
      }
    remove(toast) {
        this.toasts = this.toasts.filter(t => t !== toast);
    }
    clear() {
        this.toasts.splice(0, this.toasts.length);
    }
}