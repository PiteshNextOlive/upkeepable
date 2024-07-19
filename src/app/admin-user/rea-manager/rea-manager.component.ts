import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption } from 'ngx-bootstrap-multiselect';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, IState, TForm } from 'src/app/generic-type-module';
import { IHomeOwnerAddress, IHomeOwnerNewUserResponseViewModel, IHomeOwnerPauseViewModel, IHomeOwnerProfileViewModel, IHomeOwnerViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { IRealEstateAgentProfileViewModel, IReaNewUserResponseViewModel, IReaViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { environment } from 'src/environments/environment';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-rea-manager',
  templateUrl: './rea-manager.component.html',
  styleUrls: ['./rea-manager.component.css']
})
export class ReaManagerComponent implements OnInit {
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  dataTableParams: IDataTableParamsViewModel = {
    searchCode: '',
    pageNo: 0,
    pageSize: 0,
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
  totalRecords: number = 0;
  totalPages: number = 0;
  fakeArray = new Array(0);
  myOptions: IMultiSelectOption[];
  optionsModel: number[];
  states: IState[] = [];
  clientList: IReaViewModel[] = [];

  inputFormPause: TForm<IHomeOwnerPauseViewModel> = this.fb.group({
    userId: [0, Validators.required],
    pauseMessage: ['', [Validators.required, Validators.maxLength(500)]],
  }) as TForm<IHomeOwnerPauseViewModel>;

  get PauseClientformControls() { return this.inputFormPause.controls; }
  userId: number;
  submitted = false;
  selectedFilterOps: number[]=[];


  inputForm: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
    isNotficationOn: [0, [Validators.required]],
    userRefId: [0, [Validators.required]],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    socialMedia_FacebookUrl:[''],
    socialMedia_TweeterUrl:[''],
    socialMedia_InstagramUrl:[''],
    socialMedia_YoutubeUrl:[''],
    isActive: [],
    isDeleted: [],
    isEmailConfirmed: [],
    userStatusType:[],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: ['', Validators.required],
  }) as TForm<IRealEstateAgentProfileViewModel>;

  get formControls() { return this.inputForm.controls; }



  inputForm1: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
    userRefId: [0, [Validators.required]],
    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    userStatusType:[],
    credit: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(16)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    ccv: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(3)]],
    month: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(2)]],
    year: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(2)]],
  }) as TForm<IRealEstateAgentProfileViewModel>;

  get formControls1() { return this.inputForm1.controls; }
  //defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = null;
  hoList: IHomeOwnerViewModel[]=[];

  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  private cropModalReference: NgbModalRef;

  // inputFormHomeOwner: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
  //   homeOwnerAddressId: [0, Validators.required],
  //   address: ['', Validators.required],
  //   zipCode: ['', Validators.required],
  //   isNotficationOn: [0, [Validators.required]],
  //   homeProfileImage: [""],
  //   userRefId: [0, [Validators.required]],
  //   cityName: ['', Validators.required],
  //   stateCode: ['', Validators.required],

  //   firstName: ['', Validators.required],
  //   lastName: ['', Validators.required],
  //   email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
  //   phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
  //   userImage: [''],
  //   userImageBase64: [''],
  //   homeProfileImageBase64: [''],
  //   realEstateAgentUserRefId: [''],
  //   reaUser: ['', Validators.required]
  // }) as TForm<IHomeOwnerProfileViewModel>;
  // get InviteClientformControls() { return this.inputFormHomeOwner.controls; }

  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  @ViewChild('pauseAccountAlertModel') pauseAccountAlertModel: TemplateRef<any>;
  @ViewChild('unpauseReaAlertModel') unpauseReaAlertModel: TemplateRef<any>;
  @ViewChild('cancelAccountAlertModel') cancelAccountAlertModel: TemplateRef<any>;
  @ViewChild('reaDetailModel') reaDetailModel: TemplateRef<any>;
  reaDetalStep:number=1;
  selectedClient: IHomeOwnerViewModel=null;
  homePhoto: string = null;
  isDuplicateEmail: boolean=false;
  invalidSize:boolean=true;
  defaultProfilePhoto = environment.defaultProfilePhoto;
  searchText: string ='';
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    private fb: UntypedFormBuilder, 
    public commonOpsService:CommonOpsService,
    private modalService: NgbModal, 
    private router: Router,public toastService: AppToastService,
    private accountService: AccountService) {
    this.renderer.listen('window', 'click', (event: Event) => {
      var classList = (<HTMLElement>event.target).classList;
      if (!classList.value.includes('dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
          var openDropdown = dropdowns[i];
          if (openDropdown.classList.contains('show')) {
            openDropdown.classList.remove('show');
            document.getElementById("dis-table-container").classList.remove('dis-table-show');
          }
        }
      }

      if (!classList.value.includes('checkbox-dropdown')) {
        var dropdown = document.getElementById("filterDropDown");
        if (dropdown && dropdown.classList){
          if (dropdown.classList.contains('is-active')) {
            dropdown.classList.remove('is-active');
          }
        }
      }
    });
   
  }

  ngOnInit(): void {
    this.dataTableParams.searchCode = ' ';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'FirstName';
    this.dataTableParams.sortOrder = '1';
    this.dataTableParams.filterArray='';

    this.getClientList();
    // this.calcTotalPages();
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });

    this.myOptions = [
      { id: 1, name: 'Option 1' },
      { id: 2, name: 'Option 2' },
    ];
  }


  onChangeSortOrder(event) {
    this.dataTableParams.sortOrder = event.target.value;
    this.getClientList();
  }
  onChangePageSize(event) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = event.target.value;
    this.getClientList();
  }
  loadPage(event){
    this.dataTableParams.pageNo = event;
    this.getClientList();
}

  getClientList() {
    //this.dataTableParams.userId = this.userId;
    this.totalPages = 0;
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "RealEstateAgent", "GetReaList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IReaViewModel[]>) => {
         this.clientList = data.responseDataModel;
        // if(this.dataTableParams.sortColumn=='TotalHOs' && this.dataTableParams.sortOrder=='1'){
        //   this.clientList = this.clientList.sort((a, b) => (a.totalHOs > b.totalHOs ? -1 : 1));;
        // }
        // if(this.dataTableParams.sortColumn=='TotalHOs' && this.dataTableParams.sortOrder=='2'){
        //   this.clientList = this.clientList.sort((a, b) => (a.totalHOs < b.totalHOs ? -1 : 1));;
        // }
        if (this.clientList.length > 0) {
          this.totalRecords = this.clientList[0].maxRows;


          this.calcTotalPages();
        }
        else {
          this.totalRecords = 0;
        }
      });
  }
  onChangeOption(target, client) {
    var value = target.value;
    if(value==1){
      this.navigateToReaEditor(client.userId);
    }
    if(value==2){
      this.openPauseProfileModal(client.userId, this.pauseAccountAlertModel);
    }
    if(value==3){
      this.openUnPauseProfileModal(client.userId, this.unpauseReaAlertModel);
    }
    if(value==4){
      this.openCancelAccountModal(client.userId, this.cancelAccountAlertModel);
    }
    if(value==5){
      this.directLogin(client.userId)
    }
    if(value==6){
      this.getReaDetailById(client.userId, this.reaDetailModel);
    }
    target.value='0';
  }
  calcTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.dataTableParams.pageSize);
    this.fakeArray = Array(this.totalPages);
  }
  onClickSearchBar(){
    this.dataTableParams.pageNo=1;
    this.searchByKeyword((<HTMLInputElement>document.getElementById('searchKeyword')).value);
  }
  searchByKeyword(keyword: string) {
    this.dataTableParams.searchCode = keyword.trim();
    if(keyword.includes("'")){
      let v=keyword.replace(/'/g,"''");
      this.dataTableParams.searchCode=v;
    }
    this.getClientList();
  }
  sortByColName(colName: string){
   
    if(colName == this.dataTableParams.sortColumn){
   
      this.dataTableParams.sortOrder = (this.dataTableParams.sortOrder == '1' ? '2' : '1');
    }
    else{
      this.dataTableParams.sortOrder = '1';
    }
    this.dataTableParams.sortColumn = colName;
    this.getClientList();
  }
  showDopdownMenu(elementId) {
    var tableContainer = document.getElementById("dis-table-container");
    //if(!tableContainer.classList.contains('dis-table-show')){
      document.getElementById("dis-table-container").classList.add('dis-table-show')
    //}
    //else{
      //document.getElementById("dis-table-container").classList.remove('dis-table-show')
    //}

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
    document.getElementById('myDropdown' + elementId).classList.toggle("show");
  }
  onChange(event) {
   // console.log(this.optionsModel);
  }
  openEditClientModal(homeOwnerAddressId: number, content): NgbModalRef {
    //this.loadHomeOwnerProfile(homeOwnerAddressId);
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  openPauseProfileModal(userId: number, content) {
    this.userId=userId;
    this.submitted = false;
    this.inputFormPause.reset();
    this.inputFormPause.controls.userId.patchValue(this.userId);
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  openCancelAccountModal(userId: number, content) {
    this.userId=userId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }
  directLogin(userId){
    //this.inputForm.controls.userUniqueIdentityString.patchValue(userId);
    localStorage.setItem('APID', this.accountService.getUserJwtDecodedInfo().UserId)
    
    this.appHttpRequestHandlerService.httpGet({"userId": userId}, "AccountManager", "DirectLoginByAdmin").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: string) => {
      if ((<any>data).isAvailable) {
        this.setTokenAndSendUserToHomePage((<any>data).token);
      }
      else {
        //this.isSomethingWentWrong = true;
      }
    });
    //window.open('www.google.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); // Open new window
  }

  setTokenAndSendUserToHomePage(token: string) {
    localStorage.setItem("BearerToken", token);
    //console.log(this.accountService.getUserJwtDecodedInfo().RoleName);
    this.initiateHomePage();
    
  }
  initiateHomePage() {
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
      this.appHttpRequestHandlerService.httpGet({ homeOwnerUserId: this.accountService.getUserJwtDecodedInfo().UserId }, "HomeOwnerAddress", "GetHomeAddressIdByHomeOwnerUserID").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<number>) => {
        this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: { info: data.formModel, dl:"Y" }});
        setTimeout(()=>{
          window.location.reload();
        }, 500);
      });
    } 
    else if (this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER') {
      this.router.navigate(['/RealEstateAgent/Dashboard']);
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    } 
  }

  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }
  navigateToReaEditor(userId){
    this.modalService.dismissAll();
    this.router.navigate(['Admin/rea-editor'],{queryParams: { info: userId }});
    
  }
  onSubmitPause() {
    //console.log(this.inputFormPause.value, this.inputFormPause.valid)
    if (this.inputFormPause.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormPause.value, "RealEstateAgent", "PauseRea").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputFormPause.reset();
          this.modalService.dismissAll();
          this.getClientList();
        });
    }
    this.submitted = true;
  }

  openUnPauseProfileModal(userId: number, content) {
    this.userId=userId;
    this.inputFormPause.reset();
    this.inputFormPause.controls.userId.patchValue(this.userId);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  onSubmitUnpauseRea() {
   // console.log(this.inputFormPause.value, this.inputFormPause.valid)
    this.inputFormPause.controls.pauseMessage.patchValue("No Message");
    if (this.inputFormPause.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormPause.value, "RealEstateAgent", "UnpauseRea").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputFormPause.reset();
          this.modalService.dismissAll();
          this.getClientList();
        });
    }
    this.submitted = true;
  }
  onCancelAccountModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({userId: this.userId} , "RealEstateAgent", "RemoveRea").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
      if(this.clientList.length==1 && this.dataTableParams.pageNo>1){
        this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
      }
      this.modalService.dismissAll();
      this.getClientList();
    });
  }
  OpenFilterDropDown(){
    var dropdown = document.getElementById("filterDropDown");

      if (dropdown.classList.contains('is-active')) {
        dropdown.classList.remove('is-active');
      }
      else{
        dropdown.classList.add('is-active');
      }
  }
  
  onFilterOptionChange(event, id){
    this.dataTableParams.pageNo = 1;
    var rmCheck =(<HTMLInputElement>document.getElementById("filterOption_"+ id)).value;
    if(event.target.checked){
      this.selectedFilterOps.push(id);
    }
    else{
      const i = this.selectedFilterOps.indexOf(id);
      if (i >= 0) {
        this.selectedFilterOps.splice(i, 1);
      }
    }
    var filterOpsStr = JSON.stringify(this.selectedFilterOps)
    //console.log(filterOpsStr.substring(1,filterOpsStr.length-1));
    this.dataTableParams.filterArray= filterOpsStr.substring(1,filterOpsStr.length-1)
    this.getClientList();
  }

  getReaDetailById(userId: number, content) {
    this.userId=userId;
    this.reaDetalStep=1;
    this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
    this.appHttpRequestHandlerService.httpGet({ id: this.userId }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericFormModel<IRealEstateAgentProfileViewModel>) => {
     // console.log(data);
      this.inputForm.patchValue(data.formModel)
      if (data.formModel.userImageBase64 != null) {
        this.profilePhoto = data.formModel.userImageBase64;
      }
      this.appHttpRequestHandlerService.httpGet({ id: this.userId }, "RealEstateAgent", "GetRealEstateAgentAssociatedHoListById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeOwnerViewModel[]>) => {
        this.hoList = data.responseDataModel;
       // console.log(data.responseDataModel);
      });
    });
  }
  onSubmitInviteClient() {
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    this.inputForm.controls.userRefId.patchValue(0);
    this.inputForm.controls.isActive.patchValue(true);
    this.inputForm.controls.isDeleted.patchValue(false);
    this.inputForm.controls.isEmailConfirmed.patchValue(false);
    this.inputForm.controls.userStatusType.patchValue(0);
    //this.inputFormHomeOwner.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo.UserId);
    //this.inputForm.controls..patchValue(this.inputFormHomeOwner.controls.reaUser.value.userId);
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "CreateNewReaUser").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IReaNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputForm.reset();
          this.modalService.dismissAll();
          this.getClientList();
        });
    }
    this.submitted = true;
  }

  passClickToProfileFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onProfilePhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropModalReference = this.openCropImageModal(this.cropImageModal);
    }
  }
  onImageCropper(croppedImageInfo: any) {
    this.cropModalReference.close()
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
  onRemoveImage() {
    this.profilePhoto = null;
    //this.invalidSize=true;
    this.inputForm.controls.userImageBase64.patchValue(this.profilePhoto);
  }
  onCancelCropImageModal() {
    this.cropModalReference.close('Close click')
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  openInviteClientModal(content) : NgbModalRef{
    this.inputForm.reset();
   // this.invalidSize= true;
    this.submitted=false;
    this.isDuplicateEmail=false;
    this.inputForm.patchValue({
      isNotficationOn: 0,
      userRefId: 0,
  
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userImage: '',
      userImageBase64: '',
      socialMedia_FacebookUrl:'',
      socialMedia_TweeterUrl:'',
      socialMedia_InstagramUrl:'',
      socialMedia_YoutubeUrl:'',
      stateCode:''
    });
    this.profilePhoto=null;
    this.inputForm.controls.userRefId.patchValue(0);
    this.inputForm.controls.isActive.patchValue(true);
    this.inputForm.controls.isDeleted.patchValue(false);
    this.inputForm.controls.isEmailConfirmed.patchValue(false);
    this.inputForm.controls.userStatusType.patchValue(0);
    this.inputForm.controls.isNotficationOn.patchValue(0);
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
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
  
  setStepViewReaDetailView(step:number, userId: number){
    //this.reaDetalStep=step;
    // console.log(this.hoList)
    this.modalService.dismissAll();
    this.selectedClient = this.hoList.filter(x=>x.userId==userId)[0];
    this.directLogin(userId);
    //this.loadHomeOwnerProfile(parseInt(this.selectedClient.homeOwnerAddressId))
    //console.log(userId)
  }

  loadHomeOwnerProfile(homeOwnerAddressId: number) {

    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressOwnerProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {
        if (data.formModel.homeProfileImageBase64 != null) {
          this.homePhoto = data.formModel.homeProfileImageBase64;
        }
        else{
          this.homePhoto =null;
        }
      });
  }
  checkDuplicateEmail(){
    if(this.inputForm.controls.email.valid){
      alert(this.inputForm.controls.email.value);
      alert(this.inputForm.controls.userRefId.value);
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
  dismissAllModels(){
    this.modalService.dismissAll();
  }
}
