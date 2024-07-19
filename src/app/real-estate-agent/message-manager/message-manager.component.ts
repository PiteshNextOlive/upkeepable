import { Component, OnInit, TemplateRef, ViewChild,CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';
import { LocationStrategy } from '@angular/common';
import { IMessageMonthWiseFilter, IRealEstateAgentMessage, IRealEstateAgentMessageViewModel, IRealEstateAgentWelcomeMessage } from '../real-estate-agent-type-module';
import { Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
@Component({
  selector: 'app-message-manager',
  templateUrl: './message-manager.component.html',
  styleUrls: ['./message-manager.component.css']
})
export class MessageManagerComponent implements OnInit {
  userId: number;
  userJwtDecodedInfo: UserJwtDecodedInfo;
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
    year: 0,
    tabValue:0
  };
  totalRecords: number = 0;
  totalPages: number = 0;
  isFilter=false;
  submitted = false;
  fakeArray = new Array(0);
  MessageList: IRealEstateAgentMessage[] = [];
  message: IRealEstateAgentMessage;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private cancelAccountAlertModel: NgbModalRef;

  // public monthNamesWithCodes: any[] = [
  //   { monthCode: 1, monthAbbr: 'Jan.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 2, monthAbbr: 'Feb.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 3, monthAbbr: 'Mar.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 4, monthAbbr: 'Apr.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 5, monthAbbr: 'May.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 6, monthAbbr: 'Jun.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 7, monthAbbr: 'Jul.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 8, monthAbbr: 'Aug.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 9, monthAbbr: 'Sep.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 10, monthAbbr: 'Oct.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 11, monthAbbr: 'Nov.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
  //   { monthCode: 12, monthAbbr: 'Dec.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false }];
  // public currentYear: number = new Date().getFullYear();
  // public yearsWithInfo: any[] = [
  //   { year: this.currentYear, isSelcted: true, isDisabled: false },
  //   { year: this.currentYear + 1, isSelcted: false, isDisabled: false }];
  // public selectedMonth: number = 0;
  // public selectedYear: number = this.currentYear;
  // submitted = false;
  // optionalLinks: string[] = [];
  // @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  // fileUploadEventObject: any;
  // targetImageElementId: string = '';
  // aspectRatio: string = '1/1';
  // messageHomePhoto: string = '';
  isMessageInEditMode=false;
  private cropModalReference: NgbModalRef;
  public isMonthYearSelected=true; 
  tabCode: number=1;
  deleteSingle:boolean=false;
  invalidSize:boolean=true;
  monthStartJson:any= { year: new Date().getFullYear(), month: new Date().getMonth()+1 };
  searchText: string ='';
  myMethodSubs: Subscription;
  constructor(private router: Router, 
    public authService: AuthService, 
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private modalService: NgbModal,
    private location: LocationStrategy,
    private fb: UntypedFormBuilder,
    public toastService: AppToastService,
    public commonOpsService: CommonOpsService,
    private sharingdata: SharingDataService) { 
      history.pushState(null, null, window.location.href);  
    this.location.onPopState(() => {
    this.modalService.dismissAll();
    history.pushState(null, null, window.location.href);
    }); 
    }
  
  

  inputFormWelcomeMessage: TForm<IRealEstateAgentWelcomeMessage> = this.fb.group({
    realEstateAgentWelcomeMessageId: [0, Validators.required],
    messageText: ['', [Validators.required, Validators.maxLength(500)]],
    userRefId: ['', [Validators.required]],
  }) as TForm<IRealEstateAgentWelcomeMessage>


  inputForm: TForm<IMessageMonthWiseFilter> = this.fb.group({
    monthStartJson: [{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }, Validators.required],
    // endDate:[new Date()],
    // startDate:[new Date()],
  }) as TForm<IMessageMonthWiseFilter>;


  get inputFormWelcomeMessageControls() { return this.inputFormWelcomeMessage.controls; }

  selectedRealEstateAgentMessageIds:string[]=[];
  selRealEstateAgentMessageId:number;
  ngOnInit(): void {
    this.dataTableParams.searchCode = '';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'Subject';
    this.dataTableParams.sortColumn1 = 'MessageText';
    this.dataTableParams.sortOrder = '1';
    this.dataTableParams.filterArray='';
    this.dataTableParams.boolFlag1=0;
    this.dataTableParams.tabValue = 1;

    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.userId = Number(this.userJwtDecodedInfo.UserId);
    this.getMessageList_Drafted();
    this.myMethodSubs = this.sharingdata.invokeMyMethod.subscribe(res => {
       this.getMessageList_Drafted();
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
  }
  getMessageList_Drafted() {
    this.dataTableParams.tabValue = this.tabCode;
    this.dataTableParams.userId = this.userId;
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "RealEstateAgent", "GetRealEstateAgentMessages_Drafted").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRealEstateAgentMessage[]>) => {
        this.MessageList = data.responseDataModel;
        if(this.MessageList.length==0 && this.dataTableParams.pageNo>1){
          this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
          this.getMessageList_Drafted();
        }
      // console.log("MsgList", data.responseDataModel);
        //const currentDate = new Date();
   // var currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1
   // var currentYear = currentDate.getFullYear();
    //var msgLst = [];
   
   // for(var i = 0; i < data.responseDataModel.length; i++){
     // if(this.tabCode == 1){
      // if(data.responseDataModel[i].month > currentMonth && data.responseDataModel[i].year == currentYear){
      //   msgLst.push(data.responseDataModel[i]);
      // } else 
      //if(data.responseDataModel[i].year > currentYear){
       // msgLst.push(data.responseDataModel[i]);
      //}
     // this.totalRecords = msgLst.length;
   // } else {
      // if(data.responseDataModel[i].month <= currentMonth && data.responseDataModel[i].year == currentYear){
      //   msgLst.push(data.responseDataModel[i]);
      // } else 
     // if(data.responseDataModel[i].year <= currentYear){
    //    msgLst.push(data.responseDataModel[i]);
    //  }
    //  if(msgLst.length){
    //  this.totalRecords = msgLst[0].maxRows;
    //  }
   // }
   // }
    // this.MessageList = msgLst;
    // console.log("msg list", msgLst);
    // if(this.MessageList.length == 0){
    //   this.totalRecords = 0;
    // }
        if (this.MessageList.length > 0) {
           this.totalRecords = this.MessageList[0].maxRows;
        }
        else {
          this.totalRecords = 0;
        }
        this.calcTotalPages();
      });
  }
  calcTotalPages() {
    this.totalPages = Math.ceil(this.totalRecords / this.dataTableParams.pageSize);
    this.fakeArray = Array(this.totalPages);
  }
  onClickDashboard(){
    this.router.navigate(['/RealEstateAgent/Dashboard']);
  }

  openPreviewMessageModal(realEstateAgentMessageId, content) : NgbModalRef{
    this.selRealEstateAgentMessageId = realEstateAgentMessageId;
    this.getRealEstateMessage(realEstateAgentMessageId);
    return this.modalService.open(content, { size: 'lg' });
  }
  getRealEstateMessage(realEstateAgentMessageId) {
    // this.yearsWithInfo = this.yearsWithInfo.map(i => {
    //   return {
    //     year: i.year,
    //     isSelcted:false,
    //     isDisabled: false
    //   }});

    //   this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
    //     return {
    //       monthCode: i.monthCode,
    //       monthAbbr: i.monthAbbr,
    //       isSelcted: false,
    //       isDisabled: false,
    //       isAlreadyDrafted: false
    //     }
    //   });
    this.appHttpRequestHandlerService.httpGet({ id: realEstateAgentMessageId }, "RealEstateAgent", "GetRealEstateAgentDraftedMessagesById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessage>) => {
        this.message = data.formModel;
        // this.inputFormMessage.reset();
        // this.inputFormMessage.patchValue(data.formModel);
        // this.inputFormMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
        // if (data.formModel == null) {
        //   //this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(0);
        // }
        // this.optionalLinks = this.inputFormMessage.controls.realEstateAgentMessageLinks.value.map(i => {
        //   return i.linkUrl
        // });

        // this.yearsWithInfo = this.yearsWithInfo.map(i => {
        //   return {
        //     year: i.year,
        //     isSelcted: (i.year==this.inputFormMessage.controls.year.value),
        //     isDisabled: !(i.year==this.inputFormMessage.controls.year.value)
        //   }});

        //   this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
        //     return {
        //       monthCode: i.monthCode,
        //       monthAbbr: i.monthAbbr,
        //       isSelcted: (i.monthCode==this.inputFormMessage.controls.month.value),
        //       isDisabled: !(i.monthCode==this.inputFormMessage.controls.month.value),
        //       isAlreadyDrafted: false
        //     }
        //   });

        // this.inputFormMessage.controls.realEstateAgentMessageLinks.patchValue(this.inputFormMessage.controls.optionalLinks.value);
    });
  }

  deleteSingleMessage(){
    this.selectedRealEstateAgentMessageIds=[];
    this.selectedRealEstateAgentMessageIds.push(String(this.selRealEstateAgentMessageId));
    this.deleteMessages();
  }
  deleteMultipleMessages(realEstateAgentMessageId: number, content){
    this.deleteSingle=false;
    this.deleteSingleMessageById(realEstateAgentMessageId,content);
  }
  deleteSingleMsg(realEstateAgentMessageId: number, content){
    this.deleteSingle=true;
    this.deleteSingleMessageById(realEstateAgentMessageId,content);
  }
  deleteSingleMessageById(realEstateAgentMessageId: number, content){
    this.cancelAccountAlertModel = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }); 
    this.selRealEstateAgentMessageId =realEstateAgentMessageId;
  }
  deleteMessages(){
    this.appHttpRequestHandlerService.httpPost({ realEstateAgentMessageIds: JSON.stringify(this.selectedRealEstateAgentMessageIds)}, "RealEstateAgent", "DeleteMessagesByIds").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
      this.selectedRealEstateAgentMessageIds=[];
      this.closeAllModals();
      if(this.MessageList.length==1 && this.dataTableParams.pageNo>1){
        this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
      }
      this.getMessageList_Drafted();
    });
    //window.location.reload();
  }

  closeAllModals(){
    this.modalService.dismissAll();
  }
  open(content) {
    this.cancelAccountAlertModel = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }); 
  }

  onConfirmationModal_No(){
    this.cancelAccountAlertModel.close()
  }
  onConfirmationModal_Yes(){
    this.cancelAccountAlertModel.close();
    if(this.selRealEstateAgentMessageId==-1){
      this.deleteMessages();
    }
    else{
      this.deleteSingleMessage();
    }
  }

  onChangeSelectMessageCheckBox(event: any) {
    //debugger;
    this.selectedRealEstateAgentMessageIds = this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.selectedRealEstateAgentMessageIds);
    //debugger;
  }
  openModal(realEstateAgentMessageId:number, content) : NgbModalRef{
    //console.log(realEstateAgentMessageId)
    this.selRealEstateAgentMessageId = realEstateAgentMessageId;
    return this.modalService.open(content, { size: 'lg' });
  }
  
  onClickCloseModal() {
    this.modalService.dismissAll()
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
      this.submitted=false;
    return this.modalService.open(content, { size: 'lg' });
  }
  onWelcomeMessageFormSubmit() {
    // if(this.inputFormWelcomeMessage.value.messageText.trim().length == 0){
    //   this.toastService.show("","Please enter valid message", 3000,"bg-danger text-white","fa-exclamation-triangle"); 
    //    return;
    // }
    if (this.inputFormWelcomeMessage.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormWelcomeMessage.value, "RealEstateAgent", "UpdateRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Welcome message updated successfully", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
        });
    }
    this.submitted=true;
  }
  setTabCode(tabCode: number){
    if(this.tabCode != tabCode){
      this.tabCode = tabCode;
      this.isFilter=false;
      this.dataTableParams.pageNo=1;
      this.dataTableParams.year=0;
      this.dataTableParams.month=0;

      //this.inputForm.controls.monthStartJson.patchValue([{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }]);

      this.dataTableParams.searchCode = ' ';
      this.dataTableParams.pageNo = 1;
      this.dataTableParams.pageSize = 10;
      this.dataTableParams.sortColumn = 'Subject';
      this.dataTableParams.sortOrder = 'ASC';
      this.dataTableParams.filterArray='';
      //this.dataTableParams.boolFlag1=(this.tabCode-1);
      this.searchText='';

      (<HTMLInputElement>document.getElementById('searchKeyword')).value='';
      //(<HTMLSelectElement>document.getElementById('sortDropDown')).value='1';
      (<HTMLSelectElement>document.getElementById('pageSizeDropDown')).value='10';
      
      this.getMessageList_Drafted();
    }
  }
  onChangeSortOrder(event) {
    this.dataTableParams.sortOrder = event.target.value;
    this.getMessageList_Drafted();
  }
  onChangePageSize(event) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = event.target.value;
    this.getMessageList_Drafted();
  }
  loadPage(event){
    this.dataTableParams.pageNo = event;
    this.getMessageList_Drafted();
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
    this.getMessageList_Drafted();
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
  onRefreshMessageListEvent(){
    this.getMessageList_Drafted();
  }
  openEditModalFromPreviewMessage(content){
    this.modalService.dismissAll();
    this.openModal(this.selRealEstateAgentMessageId, content);
  }

  filterData(){
    this.selectedRealEstateAgentMessageIds=[];
    this.dataTableParams.pageNo=1;
    this.dataTableParams.year=this.inputForm.controls.monthStartJson.value.year;
    this.dataTableParams.month=this.inputForm.controls.monthStartJson.value.month;
    this.dataTableParams.searchCode='';
    this.isFilter=true;
    this.getMessageList_Drafted();
    //console.log(this.inputForm.controls.monthStartJson.value.year)
    //this.getInvoices(this.inputForm.controls.monthYear.value.month,this.inputForm.controls.monthYear.value.year);
  }
  clearFiletr(){
    this.selectedRealEstateAgentMessageIds=[];
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.year=0;
    this.dataTableParams.month=0;
    this.isFilter=false;
    this.getMessageList_Drafted();
  }
}

