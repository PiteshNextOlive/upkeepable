import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
@Injectable()
export class MessageService1 {
  private siblingMsg = new Subject<string>();
  private homeOwnerAddressId = new Subject<number>();
  constructor() { }
  /*
   * @return {Observable<string>} : siblingMsg
   */
  public getMessage(): Observable<string> {
    return this.siblingMsg.asObservable();
  }
  /*
   * @param {string} message : siblingMsg
   */
  public updateMessage(message: string): void {
    this.siblingMsg.next(message);
  }


  public getHomeOwnerAddressId(): Observable<number> {
    return this.homeOwnerAddressId.asObservable();
  }
  public setHomeOwnerAddressId(value: number): void {
    this.homeOwnerAddressId.next(value);
  }


}