import { UntypedFormBuilder, Validators } from '@angular/forms';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IState, TForm } from 'src/app/generic-type-module';
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
import { IRealEstateAgentProfileViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AccountService } from '../account.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-profile-manager-rea',
  templateUrl: './profile-manager-rea.component.html',
  styleUrls: ['./profile-manager-rea.component.css']
})
export class ProfileManagerReaComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();

  @ViewChild('content') content: TemplateRef<any>;
  fileUploadEventObject: any;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  invalidSize:boolean=true;
  homeOwnerAddressId: number=0;
  isDuplicateEmail: boolean=false;
  copyEmail: string="";
  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private accountService: AccountService) { }
  submitted = false;

  inputForm: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
    isNotficationOn: [0, [Validators.required]],
    userRefId: [0, [Validators.required]],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    socialMedia_FacebookUrl: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    socialMedia_TweeterUrl: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    socialMedia_InstagramUrl: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    socialMedia_YoutubeUrl: ['', [Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
    isActive: [false, Validators.required],
    isDeleted: [false, Validators.required],
    isEmailConfirmed: [false, Validators.required],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(40)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    cityName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(50)]],
    stateCode: ['', Validators.required],
  }) as TForm<IRealEstateAgentProfileViewModel>;
//socialMedia_FacebookUrl:['', Validators.pattern('(?:(?:http|https):\/\/)?(?:www.|m.)?facebook.com\/(?!home.php)(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\.-]+)')],
  get formControls() { return this.inputForm.controls; }
  states: IState[] = [];
  ngOnInit(): void {
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
        this.copyEmail = data.formModel.email;
        if (data.formModel.userImageBase64 != null) {
          this.profilePhoto = data.formModel.userImageBase64;
        }
      });
      this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
    });
  }

  onSubmit() {
    
    if(this.inputForm.valid && this.inputForm.controls.email.valid){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
        if (this.inputForm.valid && !this.isDuplicateEmail) {
          this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "UpdateRealEstateAgentProfile").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Settings updated successfully", 3000,"bg-success text-white","fa-check-circle");          
          this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "Stripe", "UpdateAndMapCustomer").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericResponseTemplateModel<boolean>) => {
            if(data.responseDataModel == true)
            {
              this.appHttpRequestHandlerService.httpGet({ id: this.inputForm.controls.userRefId.value }, "AccountManager", "RevalidateUserToken").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data: GenericResponseTemplateModel<string>) => {
                localStorage.setItem("BearerToken", data.responseDataModel);
                this.router.navigate(['/RealEstateAgent/Dashboard'])
                  // .then(() => {
                  //   window.location.reload();
                  // });
              });
            }
        });
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
   if (croppedImageInfo.targetImageElementId == 'profilePhotoImgElement') {
      this.profilePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.userImageBase64.patchValue(this.profilePhoto);
      // if(this.profilePhoto.length < 1400000){
      //   this.invalidSize=true;
      // }else{
      //   this.invalidSize=false;
      // }
    }
  }
  removeImage(imageToBeRemoved) {
    if (imageToBeRemoved == 'profilePhotoImgElement') {
      this.invalidSize=true;
      this.inputForm.controls.userImage.patchValue(null);
      this.inputForm.controls.userImageBase64.patchValue(null);
      this.profilePhoto = this.defaultProfilePhoto;
    }
   
  }
  toggleChanged(val: any) {
    this.inputForm.controls.isNotficationOn.patchValue(val ? 1 : 0);
  }
  
  onCancelAccountModelYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SetAccountAsCancelledEmail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Request has been sent.", 3000,"bg-success text-white","fa-check-circle");
       // this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
       // this.router.navigate(['/Account/Login']);
      });
  }
  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
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
     // this.inputForm.controls.email.patchValue('');
     //this.isDuplicateEmail=false;
    }
    if(this.isDuplicateEmail && (this.inputForm.controls.email.value == this.copyEmail) ){
      this.isDuplicateEmail=false;
    }
  }
}
