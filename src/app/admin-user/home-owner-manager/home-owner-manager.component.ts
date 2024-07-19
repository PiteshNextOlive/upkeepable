import { Component, ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IMultiSelectOption } from 'ngx-bootstrap-multiselect';
import { Observable, OperatorFunction, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, IState, TForm } from 'src/app/generic-type-module';
import { IHomeOwnerNewUserResponseViewModel, IHomeOwnerPauseViewModel, IHomeOwnerProfileViewModel, IHomeOwnerViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { IRealEstateUserViewModal } from 'src/app/real-estate-agent/real-estate-agent-type-module';
//import { IRealEstateAgentClientViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { environment } from 'src/environments/environment';
import { DropDownContent, State } from '../admin-user-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-home-owner-manager',
  templateUrl: './home-owner-manager.component.html',
  styleUrls: ['./home-owner-manager.component.css']
})
export class HomeOwnerManagerComponent implements OnInit {
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  //@Input() userId: number;
  @Input() showHeaderTitle: boolean;
  clientList: IHomeOwnerViewModel[] = [];
  selectedClient: IHomeOwnerViewModel;
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
  isCompleteHomeProfile: boolean = false;
  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: ['', Validators.required],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: [''],
    realEstateAgentUserRefId: ['', Validators.required],
    reaUser: ['', Validators.required]
  }) as TForm<IHomeOwnerProfileViewModel>;

  //defaultHomePhoto: string = environment.defaultHomePhoto;
  homePhoto: string = null;
  states: IState[] = [];
  submitted = false;
  copyEmail: string="";
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  invalidSize:boolean=true;
  private cropModalReference: NgbModalRef;
  homeOwneruserId: number;
  homeOwnerAddressId: number;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  @ViewChild('pauseAccountAlertModel') pauseAccountAlertModel: TemplateRef<any>;
  @ViewChild('unpauseHoAlertModel') unpauseHoAlertModel: TemplateRef<any>;
  @ViewChild('editClientModalContent') editClientModalContent: TemplateRef<any>;
  @ViewChild('cancelAccountAlertModel') cancelAccountAlertModel: TemplateRef<any>;
  @ViewChild('viewHomeDetailModalContent') viewHomeDetailModalContent: TemplateRef<any>;
  realEstateUsers: IRealEstateUserViewModal[]=[];

  inputFormHomeOwner: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: ['', Validators.required],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: [''],
    realEstateAgentUserRefId: ['', Validators.required],
    reaUser: ['', Validators.required]
  }) as TForm<IHomeOwnerProfileViewModel>;

  inputFormPauseHO: TForm<IHomeOwnerPauseViewModel> = this.fb.group({
    userId: [0, Validators.required],
    pauseMessage: ['', [Validators.required, Validators.maxLength(500)]],
  }) as TForm<IHomeOwnerPauseViewModel>;

  get InviteClientformControls() { return this.inputFormHomeOwner.controls; }
  get PauseClientformControls() { return this.inputFormPauseHO.controls; }

  //public model: IRealEstateUserViewModal;

	formatter = (rea: IRealEstateUserViewModal) => rea.name;
  filterOptions: DropDownContent[] = new Array<DropDownContent>();
  selectedFilterOps: number[]=[];
  isDuplicateEmail: boolean=false;
  defaultHomePhoto: string = environment.defaultHomePhoto;
  searchText: string ='';
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    private fb: UntypedFormBuilder, public toastService: AppToastService,
    private modalService: NgbModal, 
    private router: Router,
    private accountService: AccountService,
    public commonOpsService: CommonOpsService) {
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
    });
  }
  get editClientformControls() { return this.inputForm.controls; }


  optionsModel: number[];
 // myOptions: IMultiSelectOption[];

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

    this.getAllRealEstateAgents();

  //   this.myOptions = [
  //     { id: 1, name: 'Option 1' },
  //     { id: 2, name: 'Option 2' },
  // ];


    
  }
  onChangeSortOrder(event) {
    this.dataTableParams.sortOrder = event.target.value;
    this.getClientList();
  }
  onChangeOption(target, client) {
    var value = target.value;
    if(value==1){
      this.openEditClientModal(client.homeOwnerAddressId, this.editClientModalContent);
    }
    if(value==2){
      this.openPauseHomeOwnerAccountModal(client.userId, this.pauseAccountAlertModel);
    }
    if(value==3){
      this.openUnPauseProfileModal(client.userId, this.unpauseHoAlertModel);
    }
    if(value==4){
      this.openCancelHomeOwnerAccountModal(client.userId, this.cancelAccountAlertModel);
    }
    if(value==5){
      this.directLogin(client.userId);
    }
    if(value==6){
      this.openViewHomeDetailModal(client.homeOwnerAddressId, this.viewHomeDetailModalContent);
    }
    target.value='0';
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
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "HomeOwnerAddress", "GetHomeOwnerList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeOwnerViewModel[]>) => {
        this.clientList = data.responseDataModel;
        if (this.clientList.length > 0) {
          this.totalRecords = this.clientList[0].maxRows;
          this.calcTotalPages();
        }
        else {
          this.totalPages=0;
          this.totalRecords = 0;
        }
      });
  }

  calcTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.dataTableParams.pageSize);
    this.fakeArray = Array(this.totalPages);
    if(this.dataTableParams.pageNo>this.totalPages){
      this.dataTableParams.pageNo = this.totalPages;
    }
  }
  onClickSearchBar(){
    this.searchByKeyword((<HTMLInputElement>document.getElementById('searchKeyword')).value);
  }
  searchByKeyword(keyword: string) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.searchCode = keyword.trim();
    if(keyword.includes("'")){
      let v=keyword.replace(/'/g,"''");
      this.dataTableParams.searchCode=v;
    }
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


  openEditClientModal(homeOwnerAddressId: number, content): NgbModalRef {
    this.inputForm.reset();
    this.submitted=false;
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
      reaUser:''
    });
    this.homePhoto=null;
    //this.invalidSize=true;
    this.loadHomeOwnerProfile(homeOwnerAddressId);
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  openViewHomeDetailModal(homeOwnerAddressId:number, content): NgbModalRef {
    this.homeOwnerAddressId = homeOwnerAddressId;
    this.selectedClient=this.clientList.filter(x=>x.homeOwnerAddressId== String(homeOwnerAddressId))[0];

    this.loadHomeOwnerProfile(homeOwnerAddressId)


    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  loadHomeOwnerProfile(homeOwnerAddressId: number) {
    //debugger;
    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressOwnerProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
        this.copyEmail = data.formModel.email;
        let rea = this.realEstateUsers.filter(x=>x.userId==data.formModel.realEstateAgentUserRefId.toString())[0];
        this.inputForm.controls.reaUser.setValue({userId: rea?.userId, name:rea?.name});
        // if (data.formModel.userImageBase64 != null) {
        //   this.profilePhoto = data.formModel.userImageBase64;
        // }
        if (data.formModel.homeProfileImageBase64 != null) {
          this.homePhoto = data.formModel.homeProfileImageBase64;
        }
        else{
          this.homePhoto =null;
        }
      });
  }
  onSubmit() {
    //debugger;
    this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.inputForm.controls.reaUser?.value?.userId);
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    this.submitted=true;
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.inputForm.controls.reaUser?.value?.userId);
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "UpdateHomeAddressProfile").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        this.modalService.dismissAll();
        this.getClientList();
        this.submitted=false;
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
      this.cropModalReference = this.openCropImageModal(this.cropImageModal);
    }
  }
  onImageCropper(croppedImageInfo: any) {
    this.cropModalReference.close()
     if (croppedImageInfo.targetImageElementId == 'newHomePhotoImgElement') {
      this.homePhoto = croppedImageInfo.croppedImage;
      this.inputFormHomeOwner.controls.homeProfileImageBase64.patchValue(this.homePhoto);
    }
    else if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
    this.homePhoto = croppedImageInfo.croppedImage;
    this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
    } 
    // if(this.homePhoto.length < 1400000){
    //   this.invalidSize=true;
    // }else{
    //   this.invalidSize=false;
    // }
  }
  onRemoveImage() {
   // this.invalidSize=true;
    this.homePhoto = null;
    this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);

    this.inputFormHomeOwner.controls.homeProfileImageBase64.value=null;
    this.inputFormHomeOwner.controls.homeProfileImageBase64.patchValue(null);
  }
  onCancelCropImageModal() {
    this.cropModalReference.close('Close click')
  }
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  openCancelHomeOwnerAccountModal(homeOwneruserId: number, content) {
    this.homeOwneruserId=homeOwneruserId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }

  openPauseHomeOwnerAccountModal(homeOwneruserId: number, content) {
    this.homeOwneruserId=homeOwneruserId;
    this.inputFormPauseHO.reset();
    this.submitted=false;
    this.inputFormPauseHO.controls.userId.patchValue(this.homeOwneruserId);

    // this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    // }, (reason) => {
    // });
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false  });
  }

  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }
  onCancelAccountModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({homeOwnerUserRefId: this.homeOwneruserId} , "RealEstateAgent", "RemoveHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
      this.modalService.dismissAll();
      if(this.clientList.length==1 && this.dataTableParams.pageNo>1){
        this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
      }
      this.getClientList();
    });
  }
  onPauseAccountModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({homeOwnerUserRefId: this.homeOwneruserId} , "RealEstateAgent", "PauseHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
      this.modalService.dismissAll();
      this.getClientList();
    });
  }
  openEditHomeDetail(homeOwnerAddressId){
    this.router.navigate(['HomeAddress/Details'], { queryParams: { info: homeOwnerAddressId } });
  }
  onCancelViewDetailModelNoClick() {
    this.modalService.dismissAll();
  }
  onEditViewHomeDetail(){
    this.modalService.dismissAll();
    this.openEditHomeDetail(this.homeOwnerAddressId)
  }
  getAllRealEstateAgents(){
    this.appHttpRequestHandlerService.httpGet({ id: 0}, "RealEstateAgent", "GetAllRealEstateUsers").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRealEstateUserViewModal[]>) => {
        this.realEstateUsers = data.responseDataModel;
      });
  }
  openInviteClientModal(content) : NgbModalRef{
    this.isCompleteHomeProfile=false;
    this.inputFormHomeOwner.reset();
    this.submitted=false;
    this.isDuplicateEmail=false;
    this.inputFormHomeOwner.patchValue ({
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
      reaUser: ''
    });
    this.homePhoto=null;
    this.copyEmail="";
    //this.invalidSize=true;
    this.appHttpRequestHandlerService.httpGet({ id: 0}, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        //debugger;
        this.states = data;
      });
    // this.stateTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "States");
    //   this.cityTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "Cities");
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  onSubmitInviteClient() {
    //debugger;
    this.inputFormHomeOwner.controls.homeOwnerAddressId.patchValue(0);
    if(this.inputFormHomeOwner.controls.cityName?.value?.trim()?.length  == 0){
      this.inputFormHomeOwner.controls.cityName?.patchValue("");
    }
    //this.inputFormHomeOwner.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo?.UserId);
     this.inputFormHomeOwner.controls.realEstateAgentUserRefId.patchValue(this.inputFormHomeOwner.controls.reaUser.value?.userId);
    if (this.inputFormHomeOwner.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormHomeOwner.value, "RealEstateAgent", "CreateNewHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputFormHomeOwner.reset();
          this.modalService.dismissAll();
          if(this.isCompleteHomeProfile){
            this.router.navigate(['/HomeAddress/ManageHomeDetails'], { queryParams: { info: data.formModel.homeOwnerAddressId } });
          }
          this.getClientList();
        });
    }
    this.submitted = true;
  }
search: OperatorFunction<string, readonly { userId; name }[]> = (text$: Observable<string>) =>
  text$.pipe(
    debounceTime(200),
    distinctUntilChanged(),
    filter((term) => term.length >= 2),
    map((term) => this.realEstateUsers.filter((rea) => new RegExp(term, 'mi').test(rea.name)).slice(0, 10)),
  );

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
  onChange(event) {
   // console.log(this.optionsModel);
  }

  onSubmitPauseHO() {
   // console.log(this.inputFormPauseHO.value, this.inputFormPauseHO.valid)
    if (this.inputFormPauseHO.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormPauseHO.value, "RealEstateAgent", "PauseHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputFormPauseHO.reset();
          this.modalService.dismissAll();
          this.getClientList();
        });
    }
    this.submitted = true;
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
    //window.location.reload();
    this.initiateHomePage();
  }
  initiateHomePage() {
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
      this.appHttpRequestHandlerService.httpGet({ homeOwnerUserId: this.accountService.getUserJwtDecodedInfo().UserId }, "HomeOwnerAddress", "GetHomeAddressIdByHomeOwnerUserID").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<number>) => {
        //this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: { info: data.formModel, dl:"Y" }});
        this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: { info: data.formModel, dl:"Y" }});
          setTimeout(()=>{
            window.location.reload();
          }, 500);
        });
      } 
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
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.filterArray= filterOpsStr.substring(1,filterOpsStr.length-1)
    this.getClientList();
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
  onSubmitWithCompleteHomeDetails(){
    //debugger;
    this.isCompleteHomeProfile=true;
    this.onSubmitInviteClient();
  }
  onSubmitWithSkipHomeDetails(){
    this.isCompleteHomeProfile=false;
    this.onSubmitInviteClient();
  }
  checkDuplicateEmail(modalMode: string){
  
    if(modalMode=='N'){
     // console.log(this.inputFormHomeOwner.controls.userRefId.value)
      if(this.inputFormHomeOwner.controls.email.valid){
        this.accountService.checkDuplicateEmail({value: this.inputFormHomeOwner.controls.email.value, id: this.inputFormHomeOwner.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<boolean>) => {
          this.isDuplicateEmail = data.responseDataModel;
        });
      }
    }
    else if(modalMode=='E'){
      //console.log(this.inputForm.controls.userRefId.value)
      if(this.inputForm.controls.email.valid){
        this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<boolean>) => {
          this.isDuplicateEmail = data.responseDataModel;
        });
      }
    }
  }
  onEmailFocusOut(modalMode: string){
    if(this.isDuplicateEmail){
      if(modalMode=='N'){
       // this.inputFormHomeOwner.controls.email.patchValue('');
      }
      else if(modalMode=='E'){
        //this.inputForm.controls.email.patchValue('');
      }
      //this.isDuplicateEmail=false;
    }
    if(this.isDuplicateEmail && (this.inputForm.controls.email.value == this.copyEmail) && (this.copyEmail!="")){
      this.isDuplicateEmail=false;
    }
  }
  dismissAllModels(){
    this.modalService.dismissAll();
  }
  openUnPauseProfileModal(userId: number, content) {
    this.homeOwneruserId=userId;
    this.inputFormPauseHO.reset();
    this.inputFormPauseHO.controls.userId.patchValue(this.homeOwneruserId);
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }

  onSubmitUnpause() {
    this.inputFormPauseHO.controls.pauseMessage.patchValue("No Message");
    if (this.inputFormPauseHO.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormPauseHO.value, "RealEstateAgent", "UnpauseHomeOwner").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IHomeOwnerNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.inputFormPauseHO.reset();
          this.modalService.dismissAll();
          this.getClientList();
        });
    }
    this.submitted = true;
  }
}
