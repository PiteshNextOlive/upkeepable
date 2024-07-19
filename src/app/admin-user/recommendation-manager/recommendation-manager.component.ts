import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef  } from '@ng-bootstrap/ng-bootstrap';
import {  Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, TForm } from 'src/app/generic-type-module';
import { IRecommendation } from 'src/app/home-owner-address/home-owner-address-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { DropDownContent, State } from '../admin-user-type-module';
import { IHomeVariableMainCategory, IHomeVariableSubCategoryListItem, IListAndRangeItemViewModel } from '../home-variable-manager/home-variable-type-module';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-recommendation-manager',
  templateUrl: './recommendation-manager.component.html',
  styleUrls: ['./recommendation-manager.component.css']
})
export class RecommendationManagerComponent implements OnInit {
    userJwtDecodedInfo: UserJwtDecodedInfo;
    protected ngUnsubscribe: Subject<void> = new Subject<void>();
    @Input() showHeaderTitle: boolean;
    dataList: IRecommendation[] = [];
    selectedRecommendation: IRecommendation;
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
    submittedStep1 = false;
    preDate: string;
    invalidSize:boolean=true;
    submittedStep2 = false;
    submitted= false;
    //defaultProfilePhoto: string = environment.defaultProfilePhoto;
    profilePhoto: string = null;
    fileUploadEventObject: any;
    targetImageElementId: string = '';
    aspectRatio: string = '1/1';
    date = new Date().getFullYear();
    minPickerDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
    };
    private cropModalReference: NgbModalRef;
    recommendationId: number=0;
    @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
    @ViewChild('addRecommendationModalContent') addRecommendationModalContent: TemplateRef<any>;
    @ViewChild('deleteRecommendationAlertModal') deleteRecommendationAlertModal: TemplateRef<any>;
    // inputFormPauseHO: TForm<IHomeOwnerPauseViewModel> = this.fb.group({
    //   userId: [0, Validators.required],
    //   pauseMessage: ['', Validators.required],
    // }) as TForm<IHomeOwnerPauseViewModel>;
    filterOptions: DropDownContent[] = new Array<DropDownContent>();
    selectedFilterOps: number[]=[];
    stepCode: number = 1;
    mainCategories:IHomeVariableMainCategory[]=[];
    listAndRangeItem: IListAndRangeItemViewModel;

    //, [Validators.pattern('/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/')]
    inputForm: TForm<IRecommendation> = this.fb.group({
      recommendationId: [0, Validators.required],
      recommendationTitle: ['', [Validators.required, Validators.maxLength(150)]],
      descriptionText: ['', [Validators.required, Validators.maxLength(500)]],
      imageFile:['', Validators.required],
      imageFileBase64:['', Validators.required],
      iconFile:['', Validators.required],
      recommendationStausType: [0, Validators.required],
      createdOn: [new Date(), Validators.required],
      lastModifiedOn:[new Date(),Validators.required],
      selectedSubCateListIds:[[],Validators.required],
      optionalLinks: [],
      optionalLinkText: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
      recommendationFrequencyType:['', Validators.required],
      startDate:[new Date(), Validators.required],
      lastSentOn:[new Date(), Validators.required],
      startDateJson:['',  Validators.required],
      membershipPlanType:[1,  Validators.required],
      variables:[''],

      homeAge:[0, Validators.required],
      homeAgeMax:[0, Validators.required],

      homeArea:[0, Validators.required],
      homeAreaMax:[0, Validators.required],

      floorsCount:[0, Validators.required],
      floorsCountMax:[0, Validators.required],

      isGarage: ["-1", Validators.required],

      heatSourceAge:[0, Validators.required],
      heatSourceAgeMax:[0, Validators.required],

      coolingTemprature:[0, Validators.required],
      coolingTempratureMax:[0, Validators.required],

      heatingTemprature:[0, Validators.required],
      heatingTempratureMax:[0, Validators.required],

      coolingSourceAge:[0, Validators.required],
      coolingSourceAgeMax:[0, Validators.required],

      waterTeat_Temprature:[0, Validators.required],
      waterTeat_TempratureMax:[0, Validators.required],

      waterTeat_FilterAge:[0, Validators.required],
      waterTeat_FilterAgeMax:[0, Validators.required],

      waterTeat_IsSoftener: ["-1", Validators.required],

      homeOutside_IsLawn: ["-1", Validators.required],
      homeOutside_IsFence: ["-1", Validators.required],
      homeOutside_IsSprinklers: ["-1", Validators.required],
      homeOutside_IsTree: ["-1", Validators.required],
      homeOutside_IsShrubs: ["-1", Validators.required],
      homeOutside_IsPool: ["-1", Validators.required],
      homeOutside_IsHotTub: ["-1", Validators.required],

      homeAppliance_IsSmartLight: ["-1", Validators.required],
      homeAppliance_IsWashingMachine: ["-1", Validators.required],
      homeAppliance_IsDryer: ["-1", Validators.required],
      homeAppliance_IsRangeHood: ["-1", Validators.required],
      homeAppliance_IsDishwasher: ["-1", Validators.required],
      homeAppliance_IsOven: ["-1", Validators.required],
      homeAppliance_IsStove: ["-1", Validators.required],
      homeAppliance_IsMicrowave: ["-1", Validators.required],

  }) as TForm<IRecommendation>;

  get formControls() { return this.inputForm.controls; }
  icons:any[]=[];
  selectedIconName: string='';
  optionalLinks: string[] = [];


  homeAgeValue: number = 0;
  homeAgeMaxValue: number=50;
  isValidURL: boolean = true;
  options_HomeAge: Options = {
    floor: 1,
    ceil: 100,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      // if (value <= 3) {
      //     return 'red';
      // }
      // if (value <= 6) {
      //     return 'orange';
      // }
      // if (value <= 9) {
      //     return 'yellow';
      // }
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        // if (value <= 3) {
        //     return 'red';
        // }
        // if (value <= 6) {
        //     return 'orange';
        // }
        // if (value <= 9) {
        //     return 'yellow';
        // }
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Years</b>'
      // switch (label) {
      //   case LabelType.Low:
      //     return '<b>Min price:</b> $' + value;
      //   case LabelType.High:
      //     return '<b>Max price:</b> $' + value;
      //   default:
      //     return '$' + value;
      // }
    }
  };


  homeAreaValue: number = 200;
  homeAreaMaxValue: number = 5000;
  options_HomeArea: Options = {
    floor: 200,
    ceil: 5000,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Sq.Ft.</b>'
    }
  };

  
  floorsCountValue: number = 0;
  floorsCountMaxValue: number = 10;
  options_FloorsCount: Options = {
    floor: 0,
    ceil: 10,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Floors</b>'
    }
  };

  heatSourceAgeValue: number = 0;
  heatSourceAgeMaxValue: number = 100;
  options_HeatSourceAge: Options = {
    floor: 1,
    ceil: 100,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Years</b>'
    }
  };



  coolingTempratureValue: number = 0;
  coolingTempratureMaxValue: number = 130;
  options_CoolingTemprature: Options = {
    floor: 17,
    ceil: 130,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +'&#8457;</b>'
    }
  };
  heatingTempratureValue: number = 0;
  heatingTempratureMaxValue: number = 130;
  options_HeatingTemprature: Options = {
    floor: 17,
    ceil: 130,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +'&#8457;</b>'
    }
  };
  
  coolingSourceAgeValue: number = 0;
  coolingSourceAgeMaxValue: number = 100;
  options_CoolingSourceAge: Options = {
    floor: 1,
    ceil: 100,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Years</b>'
    }
  };


  waterTeat_TempratureValue: number = 70;
  waterTeat_TempratureMaxValue: number = 100;
  options_WaterTeat_Temprature: Options = {
    floor: 70,
    ceil: 100,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +'&#8457;</b>'
    }
  };
  
  waterTeat_FilterAgeValue: number = 0;
  waterTeat_FilterAgeMaxValue: number = 60;
  options_waterTeat_FilterAge: Options = {
    floor: 0,
    ceil: 60,
    showSelectionBar: true,
    getSelectionBarColor: (value: number): string => {
      return '#31C780';
    },
   
    getPointerColor: (value: number): string => {
        return '#31C780';
    },
    translate: (value: number, label: LabelType): string => {
      return '<b>' + value +' Months</b>'
    }
  };
  isDuplicate=false;
  searchText: string ='';
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    public toastService: AppToastService,
    private router: Router,
    private accountService: AccountService,
    public commonOpsService: CommonOpsService,
    public httpClient: HttpClient) { 
      this.renderer.listen('window', 'click', (event: Event) => {
        var classList = (<HTMLElement>event.target).classList;
        //console.log(classList)
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
          //console.log(':::::::::::::::',dropdown.classList)
          if(dropdown && dropdown.classList)
            dropdown.classList.remove('is-active');
        }
      });
    }

  ngOnInit(): void {
    this.dataTableParams.searchCode = '';
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = 10;
    this.dataTableParams.sortColumn = 'RecommendationTitle';
    this.dataTableParams.sortOrder = '1';
    this.dataTableParams.filterArray='';

    this.getList();
  }

  onChangeSortOrder(event) {
    this.dataTableParams.sortOrder = event.target.value;
    this.getList();
  }
  onChangePageSize(event) {
    this.dataTableParams.pageNo = 1;
    this.dataTableParams.pageSize = event.target.value;
    this.getList();
  }
  onChangeOption(target, data) {
    var value = target.value;
    if(value==1){
     this.openAddRecommendationModal(data.recommendationId, false, this.addRecommendationModalContent);
    }
    if(value==2){
      this.openDeleteRecommendationAlertModal(data.recommendationId, this.deleteRecommendationAlertModal);
    }
    if(value==3){
      this.openAddRecommendationModal(data.recommendationId, true, this.addRecommendationModalContent);
    }
    target.value='0';
  }
  // onChangePageNumber(pageNum) {
  //   this.dataTableParams.pageNo = pageNum;
  //   this.getList();
  // }
  // onClickNextPage() {
  //   if (this.dataTableParams.pageNo < this.totalPages) {
  //     this.dataTableParams.pageNo = this.dataTableParams.pageNo + 1;
  //     this.getList();
  //   }
  // }
  // onClickPrevPage() {
  //   if (this.dataTableParams.pageNo > 1) {
  //     this.dataTableParams.pageNo = this.dataTableParams.pageNo - 1;
  //     this.getList();
  //   }
  // }
  loadPage(event){
      this.dataTableParams.pageNo = event;
      this.getList();
  }

  getList() {
    this.appHttpRequestHandlerService.httpGet(this.dataTableParams, "Recommendation", "GetAllRecommendationsList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRecommendation[]>) => {
       // console.log("data list", data.responseDataModel);
        this.dataList = data.responseDataModel;
        if (this.dataList.length > 0) {
          this.totalRecords = this.dataList[0].maxRows;
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
    this.getList();
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
      if(i!=elementId){
        var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
      }
    }
    document.getElementById('myDropdown' + elementId).classList.toggle("show");
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
    this.dataTableParams.filterArray= filterOpsStr.substring(1,filterOpsStr.length-1)
    this.getList();
  }

  sortByColName(colName: string){
    if(colName == this.dataTableParams.sortColumn){
      this.dataTableParams.sortOrder = (this.dataTableParams.sortOrder == '1' ? '2' : '1');
    }
    else{
      this.dataTableParams.sortOrder = '1';
    }
    this.dataTableParams.sortColumn = colName;
    this.getList();
  }
  onCloseAllModels() {
    this.modalService.dismissAll();
  }
  openDeleteRecommendationAlertModal(recommendationId: number, content) {
    this.recommendationId=recommendationId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }
  onDeleteRecommendationModelYesClick(){
    //console.log(this.recommendationId)
    this.appHttpRequestHandlerService.httpPost({id: this.recommendationId, recommendationStausType:3 } , "Recommendation", "SetRecommendationStatusById")
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
      if(this.dataList.length==1 && this.dataTableParams.pageNo>1){
        this.dataTableParams.pageNo=this.dataTableParams.pageNo-1;
      }
      this.modalService.dismissAll();
      this.getList();
    });
  }

  openPauseRecommendationAlertModal(recommendationId: number, content) {
    this.recommendationId=recommendationId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }
  onPauseRecommendationModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({id: this.recommendationId, recommendationStausType:2 } , "Recommendation", "SetRecommendationStatusById")
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
      this.modalService.dismissAll();
      this.getList();
    });
  }

  onUnPauseRecommendationModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({id: this.recommendationId, recommendationStausType:1 } , "Recommendation", "SetRecommendationStatusById")
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
      this.modalService.dismissAll();
      this.getList();
    });
  }

  openUnPauseRecommendationAlertModal(recommendationId: number, content) {
    this.recommendationId=recommendationId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }


  openViewRecommendationDetailModal(recommendationId: number, content): NgbModalRef {
    this.recommendationId=recommendationId;
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  openAddRecommendationModal(recommendationId:number, isDuplicate: boolean, content): NgbModalRef {
    this.isDuplicate=isDuplicate;
    this.getAllMainCategories();
    this.GetAllListAndRangeItems();
    this.httpClient.get("assets/img/home-variable-icons/variable-icons.json").subscribe((data:any[]) =>{
      this.icons=data;
    })

    this.recommendationId = recommendationId;
    this.stepCode = 1;
    this.inputForm.reset();
    this.submittedStep1=false;
    this.submittedStep2=false;
    this.submitted= false;
    this.optionalLinks=[];
    this.selectedIconName='';
    this.inputForm.patchValue({
      recommendationId: 0,
      recommendationTitle: '',
      descriptionText: '',
      imageFile:'',
      imageFileBase64:'',
      iconFile:'',
      recommendationStausType: 0,
      createdOn: new Date(),
      lastModifiedOn: new Date(),
      selectedSubCateListIds:[],

      optionalLinks: [],
      optionalLinkText: '',
      recommendationFrequencyType:'',
      startDate: new Date(),
      lastSentOn: new Date(),
      startDateJson:'',
      membershipPlanType:1,
      variables:'',

      homeAge:0,
      homeArea: 0,
      floorsCount: 0,
      isGarage: "-1",

      heatSourceAge: 0,

      coolingTemprature: 0,
      coolingSourceAge: 0,

      waterTeat_Temprature: 0,
      waterTeat_FilterAge: 0,
      waterTeat_IsSoftener: "-1",

      homeOutside_IsLawn: "-1",
      homeOutside_IsFence:  "-1",
      homeOutside_IsSprinklers: "-1",
      homeOutside_IsTree: "-1",
      homeOutside_IsShrubs: "-1",
      homeOutside_IsPool: "-1",
      homeOutside_IsHotTub: "-1",

      homeAppliance_IsSmartLight: "-1",
      homeAppliance_IsWashingMachine: "-1",
      homeAppliance_IsDryer: "-1",
      homeAppliance_IsRangeHood: "-1",
      homeAppliance_IsDishwasher: "-1",
      homeAppliance_IsOven: "-1",
      homeAppliance_IsStove: "-1",
      homeAppliance_IsMicrowave: "-1",
  });

  this.homeAgeValue = 0;
  this.homeAgeMaxValue=100;

  this.homeAreaValue = 200;
  this.homeAreaMaxValue = 5000;

  this.floorsCountValue = 0;
  this.floorsCountMaxValue = 10;

  this.heatSourceAgeValue = 0;
  this.heatSourceAgeMaxValue = 100;

  this.coolingTempratureValue = 0;
  this.coolingTempratureMaxValue = 130;

  this.heatingTempratureValue = 0;
  this.heatingTempratureMaxValue = 130;

  this.coolingSourceAgeValue = 0;
  this.coolingSourceAgeMaxValue = 100;

  this.waterTeat_TempratureValue = 70;
  this.waterTeat_TempratureMaxValue = 100;

  this.waterTeat_FilterAgeValue = 0;
  this.waterTeat_FilterAgeMaxValue = 60;

    this.onRemoveImage();

      if(this.recommendationId>0){
        this.getRecommendationById(isDuplicate);
      }
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  setRecommendationModalStep(stepCode: number){
    if(stepCode==2){
      this.submittedStep1=true;
    }
    else{
      this.submittedStep2=true;
    }

    if(stepCode==2 && (!this.formControls.recommendationTitle.invalid 
      && !this.formControls.descriptionText.invalid 
      && !this.formControls.iconFile.invalid 
      && !this.formControls.imageFileBase64.invalid
     // && this.invalidSize
    // && !this.formControls.selectedSubCateListIds.invalid
      && !this.formControls.optionalLinkText.invalid)){
        this.stepCode = stepCode;
        setTimeout(()=>{
          this.setCheckedSubItems();
        }, 500);
    }
    else if(stepCode==3){
      this.stepCode = stepCode;
    }
    if(stepCode==3 && (!this.formControls.selectedSubCateListIds.invalid)){
        this.stepCode = stepCode;
        setTimeout(()=>{
          this.setCheckedSubItems();
        }, 500);
    }
    else if(stepCode==3){
      this.stepCode = 2;
    }
  }

  backRecommendationStep(stepCode: number){
    this.stepCode = stepCode;
    if(this.stepCode==2){
      setTimeout(()=>{
        this.setCheckedSubItems();
      }, 500);
    }
  }

  setViewRecommendationModalStep(stepCode: number){
    if(stepCode==2){
        this.stepCode = stepCode;
        setTimeout(()=>{
          this.setVisibleSubItems();
        }, 500);
    }
  }


  setCheckedSubItems(){
    this.inputForm.controls.selectedSubCateListIds.value.forEach(id => {
        if(<HTMLInputElement>document.getElementById(parseInt(id,0).toString())){
        (<HTMLInputElement>document.getElementById(parseInt(id,0).toString())).checked=true;
      }
    });
  
    this.inputForm.controls.isGarage.patchValue(this.inputForm.controls.isGarage.value.toString())
    this.inputForm.controls.waterTeat_IsSoftener.patchValue(this.inputForm.controls.waterTeat_IsSoftener.value.toString())
    this.inputForm.controls.homeOutside_IsLawn.patchValue(this.inputForm.controls.homeOutside_IsLawn.value.toString())
    this.inputForm.controls.homeOutside_IsFence.patchValue(this.inputForm.controls.homeOutside_IsFence.value.toString())
    this.inputForm.controls.homeOutside_IsSprinklers.patchValue(this.inputForm.controls.homeOutside_IsSprinklers.value.toString())
    this.inputForm.controls.homeOutside_IsTree.patchValue(this.inputForm.controls.homeOutside_IsTree.value.toString())
    this.inputForm.controls.homeOutside_IsShrubs.patchValue(this.inputForm.controls.homeOutside_IsShrubs.value.toString())
    this.inputForm.controls.homeOutside_IsPool.patchValue(this.inputForm.controls.homeOutside_IsPool.value.toString())
    this.inputForm.controls.homeOutside_IsHotTub.patchValue(this.inputForm.controls.homeOutside_IsHotTub.value.toString())
    this.inputForm.controls.homeAppliance_IsSmartLight.patchValue(this.inputForm.controls.homeAppliance_IsSmartLight.value.toString())
    this.inputForm.controls.homeAppliance_IsWashingMachine.patchValue(this.inputForm.controls.homeAppliance_IsWashingMachine.value.toString())
    this.inputForm.controls.homeAppliance_IsDryer.patchValue(this.inputForm.controls.homeAppliance_IsDryer.value.toString())
    this.inputForm.controls.homeAppliance_IsRangeHood.patchValue(this.inputForm.controls.homeAppliance_IsRangeHood.value.toString())
    this.inputForm.controls.homeAppliance_IsDishwasher.patchValue(this.inputForm.controls.homeAppliance_IsDishwasher.value.toString())
    this.inputForm.controls.homeAppliance_IsOven.patchValue(this.inputForm.controls.homeAppliance_IsOven.value.toString())
    this.inputForm.controls.homeAppliance_IsStove.patchValue(this.inputForm.controls.homeAppliance_IsStove.value.toString())
    this.inputForm.controls.homeAppliance_IsMicrowave.patchValue(this.inputForm.controls.homeAppliance_IsMicrowave.value.toString())
  }

  setVisibleSubItems(){
    this.inputForm.controls.selectedSubCateListIds.value.forEach(id => {
      var element = (<HTMLElement>document.getElementById(parseInt(id,0).toString()));
      if(element){
        element.style.display="block";
      }
    });
    this.inputForm.controls.isGarage.patchValue(this.inputForm.controls.isGarage.value.toString())
    this.inputForm.controls.waterTeat_IsSoftener.patchValue(this.inputForm.controls.waterTeat_IsSoftener.value.toString())
    this.inputForm.controls.homeOutside_IsLawn.patchValue(this.inputForm.controls.homeOutside_IsLawn.value.toString())
    this.inputForm.controls.homeOutside_IsFence.patchValue(this.inputForm.controls.homeOutside_IsFence.value.toString())
    this.inputForm.controls.homeOutside_IsSprinklers.patchValue(this.inputForm.controls.homeOutside_IsSprinklers.value.toString())
    this.inputForm.controls.homeOutside_IsTree.patchValue(this.inputForm.controls.homeOutside_IsTree.value.toString())
    this.inputForm.controls.homeOutside_IsShrubs.patchValue(this.inputForm.controls.homeOutside_IsShrubs.value.toString())
    this.inputForm.controls.homeOutside_IsPool.patchValue(this.inputForm.controls.homeOutside_IsPool.value.toString())
    this.inputForm.controls.homeOutside_IsHotTub.patchValue(this.inputForm.controls.homeOutside_IsHotTub.value.toString())
    this.inputForm.controls.homeAppliance_IsSmartLight.patchValue(this.inputForm.controls.homeAppliance_IsSmartLight.value.toString())
    this.inputForm.controls.homeAppliance_IsWashingMachine.patchValue(this.inputForm.controls.homeAppliance_IsWashingMachine.value.toString())
    this.inputForm.controls.homeAppliance_IsDryer.patchValue(this.inputForm.controls.homeAppliance_IsDryer.value.toString())
    this.inputForm.controls.homeAppliance_IsRangeHood.patchValue(this.inputForm.controls.homeAppliance_IsRangeHood.value.toString())
    this.inputForm.controls.homeAppliance_IsDishwasher.patchValue(this.inputForm.controls.homeAppliance_IsDishwasher.value.toString())
    this.inputForm.controls.homeAppliance_IsOven.patchValue(this.inputForm.controls.homeAppliance_IsOven.value.toString())
    this.inputForm.controls.homeAppliance_IsStove.patchValue(this.inputForm.controls.homeAppliance_IsStove.value.toString())
    this.inputForm.controls.homeAppliance_IsMicrowave.patchValue(this.inputForm.controls.homeAppliance_IsMicrowave.value.toString())
  }


  getAllMainCategories(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllMainCategoriesWithAllChilds").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableMainCategory[]>) => {
      this.mainCategories=data?.responseDataModel;
      // console.log(this.mainCategories)
    });
  }

  GetAllListAndRangeItems(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllListAndRangeItems").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IListAndRangeItemViewModel>) => {
      this.listAndRangeItem=data.responseDataModel;
    });
  }
  getListItemsOfSubCategory(homeVariableSubCategoryRefId: number): IHomeVariableSubCategoryListItem[]{
    return this.listAndRangeItem?.homeVariableSubCategoryListItems?.filter(x=>x.homeVariableSubCategoryRefId == homeVariableSubCategoryRefId && !x.isDeleted)
  }

  onChangeListItemsCheckBox(event: any) {
    this.inputForm.controls.selectedSubCateListIds
      .patchValue(this.commonOpsService
        .prepareCommaSeparatedCheckBoxValues(event, this.inputForm.controls.selectedSubCateListIds.value));
  }
  setCategoryIcon(iconFile: string){
      this.inputForm.controls.iconFile.patchValue(iconFile);
      this.selectedIconName = iconFile.substring(0, iconFile.lastIndexOf('.'));
      this.toggleIconGallery();
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
      this.inputForm.controls.imageFileBase64.patchValue(this.profilePhoto);
      this.inputForm.controls.imageFile.patchValue('NA');
      // if(this.profilePhoto.length < 1400000){
      //   this.invalidSize=true;
      // }else{
      //   this.invalidSize=false;
      // }
    }
  }
  onRemoveImage() {
    //this.invalidSize=true;
    this.profilePhoto = null;
    this.inputForm.controls.imageFileBase64.patchValue(this.profilePhoto);
    this.inputForm.controls.imageFile.patchValue(this.profilePhoto);
  }
  onCancelCropImageModal() {
    this.cropModalReference.close('Close click')
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }
  onAddNewOptionalLink(linkString: string) {
    if(!this.inputForm.controls.optionalLinkText.errors?.pattern){
      if (linkString && linkString.trim().length > 0){
        if(this.optionalLinks==null){
          this.optionalLinks=[];
        }
        this.optionalLinks.push(linkString.trim());
        this.inputForm.controls.optionalLinks.patchValue(this.optionalLinks);
        this.inputForm.controls.optionalLinkText.reset();
      }
      else{
        this.inputForm.controls.optionalLinkText.reset();
      }
    }
    
  }
  onRemoveOptionalLink(index: number) {
    this.optionalLinks.splice(index, 1);
    this.inputForm.controls.optionalLinks.patchValue(this.optionalLinks);
  }
  saveRecommendation(){
    // if(this.inputForm.controls.startDateJson.value==this.preDate){
    //   this.minPickerDate = {
    //     year: 0,
    //     month: 0,
    //     day: 0
    // };
    // }
    // else{
    //   this.minPickerDate = {
    //     year: new Date().getFullYear(),
    //     month: new Date().getMonth() + 1,
    //     day: new Date().getDate()
    // };
    // }
    this.submitted = true;
    
      this.inputForm.controls.homeAge.patchValue(this.homeAgeValue);
      this.inputForm.controls.homeAgeMax.patchValue(this.homeAgeMaxValue);

      this.inputForm.controls.homeArea.patchValue(this.homeAreaValue);
      this.inputForm.controls.homeAreaMax.patchValue(this.homeAreaMaxValue);

      this.inputForm.controls.floorsCount.patchValue(this.floorsCountValue);
      this.inputForm.controls.floorsCountMax.patchValue(this.floorsCountMaxValue);

      this.inputForm.controls.heatSourceAge.patchValue(this.heatSourceAgeValue);
      this.inputForm.controls.heatSourceAgeMax.patchValue(this.heatSourceAgeMaxValue);

      this.inputForm.controls.heatingTemprature.patchValue(this.heatingTempratureValue);
      this.inputForm.controls.heatingTempratureMax.patchValue(this.heatingTempratureMaxValue);

      this.inputForm.controls.coolingTemprature.patchValue(this.coolingTempratureValue);
      this.inputForm.controls.coolingTempratureMax.patchValue(this.coolingTempratureMaxValue);

      this.inputForm.controls.coolingSourceAge.patchValue(this.coolingSourceAgeValue);
      this.inputForm.controls.coolingSourceAgeMax.patchValue(this.coolingSourceAgeMaxValue);


      this.inputForm.controls.waterTeat_Temprature.patchValue(this.waterTeat_TempratureValue);
      this.inputForm.controls.waterTeat_TempratureMax.patchValue(this.waterTeat_TempratureMaxValue);

      this.inputForm.controls.waterTeat_FilterAge.patchValue(this.waterTeat_FilterAgeValue);
      this.inputForm.controls.waterTeat_FilterAgeMax.patchValue(this.waterTeat_FilterAgeMaxValue);
     
    if (this.inputForm.valid) {
      this.modalService.dismissAll();
      this.inputForm.controls.startDateJson.patchValue(JSON.stringify(this.inputForm.controls.startDateJson.value));

      this.inputForm.controls.variables.patchValue(JSON.stringify(this.inputForm.controls.selectedSubCateListIds.value));

      if(this.inputForm.controls.optionalLinkText.value && this.inputForm.controls.optionalLinkText.value.trim().length>0){
        if(this.optionalLinks==null || this.optionalLinks == undefined){
          this.optionalLinks = [];
        }
        this.optionalLinks.push(this.inputForm.controls.optionalLinkText.value.trim());
        this.inputForm.controls.optionalLinks.patchValue(this.optionalLinks);
      }  

      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "Recommendation", "AddUpdateRecommendation").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
         this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.getList();
        });
    }
  }
  toggleIconGallery(){
    var dropdown = document.getElementById("iconGallery");
    if (dropdown.classList.contains('showIconGallery')) {
      dropdown.classList.remove('showIconGallery');
    }
    else{
      dropdown.classList.add('showIconGallery');
    }
  }

  getRecommendationById(isDuplicate: boolean){
    debugger;
    this.minPickerDate = {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate()
  };
    this.appHttpRequestHandlerService.httpGet({ id: this.recommendationId }, "Recommendation", "GetRecommendationById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:GenericResponseTemplateModel<IRecommendation>) => {
        debugger;
        this.inputForm.patchValue(data.responseDataModel);
        this.selectedIconName = data.responseDataModel.iconFile.replace('.svg','');
        this.optionalLinks = this.inputForm.controls.optionalLinks.value;
        this.profilePhoto = this.inputForm.controls.imageFile.value;
        var ids: any[]=[];
        if(data.responseDataModel.variables.length>0){
          JSON.parse(data.responseDataModel.variables).forEach(element => {
            ids.push(parseInt(element));
          });
        }
        this.inputForm.controls.selectedSubCateListIds.patchValue(ids);

        this.homeAgeValue= this.inputForm.controls.homeAge.value;
        this.homeAgeMaxValue= this.inputForm.controls.homeAgeMax.value;

        this.homeAreaValue= this.inputForm.controls.homeArea.value;
        this.homeAreaMaxValue= this.inputForm.controls.homeAreaMax.value;

        this.floorsCountValue= this.inputForm.controls.floorsCount.value;
        this.floorsCountMaxValue= this.inputForm.controls.floorsCountMax.value;

        this.heatSourceAgeValue= this.inputForm.controls.heatSourceAge.value;
        this.heatSourceAgeMaxValue= this.inputForm.controls.heatSourceAgeMax.value;

        this.coolingTempratureValue= this.inputForm.controls.coolingTemprature.value;
        this.coolingTempratureMaxValue= this.inputForm.controls.coolingTempratureMax.value;

        this.heatingTempratureValue= this.inputForm.controls.heatingTemprature.value;
        this.heatingTempratureMaxValue= this.inputForm.controls.heatingTempratureMax.value;

        this.coolingSourceAgeValue= this.inputForm.controls.coolingSourceAge.value;
        this.coolingSourceAgeMaxValue= this.inputForm.controls.coolingSourceAgeMax.value;

        this.waterTeat_TempratureValue= this.inputForm.controls.waterTeat_Temprature.value;
        this.waterTeat_TempratureMaxValue= this.inputForm.controls.waterTeat_TempratureMax.value;

        this.waterTeat_FilterAgeValue= this.inputForm.controls.waterTeat_FilterAge.value;
        this.waterTeat_FilterAgeMaxValue= this.inputForm.controls.waterTeat_FilterAgeMax.value;

        this.inputForm.controls.membershipPlanType.patchValue(this.inputForm.controls.membershipPlanType.value.toString());
        this.inputForm.controls.startDateJson.patchValue(
          JSON.parse(this.inputForm.controls.startDateJson.value)
         
        )
        this.preDate=this.inputForm.controls.startDateJson.value;
        if(isDuplicate){
          this.inputForm.controls.recommendationId.patchValue(0);
        }
      });
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
  openEditRecommendationModal(content){
    this.modalService.dismissAll();
    this.openAddRecommendationModal(this.recommendationId, false, content);
  }
  isCollapsedShown(collapseId: string){
    return !document.getElementById(collapseId).classList.contains('collapse')
  }
}
