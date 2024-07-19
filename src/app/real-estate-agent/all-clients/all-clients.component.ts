import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/auth.service';
import { GenericFormModel, GenericResponseTemplateModel, IState, TForm } from 'src/app/generic-type-module';
import { IHomeOwnerNewUserResponseViewModel, IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { ClientManagerComponent } from '../client-manager/client-manager.component';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-all-clients',
  templateUrl: './all-clients.component.html',
  styleUrls: ['./all-clients.component.css']
})
export class AllClientsComponent implements OnInit {
  userId: number;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  isCompleteHomeProfile: boolean = false;
  states: IState[]=[];
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  @ViewChild('clientManagerTemplate') clientManagerTemplate: ClientManagerComponent;
  private cropModalReference: NgbModalRef;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  //defaultHomePhoto: string = environment.defaultHomePhoto;
  homePhoto: string = null;
  submitted = false;
  copyEmail: string="";
  isDuplicateEmail: boolean=false;
  searchText: string ='';
  invalidSize:boolean=true;
  constructor(private router: Router, 
    public authService: AuthService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private modalService: NgbModal,
    public toastService: AppToastService,
    public commonOpsService: CommonOpsService,
    private fb: UntypedFormBuilder,
    private accountService: AccountService) { }
  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    zipCode: ['', [Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: [''],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: [''],
    realEstateAgentUserRefId: [''],
  }) as TForm<IHomeOwnerProfileViewModel>;
  get InviteClientformControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.userId = Number(this.userJwtDecodedInfo.UserId);
  }
  onClickDashboard(){
    this.router.navigate(['/RealEstateAgent/Dashboard']);
  }
  onClickSearchBar(){
    this.clientManagerTemplate.searchByKeyword((<HTMLInputElement>document.getElementById('searchKeyword')).value);
  }
  openInviteClientModal(content) : NgbModalRef{
    this.isCompleteHomeProfile=false;
    this.submitted=false;
    this.isDuplicateEmail=false;
    this.inputForm.reset();
    this.inputForm.patchValue({
      homeOwnerAddressId: 0,
      address: '',
      zipCode: '',
      isNotficationOn: 0,
      homeProfileImage: "",
      userRefId: 0,
      cityName: '',
      stateCode: '',
  
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userImage: '',
      userImageBase64: '',
      homeProfileImageBase64: '',
      realEstateAgentUserRefId: '',
    });
    this.homePhoto=null;
    //this.invalidSize=true;
    this.appHttpRequestHandlerService.httpGet({ id: 0}, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
    // this.stateTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "States");
    //   this.cityTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "Cities");
    return this.modalService.open(content, { size: 'lg' });
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
  onImageCropper(croppedImageInfo: any) {
    this.cropModalReference.close()
   if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
      this.homePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
    }
    // if(this.homePhoto.length < 1400000){
    //   this.invalidSize=true;
    // }else{
    //   this.invalidSize=false;
    // }
  }
  // onRemoveImage() {
  //   this.messageHomePhoto = null;
  //   this.inputFormMessage.controls.messageImageBase64.patchValue(this.messageHomePhoto);
  // }
  onCancelCropImageModal(){
    this.cropModalReference.close('Close click')
  }
  onSubmit() {
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    this.inputForm.controls.homeOwnerAddressId.patchValue(0);
    this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo.UserId);
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "InviteNewHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputForm.reset();
          this.modalService.dismissAll();
          this.clientManagerTemplate.searchByKeyword('');
          if(this.isCompleteHomeProfile){
            this.router.navigate(['/HomeAddress/ManageHomeDetails'], { queryParams: { info: data.formModel.homeOwnerAddressId } });
          }
        });
    }
    this.submitted = true;
  }
  onSubmitWithSkipHomeDetails(){
    this.isCompleteHomeProfile=false;
    this.onSubmit();
  }
  onSubmitWithCompleteHomeDetails(){
    this.isCompleteHomeProfile=true;
    this.onSubmit();
  }
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
  searchPressed(event){
    if(event.keyCode==13){
      this.onClickSearchBar()
    }
  }
  searchKeyUp(event){
    this.searchText =(<HTMLInputElement>document.getElementById('searchKeyword')).value;
    if(((event.keyCode==8 || event.keyCode==46) && event.target.value.trim().length==0)){
      this.onClickSearchBar()
    }
  }

  clearSearch(){
    (<HTMLInputElement>document.getElementById('searchKeyword')).value='';
    this.searchText='';
      this.onClickSearchBar()
  }

  onRemoveImage() {
    this.homePhoto = null;
    //this.invalidSize=true;
    this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
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
  }

}
