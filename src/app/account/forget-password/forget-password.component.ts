import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GenericResponseTemplateModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { LoginTypeModel } from '../account-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,public toastService: AppToastService,
    private route: ActivatedRoute) { }
  submitted = false;
  isEmailSent=false;
  IsREA:boolean=false;
  public restrictedReasonMessage: string="";
  isSomethingWentWrong: boolean = false;
  serverErrorMsgText:string='';
  emailDoesNotExist: boolean=false;
  state$:any;
  isReSubmit: false;
  inputForm: TForm<LoginTypeModel> = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    password: ['f1c0dc50-803d-485b-a92c-883d8bda7a96', Validators.required],
    forgetType: ['Password']
  }) as TForm<LoginTypeModel>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit():void {
    this.state$ = this.route.paramMap
    .pipe(map(() => window.history.state))
  }
  onClickForgetUsername() {
    this.router.navigate(['/Account/ForgetUsername']);
  }
  onSubmit(isReSubmit): void {
    this.emailDoesNotExist=false;
    localStorage.removeItem("BearerToken");
    this.submitted=true;
    if(this.inputForm.valid){
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SendUserNameReminder").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: string) => {
        if((<any>data).responseDataModel.isEmailSent==false && (<any>data).responseDataModel.isREA==false){
          this.emailDoesNotExist=true;
        }
        if((<any>data).responseDataModel.isEmailSent==false && (<any>data).responseDataModel.isREA==true){
          this.emailDoesNotExist=false;
          this.IsREA=true;
          this.restrictedReasonMessage ="You are no longer being sponsored by " + (<any>data).responseDataModel.reaName + ". ";
        }
        if((<any>data).responseDataModel.isEmailSent==true){
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.isReSubmit=isReSubmit;
          this.isEmailSent=true;
        }
        // else{
        //   this.isReSubmit=isReSubmit;
        //   this.isEmailSent=true;
        //   //console.log(this.isReSubmit)
        // }
      });
    }
  }
  onInputFormChange(){
    if(this.emailDoesNotExist){
      this.emailDoesNotExist=false;
    }
  }
  onClickLogin(){
    this.router.navigate(['/Account/Login'], {
      state: {user: window.history.state.user, upsw: window.history.state.upsw}
  });
  }
}
