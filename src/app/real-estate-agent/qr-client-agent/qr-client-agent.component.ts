import { Component, HostListener, Injectable, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal, NgbModalConfig, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import {EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, IState, TForm } from 'src/app/generic-type-module';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { IHomeOwnerNewUserResponseViewModel, IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import {Router, ActivatedRoute, CanDeactivate} from '@angular/router';
import { LocationStrategy } from '@angular/common';
import { AccountService } from 'src/app/account/account.service';
import { AppToastService } from '../../toast/app-toast.service';
import { IRealEstateAgentViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { environment } from 'src/environments/environment';
import { SharedService } from 'src/app/shared.service';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
import { CookieService } from 'ngx-cookie';
//import { IHomeVariableMainCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
declare var $: any

@Component({
  selector: 'app-qr-client-agent',
  templateUrl: './qr-client-agent.component.html',
  styleUrls: ['./qr-client-agent.component.css'],
})



export class QRClientAgentComponent implements OnInit { 

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
  getemail:string;
  value = ''; 
  states: IState[]=[];
  homeTypeEnum: EnumJsonTemplate[] = [];
  enumListTemplateLists: any;
  homeType:any;  
  isLoad: number = 1;
  homeAddressGeneralDetailId: number=0;
  mainCategories:IHomeVariableMainCategory[]=[];
  private cropModalReference: NgbModalRef;
  isCompleteHomeProfile: boolean = false;
  isDuplicateEmail: boolean=false;
  selCollapseBtn: string='collapseOne';
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;

  //QrcodeUrl: any;

  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeAddressGeneralDetailId: [0, Validators.required],
    homeType: [0],
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
    isShareable:false,
    userId:[0],
  }) as TForm<IHomeOwnerProfileViewModel>;

  get InviteClientformControls() { return this.inputForm.controls; }
  subCategories:IHomeVariableSubCategory[]=[];

  @Input() mainCategory: IHomeVariableMainCategory;


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
    private accountService: AccountService,
    private cookieService: CookieService
     ) {
    config.backdrop = 'static';
    config.keyboard = false;
    history.pushState(null, null, window.location.href);  
    this.location.onPopState(() => {
    this.modalService.dismissAll();
    history.pushState(null, null, window.location.href);   
    }); 

    $(document).ready(function(){
      // $(".et_pb_video_overlay").click(function(){
      //   $(this).addClass("hide");


       

      // });

      document.getElementById('et_pb_video_overlay').addEventListener('click', function () {
        this.classList.add("hide");
        const videoId = 'C1APWZYa3jg';
        const iframe = document.createElement('iframe');
        // iframe.setAttribute('width', '560');
        // iframe.setAttribute('height', '315');
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.position = "absolute";
        iframe.style.top = "0";
        iframe.setAttribute('src', `https://www.youtube.com/embed/${videoId}?autoplay=1`);
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        iframe.setAttribute('allowfullscreen', '');
    
        const videoContainer = document.getElementById('iframe_container');
        videoContainer.innerHTML = '';
        videoContainer.appendChild(iframe);
      });
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

  
  ngOnInit() {
    
    window.scroll({ 
      top: 0, 
      left: 0, 
      behavior: 'smooth'
    });

    this.activatedRoute.params.subscribe(params => {     
    
      this.getemail = params['id'];
    });
 
  
       this.appHttpRequestHandlerService.httpPost({EmailId : this.getemail}, "AccountManager", "GetUserDetails").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
       
      console.log("location",data)
     // const userId = data.data.userId;     

      const userId = data.data.userId;
      this.userId = data.data.userId;
      this.inputForm.patchValue({
              userId: data.data.userId
             });
  

  this.appHttpRequestHandlerService.httpGet({ id: this.userId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
  .subscribe((data: GenericFormModel<IRealEstateAgentViewModel>) => {
   
    this.pageAdditionalInfo = data.formModel; 
    this.enumListTemplateLists = data.enumListTemplateLists;
    if (data.formModel.userImageBase64 != null) {
      this.profilePhoto = data.formModel.userImageBase64;
    }
       
  });

    });


    this.getAllSubCategories(1);   
    localStorage.removeItem("Bea  rerToken");
    localStorage.clear();
    localStorage.setItem("NewHomeOwner", "true");
    localStorage.setItem("isLoad", "1");
    //console.log("qr",localStorage.getItem("NewHomeOwner"));
    this.sharedService.send_data.next(true);
    document.getElementById('collapseOne').classList.add('collapse');
    // this.activatedRoute.queryParams.subscribe(params => {
    // this.userId = params['foo'];
    // });
    this.appHttpRequestHandlerService.httpGet({ id: 0}, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
    
      setTimeout(() => {
        this.getAllMainCategories();
      }, 500);
      
  }

  getAllMainCategories(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllMainCategoriesWithAllChilds").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableMainCategory[]>) => {
      this.mainCategories=data?.responseDataModel;
      setTimeout(() => {
      this.enumListTemplateLists =this.mainCategories[0]?.homeVariableSubCategories[0]?.homeVariableSubCategoryListItems.filter(x=>x.homeVariableSubCategoryRefId == 1 && !x.isDeleted);
    }, 500);
      // console.log(this.mainCategories)
      // console.log(this.enumListTemplateLists)
    });
  }

  onSubmitWithskipHomeDetails(){
    this.isCompleteHomeProfile=false;
    this.onSubmit();
  }
  scroll(el: HTMLElement) {
    el.scrollIntoView({behavior: 'smooth'});
  }

  getValues(){
    this.appHttpRequestHandlerService.httpGet({ homeAddressGeneralDetailId: this.homeAddressGeneralDetailId }, "HomeOwnerAddress", "GetHomeAddressGeneraldetail").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {      
      this.homeTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HomeTypeEnum");
     
    }); 

  }

  getAllSubCategories(id: number){
    if(id){
    this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {       

      this.subCategories=data.responseDataModel;
      this.getValues();
     
      // this.inputForm.patchValue({
      //  // homeType: 0,
      //   homeType: this.subCategories[0]?.homeVariableSubCategoryListItems[0]?.homeVariableSubCategoryListItemId,
      // })
    });
  }
}

  onSubmit() {
    this.inputForm.controls.isShareable.value= true;
    // if(this.inputForm.controls.homeType?.value == null || this.inputForm.controls.homeType?.value == 0)
    //   {
    //     this.inputForm.patchValue({
    //        homeType: this.subCategories[0]?.homeVariableSubCategoryListItems[0]?.homeVariableSubCategoryListItemId,
    //      })
    //      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressGeneraldetail").pipe(takeUntil(this.ngUnsubscribe))
    //   }

    // if(this.inputForm.controls.homeType?.value == null || this.inputForm.controls.homeType?.value == 0)
    //   {
    //     this.inputForm.patchValue({
    //        homeType: this.mainCategories[0]?.homeVariableSubCategories[0]?.homeVariableSubCategoryListItems[0]?.homeVariableSubCategoryListItemId,
    //      })
    //   }
    if(this.inputForm.controls.homeType?.value == null || this.inputForm.controls.homeType?.value == 0)
      {
        this.inputForm.patchValue({
           homeType: this.subCategories[0]?.homeVariableSubCategoryListItems[0]?.homeVariableSubCategoryListItemId,
         })
      }
    this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.userId);
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    //console.log("this.inputForm.value",this.inputForm.value)
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "InviteNewHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
        //this.inputForm.reset();
          this.toastService.show("","Homeowner added successfully", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
          this.router.navigate(['/Account/HOWelcomeComponent'], { queryParams: { info: this.inputForm.controls.email.value, homwownerId: data.formModel.homeOwnerAddressId,  foo: this.userId}});
        });
    }
    this.submitted = true;
  }
  passClickToHomeProfileFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }

  openVideoModal(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  onVideoModalCancelClick() {
    this.modalService.dismissAll();
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

