import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute,Router } from '@angular/router';
import { Subject } from 'rxjs';
import { GenericFormModel, GenericResponseTemplateModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { LoginTypeModel } from '../account-type-module';
import { map, takeUntil } from 'rxjs/operators';
import { AccountService } from '../account.service';
import { CookieService } from 'ngx-cookie';
import {PushNotificationService} from "../../push-notification.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public isloginError: boolean = false;
  public rememberme=false;
  public remembervalue = false;
  fieldPass: boolean;
  IsREA:boolean=false;
  public isLoginRestricted: boolean=false;
  public restrictedReasonMessage: string="";
  public uname: string="";
  public upass: string="";
  state$:any;
  constructor(private fb: UntypedFormBuilder, 
    private accountService: AccountService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    private cookieService: CookieService,
    private route: ActivatedRoute,
    protected ns:PushNotificationService
    ) { 
     
      localStorage.removeItem("BearerToken");
     // localStorage.clear();
      if(cookieService.get('remember')!==undefined){
        if(cookieService.get('remember')==='Y'){
          this.loginForm.controls.userName.patchValue(cookieService.get('username'));
          this.loginForm.controls.password.patchValue(cookieService.get('password'));
          this.rememberme=true;
        }
        else if(cookieService.get('remember')==='N' && window.history.state.user === "" && window.history.state.upsw == ""){
          this.cookieService.put('username','');
          this.cookieService.put('password','');
          this.rememberme=false;
        }
        else if(cookieService.get('remember')==='N'){
          this.loginForm.controls.userName.patchValue(cookieService.get('username'));
          this.loginForm.controls.password.patchValue(cookieService.get('password'));
          this.rememberme=false;
        }
       
      }
    }

  loginForm: TForm<LoginTypeModel> = this.fb.group({
    userName: ['', Validators.required],
    password: ['', Validators.required]
  }) as TForm<LoginTypeModel>;
  
  ngOnInit(): void {

    if (!localStorage.getItem('foo')) { 
      localStorage.setItem('foo', 'no reload') 
      location.reload() 
    } else {
      localStorage.removeItem('foo') 
    }
    
   // localStorage.removeItem("NewHomeOwner");
   // localStorage.clear();
   // console.log("login",localStorage.getItem("NewHomeOwner"));
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state))
    //localStorage.removeItem("BearerToken");
    //localStorage.clear();
    // localStorage.removeItem("BearerToken");
    // localStorage.clear();
  }
  ngAfterViewInit(){
    // localStorage.removeItem("BearerToken");
    // localStorage.clear();
  }
  togglePass() {
    this.fieldPass = !this.fieldPass;
  }

  onSubmit(): void {

    localStorage.removeItem("BearerToken");
    this.isloginError = false;
    this.isLoginRestricted = false;
    this.restrictedReasonMessage="";
    this.appHttpRequestHandlerService.httpPost(this.loginForm.value, "AccountManager", "login").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: string) => {
        //localStorage.setItem("loaderStatus", "0");
        if ((<any>data).isAvailable) {
          localStorage.setItem('firstTimeLogin', '1');
          if(this.rememberme){
            this.cookieService.put('remember','Y');
            this.cookieService.put('username',this.loginForm.controls.userName.value);
            this.cookieService.put('password',this.loginForm.controls.password.value);
          }  
          else {
            this.cookieService.put('remember','N');
            this.cookieService.put('username','');
            this.cookieService.put('password','');
          }          
          this.setTokenAndSendUserToHomePage((<any>data).token);
        }
        else {
          //IsLoginRestricted=true, RestrictedReasonMessage
          this.isloginError = true;
          if((<any>data).token ==  ''){
            this.isLoginRestricted=true;
            this.restrictedReasonMessage = "Invalid username or password..! ";
          }
          if ((<any>data).isLoginRestricted) {
            this.isLoginRestricted=true;
            this.restrictedReasonMessage = "Your account has been " + (<any>data).restrictedReasonMessage + ". " ;
           
          }
        }
        if ((<any>data).isREA) {
          this.isLoginRestricted=true;
          this.IsREA=true;
          this.restrictedReasonMessage ="You are no longer being sponsored by " + (<any>data).restrictedReasonMessage + ". ";
        }
      });
  }

  setTokenAndSendUserToHomePage(token: string) {
    localStorage.setItem("BearerToken", token);
    this.initiateHomePage();
  }

  onPasswordFocusIn() {
    //this.loginForm.controls.password.patchValue('');
  }
  // onPasswordFocusOut() {
  //   if (this.loginForm.controls.password.value.trim().length > 0) {
  //     this.loginForm.controls.password.patchValue(shajs('sha256').update(Md5.hashStr(this.loginForm.controls.password.value)).digest('hex'));
  //   }
  // }
  initiateHomePage() {
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {


      // this.appHttpRequestHandlerService.httpGet({ homeOwnerUserId: this.accountService.getUserJwtDecodedInfo().UserId }, "HomeOwnerAddress", "GetHomeAddressIdByHomeOwnerUserID").pipe(takeUntil(this.ngUnsubscribe))
      // .subscribe((data: GenericFormModel<number>) => {
        // this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: { info: data.formModel }});
        //this.router.navigate(['/HomeAddress/Dashboard']);
       // this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: {dl:"Y" }});
       if(this.accountService.getUserJwtDecodedInfo().IsAgree=='True'){
        this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: {dl:"Y" }});
       }
       if(this.accountService.getUserJwtDecodedInfo().IsAgree=='False'){
        this.router.navigate(['/Account/TermsAndConditions']);
       }
       
      //});
    } 
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER') {

      this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "Stripe", "CheckIsUserBecameCustomer").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        if(!data.responseDataModel){ // New Customer

          this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "Stripe", "CreateAndMapCustomer").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericResponseTemplateModel<boolean>) => {
            this.router.navigate(['/Pick-A-Product'], {queryParams: { 'c3e931f1-9e57-41e9-8025-001ce1a15414':  this.accountService.getUserJwtDecodedInfo().UserId}}); 
            //Go to checkout page
          });
        }
        else{
          this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "Stripe", "CheckCustomerHasActiveSubscription").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericResponseTemplateModel<boolean>) => {
            if(data.responseDataModel){
              
              this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "AccountManager", "CheckIsUserProfileCompleted").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data1: GenericResponseTemplateModel<boolean>) => {
                  if(data1.responseDataModel){
                    if(this.accountService.getUserJwtDecodedInfo().IsAgree=='False'){
                      this.router.navigate(['/Account/TermsAndConditions']);
                    }else{
                      this.router.navigate(['/RealEstateAgent/Dashboard']);
                    }
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
            else{
              this.router.navigate(['/Pick-A-Product'], {queryParams: { 'c3e931f1-9e57-41e9-8025-001ce1a15414':  this.accountService.getUserJwtDecodedInfo().UserId}}); 
            }
          });
        }
      });
    }
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'ADMIN_USER') {
      this.router.navigate(['/Admin/Dashboard']);
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  onClickForgetUsername() {
    this.router.navigate(['/Account/ForgetUsername']);
  }
  onClickForgetPassword() {
    this.uname = this.loginForm.controls.userName.value;
    this.upass = this.loginForm.controls.password.value;
    this.router.navigate(['/Account/ForgetPassword'], {
      state: {user: this.uname, upsw: this.upass}
  });
  }
  resetErrorMsg(){
    this.isloginError=false;
  }
  onRemberMeChange(event){
    var rmCheck =(<HTMLInputElement>document.getElementById("remember")).value
    this.rememberme = event.target.checked;
    if(this.rememberme == false)
    {
      this.cookieService.put('remember','N');
    }
    else{
      this.cookieService.put('remember','Y');
    }
  }
  
}
