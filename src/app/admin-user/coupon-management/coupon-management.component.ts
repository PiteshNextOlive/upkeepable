import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import { ICoupon, ICouponExport } from 'src/app/article/recommendation/article-type-module';
import { GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';

@Component({
  selector: 'app-coupon-management',
  templateUrl: './coupon-management.component.html',
  styleUrls: ['./coupon-management.component.css'],
  providers: [DatePipe]
})
export class CouponManagementComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  couponList: ICoupon[] = [];
  couponLi: ICouponExport[] = [];
  title = 'export-excel';
  title1 = 'export-exce';
    fileName = 'ExportExce.xlsx';
    fileName1 = 'ExportExcel.xlsx';
    exportexcel(): void {
        /* pass here the table id */
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.couponList);
        /* generate workbook and add the worksheet */
        const wb: XLSX.WorkBook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        /* save to file */
        XLSX.writeFile(wb, this.fileName);
    }
    exportDataasCSV(): void {
      /* pass here the table id */
      const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.couponLi);
      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet2');
      /* save to file */
      XLSX.writeFile(wb, this.fileName1);
  }
  dataTableParams: IDataTableParamsViewModel = {
    searchCode: '',
    pageNo: 0,
    pageSize: 0,
    sortColumn: '',
    searchColumn: '',
    sortColumn1: '',
    sortOrder: '1',
    userId:0,
    filterArray:'',
    boolFlag1:0,
    month:0,
    year:0,
    tabValue:0
  };
  totalRecords: number = 0;
  totalPages: number = 0;
  searchColumn: string = 'CouponCode';
  fakeArray = new Array(0);
  public unlimitedUse=false;
  selectedCouponId: number=0;
  isValidNumber: boolean = true;
  searchText: string ='';
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, public toastService: AppToastService,
    private modalService: NgbModal,
    public datepipe: DatePipe,
    private fb: UntypedFormBuilder,
    public commonOpsService:CommonOpsService) { }
    submitted = false;
    inputForm: TForm<ICoupon> = this.fb.group({
      couponId: [0, Validators.required],
      descriptionText: ['', [Validators.required, Validators.maxLength(500)]],
      couponUse: ['', [Validators.required, Validators.pattern('[0-9]{1,9}')]],
      couponValue: ['', Validators.required],
      couponStatus: [''],
      couponPeriod: ['', Validators.required],
      couponExpires: new Date(),
      createdOn: new Date(),
      couponCode: ['', Validators.required],
    }) as TForm<ICoupon>;
  
    get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    this.dataTableParams.searchCode = ' ';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'CouponCode';
    this.dataTableParams.sortOrder = '1';
    this.dataTableParams.searchColumn='CouponCode';
    this.dataTableParams.filterArray='';
    this.getCouponList();
  }
  
  getCouponList() {
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "Article", "GetAllCoupons").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<ICoupon[]>) => {
        this.couponList = data.responseDataModel;
        this.couponList.forEach(list => {
          list.startDate = this.datepipe.transform(list.createdOn, 'MMM d, y @ h:mm a');
          list.couponExpires = this.datepipe.transform(new Date(list.startDate).setFullYear(new Date(list.startDate).getFullYear() + Number(list.couponPeriod)), 'M/d/yyyy');
        });
        if (this.couponList.length > 0) {
          this.totalRecords = this.couponList[0].maxRows;
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
  onChangeSortOrder(event) {
    this.dataTableParams.sortOrder = event.target.value;
    this.getCouponList();
  }
  onChangeSearchOrder(target) {
    var value = target.value;
    if(value=="1"){
      this.dataTableParams.searchColumn = 'CouponCode';
    }
    if(value=="2"){
      this.dataTableParams.searchColumn = 'CouponValue';
    }
    if(value=="3"){
      this.dataTableParams.searchColumn = 'CouponPeriod';
    }
    if(value=="4"){
      this.dataTableParams.searchColumn = 'CouponExpires';
    }
    this.searchColumn=this.dataTableParams.searchColumn;
    this.getCouponList();
  }
  onChangePageSize(event) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = event.target.value;
    this.getCouponList();
  }
  loadPage(event){
    this.dataTableParams.pageNo = event;
    this.getCouponList();
  }
  onClickSearchBar(){
    this.searchByKeyword((<HTMLInputElement>document.getElementById('searchKeyword')).value);
  }
  searchByKeyword(keyword: string) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.searchCode = keyword.trim();
    if(keyword.includes("'")){
      this.dataTableParams.searchCode=keyword.replace(/'/g,"''");
    }
    this.getCouponList();
  }

  sortByColName(colName: string){
    if(colName == this.dataTableParams.sortColumn){
      this.dataTableParams.sortOrder = (this.dataTableParams.sortOrder == '1' ? '2' : '1');
    }
    else{
      this.dataTableParams.sortOrder = '1';
    }
    this.dataTableParams.sortColumn = colName;
    this.dataTableParams.searchColumn = this.searchColumn;
    this.getCouponList();
  }

  openAddCouponModal(couponId:number, content): NgbModalRef {
    this.selectedCouponId = couponId;
    this.submitted=false;
    this.inputForm.reset();
    this.inputForm.patchValue({
      couponId: couponId,
      couponCode: '',
      couponPeriod: '',
      couponUse: 1,
      couponValue: 'NA',
      descriptionText: '',
      createdOn :new Date(),
    });

      if(this.selectedCouponId>0){
        this.getCouponById();
      }
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  closeModal(){
    this.modalService.dismissAll();
  }
  saveCoupon(){
    if(!this.unlimitedUse){
      if(parseInt(this.inputForm.controls.couponUse.value.toString()) === 0 || parseInt(this.inputForm.controls.couponUse.value.toString()) < 0){
        this.isValidNumber = false;
      }
      else{
        this.isValidNumber = true;
      }
    }else{
      this.inputForm.controls.couponUse.patchValue(0);
      this.isValidNumber = true;
    }
    this.submitted = true;
    if(this.inputForm.controls.couponStatus.value==null || this.inputForm.controls.couponStatus.value==undefined){
      this.inputForm.controls.couponStatus.patchValue(true);
    }
    if (this.inputForm.valid && this.isValidNumber) {
        this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "Article", "AddUpdateCoupon").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.modalService.dismissAll();
          this.getCouponList();
          this.toastService.show("","Coupon submitted successfully", 3000,"bg-success text-white","fa-check-circle");  
        });
    }
  }

  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }

  
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  isValidMaxNum()
  {
    if(this.inputForm.controls.couponUse?.value != null){
      if(parseInt(this.inputForm.controls.couponUse?.value?.toString()) === 0 || parseInt(this.inputForm.controls.couponUse?.value?.toString()) < 0){
        this.isValidNumber = false;
        this.inputForm.controls.couponUse?.patchValue(Number(this.inputForm.controls.couponUse?.value?.toString().slice(0,1)));
      }
      else{
       this.isValidNumber = true;
      }
    }
    else{
      this.inputForm.controls.couponUse?.patchValue(Number(this.inputForm.controls.couponUse?.value?.toString().slice(0,1)));
    }
    if(this.inputForm.controls.couponUse?.value < 0){
      this.inputForm.controls.couponUse?.patchValue(Number(this.inputForm.controls.couponUse?.value?.toString().slice(0,1)));
    }
  }

  toggleChanged(val: any) {
  //  if(this.inputForm.controls.couponStatus.value==true){
      this.appHttpRequestHandlerService.httpPost({id: val.id, couponStausType:val.checked } , "Article", "SetCouponStatusById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        this.modalService.dismissAll();
        this.getCouponList();
      });
   // }
    //else{
     // this.inputForm.controls.pausedMessage.patchValue(' ');
    //}
  }

  onSetMaxViewUnlimitedChange(event){
    this.inputForm.controls.couponUse.patchValue('');
    this.unlimitedUse = event.target.checked;
    if(event.target.checked){
      this.isValidNumber = true;
      this.inputForm.controls.couponUse.patchValue(0);
    }
  }
  openDeleteCouponModal(content, selectedCouponId) {
    this.selectedCouponId = selectedCouponId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  openDetailCouponModal(content, selectedCouponId) {
    this.modalService.dismissAll();
    this.selectedCouponId = selectedCouponId;
    if(this.selectedCouponId>0){
      this.getCouponById();
    }
    this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  deleteCoupon(){
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpGet({ id: this.selectedCouponId }, "Article", "DeleteCoupon")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:any) => {
        //this.getCouponList();
        this.toastService.show("","Coupon deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
        if(this.couponList.length==1 && this.dataTableParams.pageNo>1){
          this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
        }
        this.getCouponList();
      });
  }
  getCouponById(){
    this.appHttpRequestHandlerService.httpGet({ id: this.selectedCouponId }, "Article", "GetCouponById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:GenericResponseTemplateModel<ICoupon>) => {
        this.inputForm.patchValue(data.responseDataModel);
       this.couponLi = [{couponCode: data.responseDataModel.couponCode,
        couponStatus: data.responseDataModel.couponStatus,
                          couponValue: data.responseDataModel.couponValue,
                          couponPeriod: data.responseDataModel.couponPeriod,
                          couponUse: data.responseDataModel.couponUse,
                          descriptionText: data.responseDataModel.descriptionText}];
     
          if(this.inputForm.controls.couponUse.value==0){
            this.unlimitedUse=true;
          }
      });
  }
  
  openEditCouponModal(CouponId:number, content){
    this.modalService.dismissAll();
    this.openAddCouponModal(CouponId, content);
  }
  searchPressed(event){
    if(event.keyCode==13){
      this.onClickSearchBar()
    }
  }
  searchKeyUpInput(){
    this.searchText =(<HTMLInputElement>document.getElementById('searchKeyword')).value;
    this.onClickSearchBar();
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
  
}
