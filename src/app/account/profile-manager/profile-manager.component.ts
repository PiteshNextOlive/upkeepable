import { FormGroup,UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IState, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';

import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { UserJwtDecodedInfo } from '../account-type-module';
import { AccountService } from '../account.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-profile-manager',
  templateUrl: './profile-manager.component.html',
  styleUrls: ['./profile-manager.component.css']
})
export class ProfileManagerComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('content') content: TemplateRef<any>;
  fileUploadEventObject: any;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  defaultHomePhoto: string = environment.defaultHomePhoto;
  homePhoto: string = this.defaultHomePhoto;
  targetImageElementId: string = '';
  stateTypeEnum: EnumJsonTemplate[] = [];
  cityTypeEnum: EnumJsonTemplate[] = [];
  aspectRatio: string = '1/1';
  homeOwnerAddressId: number = 0;
  states: IState[] = [];
  invalidhomePhotoSize=true;
  invalidprofilePhotoSize=true;
  isDuplicateEmail: boolean=false;
  copyEmail: string="";
  @Input() homeOwnerAddressId_fromQueryStr: number=0;
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

  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(40)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: ['', Validators.required],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: ['']
  }) as TForm<IHomeOwnerProfileViewModel>;

  get formControls() { return this.inputForm.controls; }

  ngOnInit(): void {
   
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
      .subscribe(params => {
        //this.homeOwnerAddressId = params.info;
        if(this.homeOwnerAddressId_fromQueryStr!=undefined && this.homeOwnerAddressId_fromQueryStr>0){
          this.homeOwnerAddressId = this.homeOwnerAddressId_fromQueryStr;
        }
        else{
          this.homeOwnerAddressId = userJwtDecodedInfo.HomeOwnerAddressId;
        }
        this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressOwnerProfileById").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {
           
            this.inputForm.patchValue(data.formModel)
             this.inputForm.controls.isNotficationOn.patchValue(data.formModel.isNotficationOn==1 ? 'true' : 'false');
            this.copyEmail = data.formModel.email;

            if (data.formModel.userImageBase64 != null) {
              this.profilePhoto = data.formModel.userImageBase64;
            }
            if (data.formModel.homeProfileImageBase64 != null) {
              this.homePhoto = data.formModel.homeProfileImageBase64;
            }
            this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data: IState[]) => {
                this.states = data;
              });
            // this.stateTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "States");
            // this.cityTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "Cities");
            //this.inputForm.controls.homeOwnerAddressId.patchValue(this.homeOwnerAddressId);
          });

      });
  }

  onSubmit() {
   // localStorage.setItem("loaderStatus", "");
    this.submitted= true;
    if(this.inputForm.valid && this.inputForm.controls.email.valid){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
        this.inputForm.controls.homeOwnerAddressId.patchValue(this.homeOwnerAddressId);
        if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
          this.inputForm.controls.cityName?.patchValue("");
    
        }
        if (this.inputForm.valid && !this.isDuplicateEmail) {
          this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "UpdateHomeAddressProfile").pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: GenericServiceResultTemplate) => {
              this.toastService.show("","HO Submitted", 3000,"bg-success text-white","fa-check-circle");
          
              if(this.homeOwnerAddressId_fromQueryStr>0){
                this.router.navigate(['/Admin/Dashboard'])
              }
              else{
                this.appHttpRequestHandlerService.httpGet({ id: this.inputForm.controls.userRefId.value }, "AccountManager", "RevalidateUserToken").pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((data: GenericResponseTemplateModel<string>) => {
                  localStorage.setItem("BearerToken", data.responseDataModel);
                  this.router.navigate(['/HomeAddress/Dashboard'])
                    // .then(() => {
                    //   window.location.reload();
                    // });
                });
              }
            });
        }
        this.submitted = true;
      });
    }
  }

  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }

  onPhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.open(this.content);
    }
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }

  onImageCropper(croppedImageInfo: any) {
    this.modalService.dismissAll();
    if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
      this.homePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
      // if(this.homePhoto.length < 1400000){
      //   this.invalidhomePhotoSize=true;
      // }else{
      //   this.invalidhomePhotoSize=false;
      // }

    }
    else if (croppedImageInfo.targetImageElementId == 'profilePhotoImgElement') {
      this.profilePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.userImageBase64.patchValue(this.profilePhoto);
      // if(this.profilePhoto.length < 1400000){
      //   this.invalidprofilePhotoSize=true;
      // }else{
      //   this.invalidprofilePhotoSize=false;
      // }
    }
  }
  removeImage(imageToBeRemoved) {
    if (imageToBeRemoved == 'profilePhotoImgElement') {
      //this.invalidprofilePhotoSize=true;
      this.inputForm.controls.userImage.patchValue(null);
      this.inputForm.controls.userImageBase64.patchValue(null);
      this.profilePhoto = this.defaultProfilePhoto;
    }
    else if (imageToBeRemoved == 'homePhotoImgElement') {
     // this.invalidhomePhotoSize=true;
      this.inputForm.controls.homeProfileImage.patchValue(null);
      this.inputForm.controls.homeProfileImageBase64.patchValue(null);
      this.homePhoto = this.defaultHomePhoto;
    }
  }
  toggleChanged(val: any) {
    this.inputForm.controls.isNotficationOn.patchValue(val ? 1 : 0);
  }
  onChangeState() {
    this.inputForm.controls.cityName.patchValue('');
    this.cityTypeEnum = [];
    if (this.inputForm.controls.stateCode.value != '') {
      this.appHttpRequestHandlerService.httpGet({ stateCode: this.inputForm.controls.stateCode.value }, "CommonApi", "GetCitiesByStateRefId").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: any) => {
          let enumListTemplateLists: any[] = [];
          enumListTemplateLists.push(data)
          this.cityTypeEnum = this.commonOpsService.getEnumItemsByEnumName(enumListTemplateLists, "Cities");
        });
    }
  }
  onCancelAccountModelYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SetAccountAsCancelled").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
        this.router.navigate(['/Account/Login']);
      });
  }
  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }

  checkDuplicateEmail(){
    this.submitted = true;
    if(this.inputForm.controls.email.valid){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
        this.submitted = false;
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
