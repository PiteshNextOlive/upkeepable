import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IResetPasswordResponseViewModel, ISetPassword } from '../account-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,public toastService: AppToastService,
    private router: Router,
    private route: ActivatedRoute) { }
  submitted = false;
  isSomethingWentWrong: boolean = false;
  forgetPasswordResMsg:string='';
  fieldOldPass: boolean;
  fieldNewPass: boolean;
  inputForm: TForm<ISetPassword> = this.fb.group({
    userUniqueIdentityString: ["xx", Validators.required],
    password:  ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.minLength(6)]],
    repeatPassword:  ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    dateString:[''],
  }, { validator: this.passwordMatchValidator }) as TForm<ISetPassword>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    localStorage.removeItem("BearerToken");
    this.route.queryParams
      .subscribe(params => {
        if (params.info == undefined || params.info == '') {
          this.isSomethingWentWrong = true;
        }
        else {
          this.inputForm.controls.userUniqueIdentityString.patchValue(params.info);
        }
      });
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
  onSubmit() {
    this.submitted = true;
    this.inputForm.controls.dateString.patchValue(new Date().toLocaleString());
    if(this.inputForm.valid){
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "ResetForgetPassword").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IResetPasswordResponseViewModel>) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        if(data.responseDataModel.isCompleted){
          this.inputForm.reset();
          this.router.navigate(['/Account/Login']);
        }
        else {
          this.isSomethingWentWrong = true;
          this.forgetPasswordResMsg="Password has been already used, please choose another Password";
        }
      });
    }
  }
}
