import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IState, TForm } from 'src/app/generic-type-module';
import { IRealEstateAgentMessage, IRealEstateAgentWelcomeMessage } from '../real-estate-agent-type-module';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { IHomeOwnerNewUserResponseViewModel, IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ClientManagerComponent } from '../client-manager/client-manager.component';
import { Router, ActivatedRoute } from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AccountService } from 'src/app/account/account.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-real-estate-agent-index',
  templateUrl: './real-estate-agent-index.component.html',
  styleUrls: ['./real-estate-agent-index.component.css']
})
export class RealEstateAgentIndexComponent implements OnInit {
  public monthNamesWithCodes: any[] = [
    { monthCode: 1, monthAbbr: 'Jan.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 2, monthAbbr: 'Feb.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 3, monthAbbr: 'Mar.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 4, monthAbbr: 'Apr.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 5, monthAbbr: 'May.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 6, monthAbbr: 'Jun.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 7, monthAbbr: 'Jul.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 8, monthAbbr: 'Aug.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 9, monthAbbr: 'Sep.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 10, monthAbbr: 'Oct.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 11, monthAbbr: 'Nov.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 12, monthAbbr: 'Dec.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false }];
  public currentYear: number = new Date().getFullYear();
  public yearsWithInfo: any[] = [
    { year: this.currentYear, isSelcted: true },
    { year: this.currentYear + 1, isSelcted: false }];
  public selectedMonth: number = 0;
  public selectedYear: number = this.currentYear;
  submitted = false;
  optionalLinks: string[] = [];
  //alreayDraftedMonths:number[]=[];
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  @ViewChild('qrCodeModalContent') qrCodeModalContent: TemplateRef<any>;
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  messageHomePhoto: string = '';
  userJwtDecodedInfo: UserJwtDecodedInfo;
  stateTypeEnum: EnumJsonTemplate[] = [];
  cityTypeEnum: EnumJsonTemplate[] = [];
  //defaultHomePhoto: string = environment.defaultHomePhoto;
  homePhoto: string = null;
  userId: number;
  
  value = '';
  valueUserIdUrl = '';
  states: IState[]=[];
  private cropModalReference: NgbModalRef;
  isCompleteHomeProfile: boolean = false;
  @ViewChild('clientManagerTemplate') clientManagerTemplate: ClientManagerComponent;
  isDuplicateEmail: boolean=false;
  searchText: string ='';

  constructor(private modalService: NgbModal,
    config: NgbModalConfig,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private fb: UntypedFormBuilder,
    private location: LocationStrategy,
    public authService: AuthService,
    public toastService: AppToastService,
    public activeModal: NgbActiveModal,
    public commonOpsService: CommonOpsService,
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
  // inputFormMessage: TForm<IRealEstateAgentMessage> = this.fb.group({
  //   realEstateAgentMessageId: [0, Validators.required],
  //   month: ['', Validators.required],
  //   year: ['', Validators.required],
  //   subject: ['', Validators.required],
  //   shortDescription: ['', Validators.required],
  //   messageText: ['', Validators.required],
  //   optionalLinks: [[]],
  //   messageImage: [''],
  //   optionalLinkText: [''],
  //   messageImageBase64: [''],
  //   userRefId: [0, Validators.required],
  //   selectedMonthCommaSeparated: ['', Validators.required],
  //   selectedYearCommaSeparated: ['', Validators.required],
  // }) as TForm<IRealEstateAgentMessage>;

  inputFormWelcomeMessage: TForm<IRealEstateAgentWelcomeMessage> = this.fb.group({
    realEstateAgentWelcomeMessageId: [0, Validators.required],
    messageText: ['', [Validators.required]],
    userRefId: ['', Validators.required],
  }) as TForm<IRealEstateAgentWelcomeMessage>;

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

  //get formControls() { return this.inputFormMessage.controls; }
  get InviteClientformControls() { return this.inputForm.controls; }
  ngOnInit(): void {    
    

    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.userId = Number(this.userJwtDecodedInfo.UserId);  
   
    var username = this.userJwtDecodedInfo?.EmailId.split('@')[0];
    this.value=window.location.origin.concat("/"+username);
    this.valueUserIdUrl=window.location.origin.concat('/Account/QRClientbyAgent/?foo=' + this.userId);

    // this.disableAllPastMonths(this.currentYear);
    // this.getAlreadyDraftedMessageMonthsByYear();
    // this.inputFormMessage.controls.year.patchValue(this.selectedYear);

    this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "AccountManager", "CheckIsUserProfileCompleted").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data1: GenericResponseTemplateModel<boolean>) => {
        if(!data1.responseDataModel){
          this.router.navigate(['/RealEstateAgent/CompleteProfileSteps']);
          
        }
      });
  }

  preventSelection(event: MouseEvent): void {
    event.preventDefault();
  }

  openModal(content) : NgbModalRef{
    // this.selectedYear =  new Date().getFullYear();
    // this.currentYear = this.selectedYear;
    // this.inputFormMessage.reset();
    // //this.onClickYear(this.currentYear);
    // this.disableAllPastMonths(this.currentYear);
    // this.getAlreadyDraftedMessageMonthsByYear();
    // this.inputFormMessage.controls.year.patchValue(this.selectedYear);
    // this.optionalLinks=[];
    return this.modalService.open(content, { size: 'lg' });
  }
  openWelcomeModal(content) : NgbModalRef{
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId}, "RealEstateAgent", "GetRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessage>) => {
        this.inputFormWelcomeMessage.reset();
        this.inputFormWelcomeMessage.patchValue(data.formModel);
        this.inputFormWelcomeMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
        if (data.formModel == null) {
          this.inputFormWelcomeMessage.controls.realEstateAgentWelcomeMessageId.patchValue(0);
        }
      });
    return this.modalService.open(content, { size: 'lg' });
  }

  openInviteClientModal(content) : NgbModalRef{
    this.isCompleteHomeProfile=false;
    this.submitted=false;
    this.inputForm.reset();
    this.isDuplicateEmail=false;
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
    this.appHttpRequestHandlerService.httpGet({ id: 0}, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
    // this.stateTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "States");
    //   this.cityTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "Cities");
    return this.modalService.open(content, { size: 'lg' });
  }


  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg' });
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

  onWelcomeMessageFormSubmit() {
    if (this.inputFormWelcomeMessage.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormWelcomeMessage.value, "RealEstateAgent", "UpdateRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
        });
    }
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
  // open(content) {
  //   this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
  //   }, (reason) => {
  //   });
  // }

  copyInputMessage(inputElement) {
    if (inputElement) {
      navigator.clipboard.writeText(inputElement).then(() => {        
      }).catch(err => {        
      });
    }
  }

  // copyInputMessage(inputElement){
  //   debugger;
  //   inputElement.select();
  //   document.execCommand('copy');
  //   inputElement.setSelectionRange(0, 0);
  // }

  async download(parent): Promise<void>{
    var canvasd = <HTMLCanvasElement> document.createElement('canvas'); 
    var ctx = canvasd.getContext('2d'); 
    var image1=parent.qrcElement.nativeElement.querySelector("img");
    var image2=<HTMLCanvasElement> document.getElementById('qrLogo');
    canvasd.width = image1.width; 
    canvasd.height = image1.height; 
    ctx.drawImage(image1, 0, 0); 
    ctx.drawImage(image2, 125, 125); 
    var combinedImage = new Image(); 
    combinedImage.src = canvasd.toDataURL(); 
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href =combinedImage.src
    link.click();
  }
  onSubmit() {
    this.inputForm.controls.homeOwnerAddressId.patchValue(0);
    this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo.UserId);
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "InviteNewHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.inputForm.reset();
          this.toastService.show("","Homeowner added successfully", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
          this.clientManagerTemplate.searchByKeyword('');
          if(this.isCompleteHomeProfile){
            this.router.navigate(['/HomeAddress/ManageHomeDetails'], { queryParams: { info: data.formModel.homeOwnerAddressId } });
          }
        });
    }
    this.submitted = true;
  }
  onSubmitWithskipHomeDetails(){
    this.isCompleteHomeProfile=false;
    this.onSubmit();
  }
  onSubmitWithCompleteHomeDetails(){
    this.isCompleteHomeProfile=true;
    this.onSubmit();
  }
  onClickSearchBar(){
    this.clientManagerTemplate.searchByKeyword((<HTMLInputElement>document.getElementById('searchKeyword')).value);
  }
  openProfileManagerPage() {
    this.router.navigate(['/Account/Settings']);
  }
  onClieckViewAllClients(){
    this.router.navigate(['/RealEstateAgent/AllClients']);
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
  onRefreshMessageListEvent(){}
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
  }
}
