import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharingDataService {
  invokeMyMethod = new EventEmitter();
  HRService: boolean = false

  constructor() { }

setHrSharingData(value: boolean){
this.HRService = value;
}

getHrSharingData(){
  return this.HRService;
}

getMessageList(){
  this.invokeMyMethod.emit();
}
geAllHOEntry(){
  this.invokeMyMethod.emit();
}

}
