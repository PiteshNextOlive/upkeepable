import { Injectable } from '@angular/core';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // This makes the service available application-wide
})

export class PushNotificationService {  
  public permission: Permission;  
  constructor() {  
      this.permission = this.isSupported() ? 'default' : 'denied';  
  }  
  public isSupported(): boolean {  
      return 'Notification' in window;  
  }  

  requestPermission() {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission status:', permission);
      });
    } else {
      console.error('This browser does not support notifications.');
    }

  }  
  create(title1: string, options ? : PushNotification): any {  
      let self = this;  
      return new Observable(function(obs) {  
          if (!('Notification' in window)) {  
              console.log('Notifications are not available in this environment');  
              obs.complete();  
          }  
          if (self.permission !== 'granted') {  
              console.log("The user hasn't granted you permission to send push notifications");  
              obs.complete();  
          }  
          let _notify = new Notification(title1, options);  
          _notify.onshow = function(e) {  
              return obs.next({  
                  notification: _notify,  
                  event: e  
              });  
          };  
          _notify.onclick = function(e) {  
              return obs.next({  
                  notification: _notify,  
                  event: e  
              });  
          };  
          _notify.onerror = function(e) {  
              return obs.error({  
                  notification: _notify,  
                  event: e  
              });  
          };  
          _notify.onclose = function() {  
              return obs.complete();  
          };  
      });  
  }  
  generateNotification(source: Array < any > ): void {  
    debugger;
      let self = this;  
      console.log("permission",self);
      alert(self);
      source.forEach((item) => {  
          let options = {  
              body: item.alertContent,  
              icon: "../resource/images/bell-icon.png"  
          };  
          let notify = self.create(item.title1, options).subscribe();  
      })  

    // try {
    //     source.forEach((item) => {
    //       let options = {
    //         body: item.alertContent,
    //         icon: "../resource/images/bell-icon.png"
    //       };
    //       let notify = self.create(item.title1, options).subscribe();
    //     });
    //   } catch (error) {
    //     console.error('Error occurred while processing notifications:', error);
    //   }

  }  
  public sendNotification(title: string, body: string) {
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.ready.then(function(registration) {

        registration.showNotification("Test notificatiojm", {
          body: "Content gioews here",
          icon: 'public/favicon.ico',
          // @ts-ignore
          vibrate: [100, 50, 100],
          data: { dateOfArrival: Date.now() },
          actions: [
            { action: 'explore', title: 'Go to the site' },
            { action: 'close', title: 'Close the notification' }
          ]
        });
      });
    }else {
      if (!('serviceWorker' in navigator)) {
        console.warn('Service Worker is not supported in this browser.');
      }

      if (!('PushManager' in window)) {
        console.warn('Push Notifications are not supported in this browser.');
      }
    }
  }
}  

export declare type Permission = 'denied' | 'granted' | 'default';  
export interface PushNotification {  
  body ? : string;  
  icon ? : string;  
  tag ? : string;  
  data ? : any;  
  renotify ? : boolean;  
  silent ? : boolean;  
  sound ? : string;  
  noscreen ? : boolean;  
  sticky ? : boolean;  
  dir ? : 'auto' | 'ltr' | 'rtl';  
  lang ? : string;  
  vibrate ? : number[];  
}