import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IResetPassword, IResetPasswordResponseViewModel, ISetPassword, UserJwtDecodedInfo } from '../account-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    private router: Router,
    public toastService: AppToastService,
    private route: ActivatedRoute,
    public authService: AuthService) { }
  submitted = false;
  fieldOldPass: boolean;
  fieldNewPass: boolean;
  fieldConfirmNewPass: boolean;
  isSomethingWentWrong: boolean = false;
  serverErrorMsgText:string='';
  inputForm: TForm<IResetPassword> = this.fb.group({
    userId: [0, Validators.required],
    oldPassword: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    password: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.minLength(6)]],
    repeatPassword: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
  }, { validator: this.passwordMatchValidator }) as TForm<IResetPassword>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.inputForm.controls.userId.patchValue(userJwtDecodedInfo.UserId);
  }
  passwordMatchValidator(frm: UntypedFormGroup) {
    return frm.value.password === frm.value.repeatPassword ? null : { 'mismatch': true };
  }
  toggleOldPass() {
    this.fieldOldPass = !this.fieldOldPass;
  }
  toggleNewPass() {
    this.fieldNewPass = !this.fieldNewPass;
  }
  toggleConfirmNewPass() {
    this.fieldConfirmNewPass = !this.fieldConfirmNewPass;
  }
  onSubmit() {
    this.submitted = true;
    if (this.inputForm.valid){
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "ReSetPassword").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IResetPasswordResponseViewModel>) => {
        if(data.responseDataModel.messageText != 'Wrong password..!'){
         this.toastService.show("","Password changed successfully", 3000,"bg-success text-white","fa-check-circle");
        }
        if(data.responseDataModel.isCompleted){
          this.serverErrorMsgText='';
          this.router.navigate(['/Account/Login']);
        }
        else{
          this.serverErrorMsgText="Please enter correct old password.";
        }
      });
    }
  }
}
