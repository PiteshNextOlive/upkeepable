import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { UserJwtDecodedInfo } from '../account-type-module';
import { IAdminProfileViewModel } from 'src/app/admin-user/admin-user-type-module';
import { AccountService } from '../account.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-profile-manager-admin',
  templateUrl: './profile-manager-admin.component.html',
  styleUrls: ['./profile-manager-admin.component.css']
})
export class ProfileManagerAdminComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('content') content: TemplateRef<any>;
  fileUploadEventObject: any;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  homeOwnerAddressId: number=0;
  fieldOldPass: boolean;
  fieldNewPass: boolean;
  fieldConfirmNewPass: boolean;
  isDuplicateEmail: boolean=false;
  copyEmail: string="";
  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    private router: Router,
    public toastService: AppToastService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private accountService: AccountService) { }
  submitted = false;

  inputForm: TForm<IAdminProfileViewModel> = this.fb.group({
    userRefId: [0, [Validators.required]],
    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
   
  }, { validator: this.passwordMatchValidator }) as TForm<IAdminProfileViewModel>;

  get formControls() { return this.inputForm.controls; }


  ngOnInit(): void {
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId }, "AccountManager", "GetAdminProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IAdminProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
        this.copyEmail = data.formModel.email;
      });
    });
  }
  passwordMatchValidator(frm: UntypedFormGroup) {
    return frm.value.newPassword === frm.value.confirmPassword ? null : { 'mismatch': true };
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
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "UpdateAdminProfile").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.appHttpRequestHandlerService.httpGet({ id: this.inputForm.controls.userRefId.value }, "AccountManager", "RevalidateUserToken").pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: GenericResponseTemplateModel<string>) => {
              localStorage.setItem("BearerToken", data.responseDataModel);
              //this.router.navigate(['/Account/Login']);
              this.router.navigate(['/Admin/Dashboard'])
                .then(() => {
                  window.location.reload();
                });
            });
        });
    }
  }
  checkDuplicateEmail(){
    if(this.inputForm.controls.email.valid){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
      });
    }
  }
  onEmailFocusOut(){
    if(this.isDuplicateEmail){
      //this.inputForm.controls.email.patchValue('');
      //this.isDuplicateEmail=false;
    }
    if(this.isDuplicateEmail && (this.inputForm.controls.email.value == this.copyEmail) ){
      this.isDuplicateEmail=false;
    }
  }

}
