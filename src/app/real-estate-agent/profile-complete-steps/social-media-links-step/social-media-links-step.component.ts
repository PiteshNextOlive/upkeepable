import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppToastService } from '../../../toast/app-toast.service';
import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons  } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/auth.service';
import { IRealEstateAgentProfileViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AccountService } from 'src/app/account/account.service';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
@Component({
  selector: 'app-social-media-links-step',
  templateUrl: './social-media-links-step.component.html',
  styleUrls: ['./social-media-links-step.component.css']
})
export class SocialMediaLinksStepComponent implements OnInit {
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
  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    private router: Router,public toastService: AppToastService,
    private route: ActivatedRoute,
    public authService: AuthService,
    private accountService: AccountService) { }
  submitted = false;

  inputForm: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
    isNotficationOn: [0, [Validators.required]],
    userRefId: [0, [Validators.required]],

    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: [''],
    userImage: [''],
    userImageBase64: [''],
    socialMedia_FacebookUrl: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    socialMedia_TweeterUrl: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    socialMedia_InstagramUrl: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    socialMedia_YoutubeUrl: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    isActive: [false, Validators.required],
    isDeleted: [false, Validators.required],
    isEmailConfirmed: [false, Validators.required],
    zipCode:[''],
    cityName:[''],
    stateCode:[''],
    address:['']
  }) as TForm<IRealEstateAgentProfileViewModel>;
//socialMedia_FacebookUrl:['', Validators.pattern('(?:(?:http|https):\/\/)?(?:www.|m.)?facebook.com\/(?!home.php)(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\.-]+)')],
  get formControls() { return this.inputForm.controls; }

  ngOnInit(): void {
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
       // console.log(this.inputForm.value)
        if (data.formModel.userImageBase64 != null) {
          this.profilePhoto = data.formModel.userImageBase64;
        }
      });
    });
  }

  onSubmit() {
  //  console.log(this.inputForm.value)
  this.submitted = true;
    if (this.inputForm.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "UpdateRealEstateAgentProfile").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.appHttpRequestHandlerService.httpGet({ id: this.inputForm.controls.userRefId.value }, "AccountManager", "RevalidateUserToken").pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: GenericResponseTemplateModel<string>) => {
              this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
              // localStorage.setItem("BearerToken", data.responseDataModel);
              // window.location.reload();
            });
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
     // this.invalidSize=true;
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
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SetAccountAsCancelled").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.router.navigate(['/Account/Login']);
        this.toastService.show("","Account deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
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
     // this.isDuplicateEmail=false;
    }
  }
}
