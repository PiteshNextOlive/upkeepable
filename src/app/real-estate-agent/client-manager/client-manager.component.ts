import { Component,  ElementRef, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel1, IState, TForm } from 'src/app/generic-type-module';
import { IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { environment } from 'src/environments/environment';
import { LocationStrategy } from '@angular/common';
import { IRealEstateAgentClientViewModel } from '../real-estate-agent-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-client-manager',
  templateUrl: './client-manager.component.html',
  styleUrls: ['./client-manager.component.css']
})
export class ClientManagerComponent implements OnInit {
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  @Input() userId: number;
  @Input() showHeaderTitle: boolean;
  clientList: IRealEstateAgentClientViewModel[] = [];
  selectedClient: IRealEstateAgentClientViewModel;
  dataTableParams: IDataTableParamsViewModel1 = {
    searchCode: '',
    pageNo: 0,
    pageSize: 0,
    sortColumn: '',
    searchColumn: '',
    sortColumn1: '',
    sortOrder: '',
    isload:0,
    userId: 0,
    filterArray:'',
    boolFlag1:0,
    month:0,
    year:0,
    tabValue:0
  };
  totalRecords: number = 0;
  totalPages: number = 0;
  copyEmail: string="";
  isValidCityName: boolean=true;
  fakeArray = new Array(0);
  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(40)]],
    zipCode: ['', [Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.pattern(/^[a-zA-Z ]*$/),Validators.maxLength(20)]],
    stateCode: [''],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: ['']
  }) as TForm<IHomeOwnerProfileViewModel>;

  //defaultHomePhoto: string = environment.defaultHomePhoto;
  homePhoto: string = null;
  states: IState[] = [];
  submitted = false;
  invalidhomePhotoSize=true;
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  private cropModalReference: NgbModalRef;
  homeOwneruserId: number;
  homeOwnerAddressId: number;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  @ViewChild('cancelAccountAlertModel') cancelAccountAlertModel: TemplateRef<any>;
  @ViewChild('editClientModalContent') editClientModalContent: TemplateRef<any>;
  isDuplicateEmail: boolean=false;
  defaultHomePhoto: string = environment.defaultHomePhoto;
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private router: Router,
    public toastService: AppToastService,
    public commonOpsService: CommonOpsService,
    private location: LocationStrategy,
    private accountService: AccountService) {
    this.renderer.listen('window', 'click', (event: Event) => {
    // history.pushState(null, null, window.location.href);  
    // this.location.onPopState(() => {
    // this.modalService.dismissAll();
    // history.pushState(null, null, window.location.href);
    // }); 
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
  ngOnInit(): void {
    this.dataTableParams.searchCode = ' ';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'FirstName';
    this.dataTableParams.sortOrder = '2';
    this.dataTableParams.filterArray='';
    this.dataTableParams.isload = 1;

    this.getClientList();
    // this.calcTotalPages();
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
  }
  onChangeSortOrder(event) {
    this.dataTableParams.isload = 0;
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
  onChangeOption(target, client) {
    var value = target.value;
    if(value==1){
      this.openCancelHomeOwnerAccountModal(client.userId, this.cancelAccountAlertModel);
    }
    if(value==2){
      this.openEditClientModal(client.homeOwnerAddressId, this.editClientModalContent);
    }
    if(value==3){
      this.openEditHomeDetail(client.homeOwnerAddressId);
    }
    target.value='0';
  }
  getClientList() {
    
    this.dataTableParams.userId = this.userId;
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "RealEstateAgent", "GetRealEstateAgentClients").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRealEstateAgentClientViewModel[]>) => {
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
  }
  searchByKeyword(keyword: string) {
    this.dataTableParams.searchCode = keyword.trim();
    this.dataTableParams.pageNo=1;
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
    this.homePhoto=null;
    this.submitted=false;
   // this.invalidhomePhotoSize=true;
    this.inputForm.reset();
    this.isDuplicateEmail=false;
    this.inputForm.patchValue({
      homeOwnerAddressId: homeOwnerAddressId,
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
    this.loadHomeOwnerProfile(homeOwnerAddressId);
    return this.modalService.open(content, { size: 'lg' });
  }
  openViewHomeDetailModal(homeOwnerAddressId:number, content): NgbModalRef {
    this.homePhoto=null;
    this.homeOwnerAddressId = homeOwnerAddressId;
    this.selectedClient=this.clientList.filter(x=>x.homeOwnerAddressId== String(homeOwnerAddressId))[0];
    this.loadHomeOwnerProfile(homeOwnerAddressId)
    return this.modalService.open(content, { size: 'lg' });
  }
  loadHomeOwnerProfile(homeOwnerAddressId: number) {
    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressOwnerProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel);
        this.copyEmail=data.formModel.email;
        // if (data.formModel.userImageBase64 != null) {
        //   this.profilePhoto = data.formModel.userImageBase64;
        // }
        if (data.formModel.homeProfileImageBase64 != null) {
          this.homePhoto = data.formModel.homeProfileImageBase64;
        }
        else{
          this.homePhoto = null;
        }
      });
  }
  checkValidCityName(){
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
  }

  onSubmit() {
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "UpdateHomeAddressProfile").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Homeowner details saved successfully", 3000,"bg-success text-white","fa-check-circle");
        this.modalService.dismissAll();
        this.getClientList();
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
     if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
      this.homePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
      // if(this.homePhoto.length < 1400000){
      //   this.invalidhomePhotoSize=true;
      // }else{
      //   this.invalidhomePhotoSize=false;
      // }
    }
  }
  onRemoveImage() {
   // this.invalidhomePhotoSize=true;
    this.homePhoto = null;
    this.inputForm.controls.homeProfileImageBase64.patchValue(this.homePhoto);
  }
  onCancelCropImageModal() {
    this.cropModalReference.close('Close click')
  }
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg' });
  }
  openCancelHomeOwnerAccountModal(homeOwneruserId: number, content) {
    this.homeOwneruserId=homeOwneruserId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true}).result.then((result) => {
    }, (reason) => {
    });
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
  sortByColName(colName: string){
    this.dataTableParams.isload = 0;
    if(colName == this.dataTableParams.sortColumn){
      this.dataTableParams.sortOrder = (this.dataTableParams.sortOrder == '1' ? '2' : '1');
    }
    else{
      this.dataTableParams.sortOrder = '1';
    }
    this.dataTableParams.sortColumn = colName;
    this.getClientList();
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
    if(this.isDuplicateEmail && (this.inputForm.controls.email.value == this.copyEmail) ){
      this.isDuplicateEmail=false;
    }
  }
}
