import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericFormModel, GenericResponseTemplateModel, IState, TForm } from 'src/app/generic-type-module';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import {Router, ActivatedRoute} from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AccountService } from 'src/app/account/account.service';
import { AppToastService } from '../../toast/app-toast.service';
import { IRealEstateAgentViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-home-owner-welcom',
  templateUrl: './home-owner-welcom.component.html',
  styleUrls: ['./home-owner-welcom.component.css']
})
export class HOWelcomeComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  submitted = false;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  pageAdditionalInfo: IRealEstateAgentViewModel;
  messageHomePhoto: string = '';
  homePhoto: string = null;
  userId: number;
  homeownerEmail : string;
  homwownerId: number;
  value = ''; 
  states: IState[]=[];
  isLoad: number = 1;
  private cropModalReference: NgbModalRef;
  isCompleteHomeProfile: boolean = false;
  isDuplicateEmail: boolean=false;
  selCollapseBtn: string='collapseOne';
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(40)]],
    zipCode: ['', [Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: [''],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: [''],
    realEstateAgentUserRefId: [''],
  }) as TForm<IHomeOwnerProfileViewModel>;
  get InviteClientformControls() { return this.inputForm.controls; }
  constructor(private modalService: NgbModal,
    config: NgbModalConfig,
    private sharedService: SharedService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private fb: UntypedFormBuilder,
    public commonOpsService: CommonOpsService,
    private activatedRoute: ActivatedRoute,
    private location: LocationStrategy,
    public toastService: AppToastService,
    private router: Router,
    private accountService: AccountService) {
    config.backdrop = 'static';
    config.keyboard = false;
    history.pushState(null, null, window.location.href);  
    this.location.onPopState(() => {
    this.modalService.dismissAll();
    history.pushState(null, null, window.location.href);
    }); 
  }
  toggleCollapse(collapseBtn: string){
     var allCollapsibles = document.querySelectorAll(".accordion-collapse");
     var isAlreadyCollapsed = document.getElementById(collapseBtn).classList.contains('collapse');
 
     allCollapsibles.forEach(element => {
       if (collapseBtn == element.id && isAlreadyCollapsed){
         document.getElementById(collapseBtn).classList.remove('collapse')
       }
       else if (collapseBtn == element.id && !isAlreadyCollapsed){
         document.getElementById(collapseBtn).classList.add('collapse')
       }
       else{
         document.getElementById(element.id).classList.add('collapse')
       }
     });
   }

   isCollapsedShown(collapseId: string){
    return !document.getElementById(collapseId).classList.contains('collapse')
  }
  ngOnInit(): void {
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth' 
    });
    this.activatedRoute.queryParams.subscribe(params => {
      this.userId = params['foo'];
      this.homeownerEmail = params['info'];
      this.homwownerId = params['homwownerId'];
    });
    this.appHttpRequestHandlerService.httpGet({ id: this.userId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentViewModel>) => {
        this.pageAdditionalInfo = data.formModel;
        if (data.formModel.userImageBase64 != null) {
          this.profilePhoto = data.formModel.userImageBase64;
        }
    });
  }
  onSubmitWithskipHomeDetails(){
    this.isCompleteHomeProfile=false;
   // this.onSubmit();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }
  onSubmit(isSubmit) : void{
    this.inputForm.controls.homeOwnerAddressId.patchValue(0);
    this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.userId);
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    if (isSubmit) {
      this.appHttpRequestHandlerService.httpPost({Id: this.homwownerId, Email: this.homeownerEmail} , "RealEstateAgent", "ResendEmailVerification").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: string) => {
         // this.inputForm.reset();
          this.toastService.show("","Resend Email Verification successfully", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
        //  this.clientManagerTemplate.searchByKeyword('');
         
        });
    }
    this.submitted = true;
  }
  passClickToHomeProfileFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onHomeProfilePhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropModalReference  = this.openCropImageModal(this.cropImageModal);
    }
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg' });
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
    }
  }
  
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
  
  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onPhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropModalReference  = this.openCropImageModal(this.cropImageModal);
    }
  }
  onImageCropper(croppedImageInfo: any) {
    this.cropModalReference.close()
    if (croppedImageInfo.targetImageElementId == 'messagePhotoImgElement') {
      this.messageHomePhoto = croppedImageInfo.croppedImage;
      (<HTMLInputElement>document.getElementById('messagePhotoBrowserInput')).value = '';
      //this.inputFormMessage.controls.messageImageBase64.patchValue(this.messageHomePhoto);
      // this.appHttpRequestHandlerService.httpPost({ homeOwnerAddressId: this.homeOwnerAddressId, homeProfileImageBase64: this.defaultHomePhoto }, "HomeOwnerAddress", "UpdateHomeAddressPhoto").pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe((data: GenericServiceResultTemplate) => { });
    }
    else if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
      this.homePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
    }
  }
  onRemoveImage() {
    this.messageHomePhoto = null;
    this.homePhoto=null;
    this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
  }
  onCancelCropImageModal(){
    this.cropModalReference.close('Close click')
  }

}
