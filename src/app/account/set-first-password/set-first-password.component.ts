import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel,GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ISetPassword } from '../account-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-set-first-password',
  templateUrl: './set-first-password.component.html',
  styleUrls: ['./set-first-password.component.css']
})
export class SetFirstPasswordComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    private router: Router,public toastService: AppToastService,
    private route: ActivatedRoute) { }
  submitted = false;
  isSomethingWentWrong: boolean = false;
  fieldOldPass: boolean;
  fieldNewPass: boolean;
  inputForm: TForm<ISetPassword> = this.fb.group({
    userUniqueIdentityString: ["", Validators.required],
    password: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.minLength(6)]],
    repeatPassword: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
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
        if(params.Email != undefined || params.Email != ''){
          this.appHttpRequestHandlerService.httpGet({ email: params.Email}, "AccountManager", "checkActivateUser").pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: GenericResponseTemplateModel<number>) => {
              if(data?.responseDataModel==1){
                this.router.navigate(['/Account/Login']);
              }
              if(data?.responseDataModel==3){
                this.router.navigate(['/Account/Login']);
              }
            });
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
    if(this.inputForm.valid){
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "setPasswordAndActivateUser").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        this.router.navigate(['/Account/Login']);
      });
    }
  }
}
