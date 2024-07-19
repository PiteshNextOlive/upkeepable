import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { GenericResponseTemplateModel } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public isloginError: boolean = false;
  public rememberme=false;
  fieldPass: boolean;
  userName: string="";
  userid: string= "";
  role: string="";
  disabled: boolean=true;
  disabledClass: string="";
  public isLoginRestricted: boolean=false;
  public restrictedReasonMessage: string="";
  constructor(private fb: UntypedFormBuilder, 
    private accountService: AccountService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    ) { 
    }
  ngOnInit(): void {
    //console.log("this.accountService.getUserJwtDecodedInfo()",this.accountService.getUserJwtDecodedInfo())
var data = this.accountService.getUserJwtDecodedInfo();
if(data!=null)
{
  this.userName=this.accountService.getUserJwtDecodedInfo().FullName;
  this.userid = this.accountService.getUserJwtDecodedInfo().UserId;
  this.role = this.accountService.getUserJwtDecodedInfo().RoleName;
localStorage.setItem("UserName",this.userName);
localStorage.setItem("UserId",this.userid);
localStorage.setItem("RoleName",this.role);
}else
{
  this.userName=localStorage.getItem('UserName');
  this.userid=localStorage.getItem('UserId');
  this.role=localStorage.getItem('RoleName');
}
  }
  onNativeChange(e) { 
    if(e.target.checked==true){
      this.disabledClass='btn-primary';
      this.disabled=false;
    }
    if(e.target.checked==false){
      this.disabledClass='btn-secondary-disabled';
      this.disabled=true;
    }
  }

  onSubmit(): void {
    //debugger;
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
      
      this.appHttpRequestHandlerService.httpGet({ id:  this.userid}, "AccountManager", "setTermsConditions").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data?.responseDataModel) {
          this.setTokenAndSendUserToHomePage(data.responseDataModel);
        }
        else {
          //IsLoginRestricted=true, RestrictedReasonMessage
          this.isloginError = true;
          if ((<any>data).isLoginRestricted) {
            this.isLoginRestricted=true;
            this.restrictedReasonMessage = (<any>data).restrictedReasonMessage
          }

        }
      });
        
    } 
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER') {

      this.appHttpRequestHandlerService.httpGet({ id:  this.userid}, "AccountManager", "setTermsConditions").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        if (data?.responseDataModel) {
          this.setTokenAndSendUserToHomePage(data.responseDataModel);
        }
      });
    }
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'ADMIN_USER') {
      this.router.navigate(['/Admin/Dashboard']);
    }
  }

  setTokenAndSendUserToHomePage(token: string) {
    localStorage.setItem("BearerToken", token);
    this.initiateHomePage();
  }

  initiateHomePage() {
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
        this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: {dl:"Y" }});
    } 
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER') {
      this.appHttpRequestHandlerService.httpGet({ id:  this.userid}, "AccountManager", "CheckIsUserProfileCompleted").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data1: GenericResponseTemplateModel<boolean>) => {
            if(data1.responseDataModel){
              this.router.navigate(['/RealEstateAgent/Dashboard']);
             }
            else{ 
              if(this.accountService.getUserJwtDecodedInfo().IsAgree=='False'){
               this.router.navigate(['/Account/TermsAndConditions']);
              }else{
                this.router.navigate(['/RealEstateAgent/CompleteProfileSteps']);
              }
            }
       });
    }
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'ADMIN_USER') {
      this.router.navigate(['/Admin/Dashboard']);
    }
  }
  
}
