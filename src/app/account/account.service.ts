import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginTypeModel, UserJwtDecodedInfo } from './account-type-module';
import { environment } from '../../environments/environment';
import jwt_decode from 'jwt-decode';
import { AppHttpRequestHandlerService } from '../shared/app-http-request-handler.service';
import { GenericResponseTemplateModel } from '../generic-type-module';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AccountService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private httpClient: HttpClient,private appHttpRequestHandlerService: AppHttpRequestHandlerService) { }

  public loginUser(loginTypeModel : LoginTypeModel){
      this.httpClient.post(environment.defaultApiRoot + "api/"  + "AccountManager/login",loginTypeModel)
      .subscribe(response=>{
        localStorage.setItem("BearerToken",(<any>response).token)
      });
  }

  getJwtToken():string{
    if(localStorage.getItem('BearerToken')){
      return localStorage.getItem('BearerToken');
    }
    return '';
  }

  getUserJwtDecodedInfo():UserJwtDecodedInfo{
    if(this.isUserLoggedIn()){
      return jwt_decode(this.getJwtToken());
    }
    return null;
  }

  public isUserLoggedIn(): boolean{
    if(this.getJwtToken()!=''){
      return true;
    }
    return false;
  }
  checkDuplicateEmail(formData: any): Observable<any>{
    return this.appHttpRequestHandlerService.httpGet({ value: formData.value, id: formData.id}, "AccountManager", "CheckDuplicateEmail").pipe(takeUntil(this.ngUnsubscribe));
  }
}