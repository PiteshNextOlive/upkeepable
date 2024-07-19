import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../../toast/app-toast.service';
import { IRealEstateAgentMessage, IRealEstateAgentWelcomeMessage, IMessageMonthWiseFilter } from '../../real-estate-agent-type-module';
import { Subscription } from 'rxjs';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
@Component({
  selector: 'app-messages-step',
  templateUrl: './messages-step.component.html',
  styleUrls: ['./messages-step.component.css']
})
export class MessagesStepComponent implements OnInit {
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
    year:0,
    tabValue:0
  };
  totalRecords: number = 0;
  totalPages: number = 0;
  fakeArray = new Array(0);
  MessageList: IRealEstateAgentMessage[] = [];
  message: IRealEstateAgentMessage;
  msg :'';
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private cancelAccountAlertModel: NgbModalRef;

  isMessageInEditMode=false;
  private cropModalReference: NgbModalRef;
  public isMonthYearSelected=true; 
  tabCode: number=1;
  monthStartJson:any= { year: new Date().getFullYear(), month: new Date().getMonth()+1 };
  searchText: string ='';
  myMethodSubs: Subscription;
  constructor(private router: Router, 
    public authService: AuthService, 
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private modalService: NgbModal,
    public toastService: AppToastService,
    private fb: UntypedFormBuilder,
    public commonOpsService: CommonOpsService,
    private sharingdata: SharingDataService) { }
  
  

  inputFormWelcomeMessage: TForm<IRealEstateAgentWelcomeMessage> = this.fb.group({
    realEstateAgentWelcomeMessageId: [0, Validators.required],
    messageText: ['', Validators.required],
    userRefId: ['', Validators.required],
  }) as TForm<IRealEstateAgentWelcomeMessage>


  inputForm: TForm<IMessageMonthWiseFilter> = this.fb.group({
    monthStartJson: [{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }, Validators.required],
    // endDate:[new Date()],
    // startDate:[new Date()],
  }) as TForm<IMessageMonthWiseFilter>;




  selectedRealEstateAgentMessageIds:string[]=[];
  selRealEstateAgentMessageId:number;
  ngOnInit(): void {
    this.dataTableParams.searchCode = ' ';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'Subject';
    this.dataTableParams.sortOrder = 'ASC';
    this.dataTableParams.filterArray='';
    this.dataTableParams.boolFlag1=0;

    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.userId = Number(this.userJwtDecodedInfo.UserId);
    this.getMessageList_Drafted();

    this.myMethodSubs = this.sharingdata.invokeMyMethod.subscribe(res => {
     // alert("i am trigred");
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
      //return monthNamesWithCodes.filter(x=>x.monthCode == monthCode)[0].monthAbbr;
  }
  getMessageList_Drafted() {
    this.dataTableParams.userId = this.userId;
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "RealEstateAgent", "GetRealEstateAgentMessages_Drafted").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRealEstateAgentMessage[]>) => {
        this.MessageList = data.responseDataModel;
        if (this.MessageList.length > 0) {
          this.totalRecords = this.MessageList[0].maxRows;
          this.calcTotalPages();
        }
        else {
          this.totalRecords = 0;
        }
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
      this.getMessageList_Drafted();
    });
  }

  closeAllModals(){
    this.selectedRealEstateAgentMessageIds=[];
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
    this.selectedRealEstateAgentMessageIds = this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.selectedRealEstateAgentMessageIds);
  }
  openModal(realEstateAgentMessageId:number, content) : NgbModalRef{
   // console.log(realEstateAgentMessageId)
    this.selRealEstateAgentMessageId = realEstateAgentMessageId;
    return this.modalService.open(content, { size: 'lg' });
  }
  
  onClickCloseModal() {
    this.modalService.dismissAll();
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
  onWelcomeMessageFormSubmit() {
    if (this.inputFormWelcomeMessage.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormWelcomeMessage.value, "RealEstateAgent", "UpdateRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.modalService.dismissAll();
        });
    }
  }
  setTabCode(tabCode: number){
    if(this.tabCode != tabCode){
      this.tabCode = tabCode;

      this.dataTableParams.searchCode = ' ';
      this.dataTableParams.pageNo = 1;
      this.dataTableParams.pageSize = 10;
      this.dataTableParams.sortColumn = 'Subject';
      this.dataTableParams.sortOrder = 'ASC';
      this.dataTableParams.filterArray='';
      this.dataTableParams.boolFlag1=(this.tabCode-1);

      (<HTMLInputElement>document.getElementById('searchKeyword')).value='';
      (<HTMLSelectElement>document.getElementById('sortDropDown')).value='1';
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
}