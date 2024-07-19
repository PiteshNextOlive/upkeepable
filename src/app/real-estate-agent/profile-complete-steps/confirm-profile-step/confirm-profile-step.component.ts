import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/auth.service';
import { IFooterLink } from 'src/app/footer-link/footer-link-type-module';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { environment } from 'src/environments/environment';
import { IRealEstateAgentMessage, IRealEstateAgentProfileViewModel } from '../../real-estate-agent-type-module';
import { AppToastService } from '../../../toast/app-toast.service';
@Component({
  selector: 'app-confirm-profile-step',
  templateUrl: './confirm-profile-step.component.html',
  styleUrls: ['./confirm-profile-step.component.css']
})
export class ConfirmProfileStepComponent implements OnInit {
  userJwtDecodedInfo: UserJwtDecodedInfo;
  footerLinks:IFooterLink[]=[];
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  messageText: string='';
  MessageList: IRealEstateAgentMessage[] = [];
  dataTableParams: IDataTableParamsViewModel = {
    searchCode: '',
    pageNo: 1,
    pageSize: 1000,
    sortColumn: '',
    searchColumn: '',
    sortColumn1: '',
    sortOrder: '',
    userId: 0,
    filterArray:'',
    boolFlag1:0,
    month:0,
    year:0,
    tabValue:0
  };


  @ViewChild('content') content: TemplateRef<any>;
  fileUploadEventObject: any;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  invalidSize:boolean=true;
  homeOwnerAddressId: number=0;
  isDuplicateEmail: boolean=false;

  @Output() setStepEvent = new EventEmitter<any>();
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    public authService: AuthService, 
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    public commonOpsService: CommonOpsService,
    private router: Router,
    private route: ActivatedRoute,
    public toastService: AppToastService,
    private accountService: AccountService) { }
    submitted = false;

    inputForm: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
      isNotficationOn: [0, [Validators.required]],
      userRefId: [0, [Validators.required]],
  
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
      phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
      userImage: [''],
      userImageBase64: [''],
      socialMedia_FacebookUrl:[''],
      socialMedia_TweeterUrl:[''],
      socialMedia_InstagramUrl:[''],
      socialMedia_YoutubeUrl:[''],
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
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.getAllFooterLinks();
    this.getWelComeMessage();
    this.getMessageList_Drafted();

    this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
        //console.log(this.inputForm.value)
        if (data.formModel.userImageBase64 != null) {
          this.profilePhoto = data.formModel.userImageBase64;
        }
      });
    });

  }

  getAllFooterLinks(){
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId}, "FooterLink", "GetFooterLinksByUserRefId").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IFooterLink[]>) => {
      this.footerLinks = data.responseDataModel;     
    });
  }

  getWelComeMessage(){
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId}, "RealEstateAgent", "GetRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessage>) => {
        this.messageText = data.formModel.messageText;
      });
  }
  getMessageList_Drafted() {
    this.dataTableParams.userId =Number(this.userJwtDecodedInfo.UserId);
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "RealEstateAgent", "GetRealEstateAgentMessages_Drafted").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRealEstateAgentMessage[]>) => {
        this.MessageList = data.responseDataModel;
        // if (this.MessageList.length > 0) {
        //   this.totalRecords = this.MessageList[0].maxRows;
        //   this.calcTotalPages();
        // }
        // else {
        //   this.totalRecords = 0;
        // }
      });
  }
  getMonthNameByCode(monthCode: number): string{
    let monthNamesWithCodes: any[] = [
      { monthCode: 1, monthAbbr: 'Jan' },
      { monthCode: 2, monthAbbr: 'Feb' },
      { monthCode: 3, monthAbbr: 'Mar' },
      { monthCode: 4, monthAbbr: 'Apr' },
      { monthCode: 5, monthAbbr: 'May' },
      { monthCode: 6, monthAbbr: 'Jun' },
      { monthCode: 7, monthAbbr: 'Jul' },
      { monthCode: 8, monthAbbr: 'Aug' },
      { monthCode: 9, monthAbbr: 'Sep' },
      { monthCode: 10, monthAbbr: 'Oct' },
      { monthCode: 11, monthAbbr: 'Nov' },
      { monthCode: 12, monthAbbr: 'Dec' }];
      if(monthCode){
        return monthNamesWithCodes.filter(x=>x.monthCode == monthCode)[0].monthAbbr;
      }
      else{
        return '';
      }
      //return monthNamesWithCodes.filter(x=>x.monthCode == monthCode)[0].monthAbbr;
  }


  onSubmit() {
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
    this.submitted = true;
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
    }
    // if(this.profilePhoto.length < 1400000){
    //   this.invalidSize=true;
    // }else{
    //   this.invalidSize=false;
    // }
  }
  removeImage(imageToBeRemoved) {
    if (imageToBeRemoved == 'profilePhotoImgElement') {
      //this.invalidSize=true;
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
        this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
        this.router.navigate(['/Account/Login']);
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
  }


  setStep(step){

  }
}
