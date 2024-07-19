import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import jwt_decode from 'jwt-decode';
import { UserJwtDecodedInfo } from './account/account-type-module';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private router: Router) { }
  prevUserId:string =null;
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
  public onLogoutClick(): void {
    localStorage.removeItem("BearerToken");
    localStorage.clear();
    this.router.navigate(['/Account/Login']);
 }
 public isPrevUserId(): boolean{
  this.prevUserId = localStorage.getItem('APID')
  if(this.prevUserId != null){
    return true;
  }
  return false;
}   
}