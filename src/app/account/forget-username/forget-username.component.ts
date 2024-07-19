import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericResponseTemplateModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { LoginTypeModel } from '../account-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-forget-username',
  templateUrl: './forget-username.component.html',
  styleUrls: ['./forget-username.component.css']
})
export class ForgetUsernameComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,public toastService: AppToastService,
    private route: ActivatedRoute) { }
  submitted = false;
  isEmailSent=false;
  isSomethingWentWrong: boolean = false;
  serverErrorMsgText:string='';
  emailDoesNotExist: boolean=false;
  isReSubmit: false;
  inputForm: TForm<LoginTypeModel> = this.fb.group({
    userName: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    password: ['f1c0dc50-803d-485b-a92c-883d8bda7a96', Validators.required]
  }) as TForm<LoginTypeModel>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
  }
  onClickForgetPassword() {
    this.router.navigate(['/Account/ForgetPassword']);
  }
  onSubmit(isReSubmit): void {
    this.emailDoesNotExist=false;
    localStorage.removeItem("BearerToken");
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SendUserNameReminder").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        if(!data.responseDataModel){
          this.emailDoesNotExist=true;
        }
        else{
          this.isReSubmit=isReSubmit;
          this.isEmailSent=true;
         // console.log(this.isReSubmit)
        }
      });
  }
  onInputFormChange(){
    if(this.emailDoesNotExist){
      this.emailDoesNotExist=false;
    }
  }
  onClickLogin(){
    this.router.navigate(['/Account/Login']);
  }
}
