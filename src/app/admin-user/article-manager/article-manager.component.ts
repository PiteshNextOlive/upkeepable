import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IArticle } from 'src/app/article/recommendation/article-type-module';
import { GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';

@Component({
  selector: 'app-article-manager',
  templateUrl: './article-manager.component.html',
  styleUrls: ['./article-manager.component.css']
})
export class ArticleManagerComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  articleList: IArticle[] = [];
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
  fakeArray = new Array(0);
  invalidSize:boolean=true;
  //currSortColName:string = '';
  stepCode: number = 1;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  //defaultArticleImage: string = environment.defaultHomePhoto;
  articleImage: string = '';
  private cropModalReference: NgbModalRef;
  articleLinks: string[] = [];
  public unlimitedViews=false;
  selectedArticleId: number=0;
  isValidURL: boolean = true;
  isValidNumber: boolean = true;
  months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  homeVariables: any[] =[
    {"value":"1", "Text":"Home General Variables"},
    {"value":"2", "Text":"Home Heating Variables"},
    {"value":"3", "Text":"Home Cooling Variables"},
    {"value":"4", "Text":"Home Water Treatment Variables"},
    {"value":"5", "Text":"Home Outside Variables"},
    {"value":"6", "Text":"Home Appliances Variables"},
  ];
  searchText: string ='';
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, public toastService: AppToastService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    public commonOpsService:CommonOpsService) { }
    submitted = false;
    inputForm: TForm<IArticle> = this.fb.group({
      articleId: [0, Validators.required],
      articleTitle: ['', [Validators.required, Validators.maxLength(100),Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
      shortDescriptionText: ['', [Validators.required, Validators.maxLength(500)]],
      descriptionText: ['', [Validators.required, Validators.maxLength(500)]],
      imageFile: ['', Validators.required],
      imageFileBase64:['', Validators.required],
      articleStausType: [1, Validators.required],
      monthsCodes: ['NA'],
      articleLinks: [[]],
      optionalLinks: [[]],
      optionalLinkText: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
      maxViewEachMonth: ['', [Validators.required, Validators.pattern('[0-9]{1,9}')]],
      homeOwnerAddressDetailType: ['', Validators.required],
      monthStartJson: [{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }, Validators.required],
      monthEndJson: [{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }, Validators.required],
      monthStart: ['NA', Validators.required],
      monthEnd: ['NA', Validators.required],
      endDate:[new Date()],
      startDate:[new Date()],
      createdOn:[new Date()],
      
      // monthStart_isValid: [1, [Validators.required, Validators.min(1)]],
      // monthEnd_isValid: [1, [Validators.required, Validators.min(1)]],
    }) as TForm<IArticle>;
  
    get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    this.dataTableParams.searchCode = ' ';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'ArticleTitle';
    this.dataTableParams.sortOrder = '1';
    this.dataTableParams.filterArray='';
    //this.currSortColName = this.dataTableParams.sortColumn;
    this.getArticleList();
  }
  
  getArticleList() {
    //this.dataTableParams.userId = this.userId;
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "Article", "GetAllArticles").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IArticle[]>) => {
        this.articleList = data.responseDataModel;
        if (this.articleList.length > 0) {
          this.totalRecords = this.articleList[0].maxRows;
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
    this.getArticleList();
  }
  onChangePageSize(event) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = event.target.value;
    this.getArticleList();
  }
  loadPage(event){
    this.dataTableParams.pageNo = event;
    this.getArticleList();
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
    this.getArticleList();
  }

  sortByColName(colName: string){
    if(colName == this.dataTableParams.sortColumn){
      this.dataTableParams.sortOrder = (this.dataTableParams.sortOrder == '1' ? '2' : '1');
    }
    else{
      this.dataTableParams.sortOrder = '1';
    }
    this.dataTableParams.sortColumn = colName;
    this.getArticleList();
  }

  openAddArticleModal(articleId:number, content): NgbModalRef {
    this.selectedArticleId = articleId;
    this.stepCode = 1;
    this.submitted=false;
    this.inputForm.reset();
    this.inputForm.patchValue({
      articleId: articleId,
      articleTitle: '',
      shortDescriptionText: '',
      descriptionText: '',
      imageFile: '',
      imageFileBase64: '',
      articleStausType: 1,
      monthsCodes: 'NA',
      articleLinks: [],
      optionalLinks: [],
      optionalLinkText: '',
      maxViewEachMonth: '',
      homeOwnerAddressDetailType: '',
      monthStartJson: { year: new Date().getFullYear(), month: new Date().getMonth()+1 },
      monthEndJson: { year: new Date().getFullYear(), month: new Date().getMonth()+1 },
      monthStart: 'NA',
      monthEnd: 'NA',
      endDate:new Date(),
      startDate:new Date(),
      createdOn :new Date(),

      // monthStart_isValid: 1,
      // monthEnd_isValid: 1
    });
      this.unlimitedViews=false;
      this.onRemoveImage();

      if(this.selectedArticleId>0){
        this.getArticleById();
      }
      this.articleLinks = [];
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  setArticleModalStep(stepCode: number){
    this.submitted=true;
    if(stepCode==2){
      if(this.formControls.articleTitle.valid && this.formControls.shortDescriptionText.valid && this.formControls.descriptionText.valid  && this.formControls.imageFileBase64.valid){
        this.stepCode = stepCode;
        this.submitted=false;
      }
    }
    else {
      this.stepCode = stepCode;
      this.submitted=false;
    }
  }
  closeModal(){
    this.modalService.dismissAll();
  }
  saveArticle(){
    if(!this.unlimitedViews){
      if(parseInt(this.inputForm.controls.maxViewEachMonth.value.toString()) === 0 || parseInt(this.inputForm.controls.maxViewEachMonth.value.toString()) < 0){
        this.isValidNumber = false;
      }
      else{
        this.isValidNumber = true;
      }
    }else{
      this.inputForm.controls.maxViewEachMonth.patchValue(0);
      this.isValidNumber = true;
    }
    this.submitted = true;
    this.inputForm.controls.monthEnd.patchValue('NA');
    let currDate = new Date();
    let startDate= new Date(parseInt(this.inputForm.controls.monthStartJson.value.year), parseInt(this.inputForm.controls.monthStartJson.value.month));
    let endDate= new Date(parseInt(this.inputForm.controls.monthEndJson.value.year), parseInt(this.inputForm.controls.monthEndJson.value.month));
    if (this.inputForm.valid && this.isValidNumber) {
      if((parseInt(this.inputForm.controls.monthEndJson.value.year) <= parseInt(this.inputForm.controls.monthStartJson.value.year)) &&
        (parseInt(this.inputForm.controls.monthEndJson.value.month) < parseInt(this.inputForm.controls.monthStartJson.value.month))){
          this.inputForm.controls.monthEnd.patchValue('');
          this.inputForm.controls.monthEnd.setErrors(Validators.required);
        }
        else if(this.inputForm.controls.articleId.value==0 && (startDate<currDate || endDate<currDate)){
          this.inputForm.controls.monthEnd.patchValue('');
          this.inputForm.controls.monthEnd.setErrors(Validators.required);          
        }
      else{
        this.inputForm.controls.monthEnd.patchValue(
          this.inputForm.controls.monthEndJson.value.month
            +'-'+
          this.inputForm.controls.monthEndJson.value.year
        );

        this.inputForm.controls.monthStart.patchValue(
          this.inputForm.controls.monthStartJson.value.month
            +'-'+
          this.inputForm.controls.monthStartJson.value.year
        );
        if(this.inputForm.controls.optionalLinkText.value && this.inputForm.controls.optionalLinkText.value.trim().length>0){
          if(this.articleLinks == null || this.articleLinks == undefined){
            this.articleLinks = [];
          }
          this.articleLinks.push(this.inputForm.controls.optionalLinkText.value.trim());
          this.inputForm.controls.optionalLinks.patchValue(this.articleLinks);
        }  
        if(this.inputForm?.controls?.articleLinks){
          this.inputForm.controls.articleLinks.patchValue([]);
        }

        this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "Article", "AddUpdateArticle").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.modalService.dismissAll();
          this.getArticleList();
          this.toastService.show("","Article submitted successfully", 3000,"bg-success text-white","fa-check-circle");  
        });
      }
    }
  }


  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onArticleImageBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropModalReference  = this.openCropImageModal(this.cropImageModal);
    }
  }
  onImageCropper(croppedImageInfo: any) {
    if(croppedImageInfo.croppedImage == null){
      this.cropModalReference.close('Close click');
    }
    this.cropModalReference.close()
    if (croppedImageInfo.targetImageElementId == 'articleImageElement') {
      this.articleImage = croppedImageInfo.croppedImage;
      (<HTMLInputElement>document.getElementById('articleImageBrowserInput')).value = '';
      this.inputForm.controls.imageFileBase64.patchValue(this.articleImage);
      this.inputForm.controls.imageFile.patchValue('Article_0');
      // if(this.articleImage.length < 1400000){
      //   this.invalidSize=true;
      // }else{
      //   this.invalidSize=false;
      // }
    }
  }
  onRemoveImage() {
   // this.invalidSize=true;
    this.articleImage = null;
    this.inputForm.controls.imageFileBase64.patchValue(this.articleImage);
    this.inputForm.controls.imageFile.patchValue(this.articleImage);
  }
  onCancelCropImageModal(){
    this.cropModalReference.close('Close click')
  }
  onAddNewOptionalLink(linkString: string) {
    if(!this.inputForm.controls.optionalLinkText.errors?.pattern){
    if (linkString && linkString.trim().length > 0){
      if(this.articleLinks==null){
        this.articleLinks=[];
      }
      this.articleLinks.push(linkString);
      this.inputForm.controls.optionalLinks.patchValue(this.articleLinks);
      this.inputForm.controls.optionalLinkText.reset();
    }
    else{
      this.inputForm.controls.optionalLinkText.reset();
    }
    if(this.inputForm.controls.optionalLinkText.value == null || this.inputForm.controls.optionalLinkText.value==undefined){
      this.inputForm.controls.optionalLinkText.patchValue("");
    }
  }
  }
  onRemoveOptionalLink(index: number) {
    this.articleLinks.splice(index, 1);
    this.inputForm.controls.articleLinks.patchValue(this.articleLinks);
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
    if(this.inputForm.controls.maxViewEachMonth?.value != null){
      if(parseInt(this.inputForm.controls.maxViewEachMonth?.value?.toString()) === 0 || parseInt(this.inputForm.controls.maxViewEachMonth?.value?.toString()) < 0){
        this.isValidNumber = false;
        this.inputForm.controls.maxViewEachMonth?.patchValue(Number(this.inputForm.controls.maxViewEachMonth?.value?.toString().slice(0,1)));
      }
      else{
       this.isValidNumber = true;
      }
    }
    else{
      this.inputForm.controls.maxViewEachMonth?.patchValue(Number(this.inputForm.controls.maxViewEachMonth?.value?.toString().slice(0,1)));
    }
    if(this.inputForm.controls.maxViewEachMonth?.value < 0){
      this.inputForm.controls.maxViewEachMonth?.patchValue(Number(this.inputForm.controls.maxViewEachMonth?.value?.toString().slice(0,1)));
    }
  }
  onSetMaxViewUnlimitedChange(event){
    this.inputForm.controls.maxViewEachMonth.patchValue('');
    this.unlimitedViews = event.target.checked;
    if(event.target.checked){
      this.isValidNumber = true;
      this.inputForm.controls.maxViewEachMonth.patchValue(0);
    }
  }
  openDeleteArticleModal(content, selectedArticleId) {
    this.selectedArticleId = selectedArticleId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  openDetailArticleModal(content, selectedArticleId) {
    this.modalService.dismissAll();
    this.inputForm.controls.startDate.patchValue(new Date());
    this.inputForm.controls.endDate.patchValue(new Date());
    this.selectedArticleId = selectedArticleId;
    if(this.selectedArticleId>0){
      this.getArticleById();
      // this.inputForm.controls.monthStartJson.patchValue({
      //   month: this.getMonthNameByCode(this.inputForm.controls.monthStartJson.value.month),
      //   year : this.inputForm.controls.monthStartJson.value.year
      // });
    }
    this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  deleteArticle(){
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpGet({ id: this.selectedArticleId }, "Article", "DeleteArticle")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:any) => {
        //this.getArticleList();
        this.toastService.show("","Article deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
        if(this.articleList.length==1 && this.dataTableParams.pageNo>1){
          this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
        }
        this.getArticleList();
      });
  }
  getArticleById(){
    this.appHttpRequestHandlerService.httpGet({ id: this.selectedArticleId }, "Article", "GetArticleById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:GenericResponseTemplateModel<IArticle>) => {
        //console.log(data.responseDataModel)
        this.inputForm.patchValue(data.responseDataModel);
        this.articleLinks=this.inputForm.controls.optionalLinks.value;

        this.articleImage = this.inputForm.controls.imageFileBase64.value;
        this.inputForm.patchValue({
          articleStausType: 1,
          monthsCodes: 'NA',
          optionalLinkText: '',
          monthStartJson: { year: parseInt(this.inputForm.controls.monthStart.value.split('-')[1]) , month:  parseInt(this.inputForm.controls.monthStart.value.split('-')[0])},
          monthEndJson: { year: parseInt(this.inputForm.controls.monthEnd.value.split('-')[1]) , month:  parseInt(this.inputForm.controls.monthEnd.value.split('-')[0])},
          

          monthStart: 'NA',
          monthEnd: 'NA'});
          if(this.inputForm.controls.maxViewEachMonth.value==0){
            this.unlimitedViews=true;
          }
      });
  }
  getMonthNameByCode(monthCode: number): string{
    return this.months[monthCode-1];
  }
  getHomeVariableName(code): string{
    return this.homeVariables?.filter(x=>x.value==code)?.[0]?.Text; 
  }
  openEditArticleModal(articleId:number, content){
    this.modalService.dismissAll();
    // this.onRemoveImage();
    // this.inputForm.patchValue({
    //   articleId: 0,
    //   articleTitle: '',
    //   shortDescriptionText: '',
    //   descriptionText: '',
    //   imageFile: '',
    //   imageFileBase64:'',
    //   articleStausType: 1,
    //   monthsCodes: 'NA',
    //   articleLinks: [],
    //   optionalLinks: [],
    //   optionalLinkText: '',
    //   maxViewEachMonth: '',
    //   homeOwnerAddressDetailType: '',
    //   monthStartJson: { year: new Date().getFullYear(), month: new Date().getMonth()+1 },
    //   monthEndJson: { year: new Date().getFullYear(), month: new Date().getMonth()+1 },
    //   monthStart: 'NA',
    //   monthEnd: 'NA',
    //   endDate:new Date(),
    //   startDate:new Date(),
    // });

    this.openAddArticleModal(articleId, content);
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
  
}
