import { Component, Inject, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { IHomeAddressApplianceDetail, IHomeAddressCoolingDetail, IHomeAddressGeneralDetail, IHomeAddressHeatingDetail, IHomeAddressOutsideDetail, IHomeAddressWaterTreatmentDetail, IHomeOwnerAddressAttribute } from '../home-owner-address-type-module';
import { EnumListTemplate, GenericFormModel, GenericResponseTemplateModel,GenericServiceResultTemplate,TForm,IState } from 'src/app/generic-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { AuthService } from 'src/app/auth.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { IHomeOwnerProfileViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { IHomeVariableMainCategory, IListAndRangeItemViewModel } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
import { DOCUMENT } from '@angular/common';
import { AppToastService } from '../../toast/app-toast.service';

@Component({
  selector: 'app-completed-home-address-detail',
  templateUrl: './completed-home-address-detail.component.html',
  styleUrls: ['./completed-home-address-detail.component.css']
})
export class CompletedHomeAddressDetailComponent implements OnInit {
  tempValue: number = 50;
  options: Options = {
    floor: 1,
    ceil: 60,
    showSelectionBar: true,
    disabled:true,
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
      return '<b>' + value +'&#8457;</b>'
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
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  isProfileCompleted: boolean = false;
  homeOwnerAddressId: number;
  infoNotAvailableText: string = 'None';

  homeAddressGeneralDetail: IHomeAddressGeneralDetail;
  floorTypesArray:any;
  generalDetailStatusType: number = 0;

  homeAddressHeatingDetails: IHomeAddressHeatingDetail;
  heatingDetailStatusType: number = 0;

  homeAddressCoolingDetails: IHomeAddressCoolingDetail;
  coolingDetailStatusType: number = 0;

  homeAddressWaterTreatmentDetail: IHomeAddressWaterTreatmentDetail;
  waterTreatmentDetailStatusType: number = 0;

  homeAddressOutsideDetail: IHomeAddressOutsideDetail;
  outsideDetailStatusType: number = 0;

  homeAddressApplianceDetail: IHomeAddressApplianceDetail;
  applianceDetailStatusType: number = 0;

  public allEnums: EnumListTemplate[] = [];
  public homeOwnerAddressAttributes: IHomeOwnerAddressAttribute[];
  mainCategories:IHomeVariableMainCategory[]=[];
  listAndRangeItem: IListAndRangeItemViewModel;
  homeFullAddress: string;
  homeOwnerName: string;
  submitted = false;
  states: IState[] = [];
  code:number=1;
  inputForm: TForm<IHomeOwnerProfileViewModel> = this.fb.group({
    homeOwnerAddressId: [0, Validators.required],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(40)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    isNotficationOn: [0, [Validators.required]],
    homeProfileImage: [""],
    userRefId: [0, [Validators.required]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: [''],

    firstName: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    lastName: ['', [Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    email: ['', [Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    homeProfileImageBase64: [''],
    realEstateAgentUserRefId: [''],
    reaUser: ['']
  }) as TForm<IHomeOwnerProfileViewModel>;
  userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    public toastService: AppToastService,
    private fb: UntypedFormBuilder,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    // private messageService: MessageService, 
    public commonOpsService: CommonOpsService,
    public authService: AuthService,
    @Inject(DOCUMENT) private document: Document) { }
  get editClientformControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    this.getAllMainCategories();
    this.GetAllListAndRangeItems();
    //var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
      .subscribe(params => {
        //this.homeOwnerAddressId = params.info;
        if(params.info!=undefined && params.info>0){
          this.homeOwnerAddressId = params.info;
        }
       
        else{
          //this.homeOwnerAddressId= userJwtDecodedInfo.HomeOwnerAddressId;
          this.homeOwnerAddressId= this.userJwtDecodedInfo.HomeOwnerAddressId;
        }
        //this.homeOwnerAddressId= userJwtDecodedInfo.HomeOwnerAddressId;
        // this.messageService.setHomeOwnerAddressId(this.homeOwnerAddressId);
        this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetCompleteHomeDetails").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericFormModel<IHomeOwnerAddressAttribute[]>) => {
            this.isProfileCompleted = !data.formModel.some(x => x.homeOwnerAddressDetailStatusType == 0);
            this.allEnums = data.enumListTemplateLists;
            this.homeOwnerAddressAttributes = data.formModel;
            this.homeOwnerName = this.homeOwnerAddressAttributes[0].homeOwnerAddress.applicationUser.firstName;
            this.homeFullAddress = this.homeOwnerAddressAttributes[0].homeOwnerAddress.address 
            + ", " + this.homeOwnerAddressAttributes[0].homeOwnerAddress.cityName
            + ", " + this.homeOwnerAddressAttributes[0].homeOwnerAddress.zipCode;


            this.generalDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 1)[0]?.homeOwnerAddressDetailStatusType;
            this.heatingDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 2)[0]?.homeOwnerAddressDetailStatusType;
            this.coolingDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 3)[0]?.homeOwnerAddressDetailStatusType;
            this.waterTreatmentDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 4)[0]?.homeOwnerAddressDetailStatusType;
            this.outsideDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 5)[0]?.homeOwnerAddressDetailStatusType;
            this.applianceDetailStatusType = this.homeOwnerAddressAttributes?.filter(x => x.homeOwnerAddressDetailType == 6)[0]?.homeOwnerAddressDetailStatusType;
            if (data.formModel.length > 0) {
              if(data.formModel.filter(x => x.homeOwnerAddressDetailType == 1)[0].homeAddressGeneralDetails){
                this.homeAddressGeneralDetail = data.formModel.filter(x => x.homeOwnerAddressDetailType == 1)[0].homeAddressGeneralDetails[0];
              }
              this.floorTypesArray=this.homeAddressGeneralDetail?.floorTypesArray?.filter((item, index, self) => self.indexOf(item) === index);
              this.homeAddressHeatingDetails = data.formModel.filter(x => x.homeOwnerAddressDetailType == 2)[0].homeAddressHeatingDetails[0];
              this.homeAddressCoolingDetails = data.formModel.filter(x => x.homeOwnerAddressDetailType == 3)[0].homeAddressCoolingDetails[0];
              this.homeAddressWaterTreatmentDetail = data.formModel.filter(x => x.homeOwnerAddressDetailType == 4)[0].homeAddressWaterTreatmentDetails[0];
              if (data.formModel.filter(x => x.homeOwnerAddressDetailType == 5)[0].homeAddressOutsideDetails) {
                this.homeAddressOutsideDetail = data.formModel.filter(x => x.homeOwnerAddressDetailType == 5)[0].homeAddressOutsideDetails[0];
              }
              if (data.formModel.filter(x => x.homeOwnerAddressDetailType == 6)[0].homeAddressApplianceDetails) {
                this.homeAddressApplianceDetail = data.formModel.filter(x => x.homeOwnerAddressDetailType == 6)[0].homeAddressApplianceDetails[0];
              }
            }
          });
      });
  }
  ngAfterViewInit(){
    setTimeout(()=>{
      this.route.queryParams
      .subscribe(params => {
        if(params.code!=undefined && params.code>0){
          this.code=params.code;
        }
        else{
          this.code=1;
        }
        const mainDiv = document.getElementById('S'+this.code);;
        mainDiv.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
       });
      });
    }, 100);
  }
  getAllMainCategories(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllMainCategoriesWithAllChilds").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableMainCategory[]>) => {
      this.mainCategories=data?.responseDataModel;
      //console.log(this.mainCategories)
    });
  }
  openEditClientModal(homeOwnerAddressId: number, content): NgbModalRef {
    this.inputForm.reset();
    this.submitted=false;
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
    this.loadHomeOwnerProfile(homeOwnerAddressId);
    return this.modalService.open(content, { size: 'lg' });
  }
  loadHomeOwnerProfile(homeOwnerAddressId: number) {
    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressOwnerProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeOwnerProfileViewModel>) => {
        this.inputForm.patchValue(data.formModel)
       
      });
      this.appHttpRequestHandlerService.httpGet({ id: 0}, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
  }
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
  onSubmit() {
    this.submitted=true;
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }
    if (this.inputForm.valid) {
      this.modalService.dismissAll();
      this.inputForm.controls.realEstateAgentUserRefId.patchValue(this.inputForm.controls.reaUser.value.userId);
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "UpdateHomeAddressProfile").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        this.submitted=false;
       });
       this.homeFullAddress = this.inputForm.controls.address.value+', '+this.inputForm.controls.cityName.value+', '+this.inputForm.controls.zipCode.value;
    }
  }
  GetAllListAndRangeItems(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllListAndRangeItems").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IListAndRangeItemViewModel>) => {
      this.listAndRangeItem=data.responseDataModel;
      this.options = Object.assign({}, this.options, {
        floor: this.listAndRangeItem.homeVariableSubCategoryRangeItems[0].minRange,
        ceil: this.listAndRangeItem.homeVariableSubCategoryRangeItems[0].maxRange
      });
    });
  }

  getEnumDescription(enumName: string, value: number): string {
    //let desc = this.commonOpsService.getEnumItemsByEnumName(this.allEnums, enumName).filter(x => x.value == value)[0]?.description;
    let desc = this.listAndRangeItem?.homeVariableSubCategoryListItems?.filter(x=>x.homeVariableSubCategoryListItemId==value && x.isDeleted==false)[0]?.title;
    if (desc == undefined) {
      return this.infoNotAvailableText;
    }
    return desc;
  }

  // getEnumDescription(enumName: string, value: number): string {
  //   let desc = this.commonOpsService.getEnumItemsByEnumName(this.allEnums, enumName).filter(x => x.value == value)[0]?.description;
  //   if (desc == undefined) {
  //     return this.infoNotAvailableText;
  //   }
  //   return desc;
  // }
  getEnumMultipleDescriptions(enumName: string, values: number[]): string {
    let commaSepratedDescritions = '';
    if (values != null) {
      values.forEach(value => {
        if (commaSepratedDescritions.length > 0) {
          commaSepratedDescritions += ', ';
        }
        commaSepratedDescritions += this.getEnumDescription(enumName, value);
      });
      return commaSepratedDescritions;
    }
    else {
      return this.infoNotAvailableText;
    }
  }
  convertBoolToYesNo(value: boolean): string {
    return value ? 'Yes' : 'No';
  }
  convertNumberToYesNo(value: number): string {
    return value == 1 ? 'Yes' : 'No';
  }
  // getDetailStatusType(homeOwnerAddressDetailType: number){
  //   this.generalDetailStatusType = this.homeOwnerAddressAttributes?.filter(x=>x.homeOwnerAddressDetailType==1)[0]?.homeOwnerAddressDetailStatusType
  //   return this.generalDetailStatusType;
  // }
  onClickEdit(stepNo: number){
    this.router.navigate(['/HomeAddress/ManageHomeDetails'], {queryParams:{info: this.homeOwnerAddressId, code: stepNo}});
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
  openProfileManagerPage() {
    this.router.navigate(['/Account/Settings'], {queryParams:{id: this.homeOwnerAddressId}});
  }
  navigateToHome(){
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    if(userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
      this.router.navigate(['/HomeAddress/Dashboard']);
    }
    else if(userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
      this.router.navigate(['/RealEstateAgent/Dashboard']);
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    }
    else if(userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
      this.router.navigate(['/Admin/Dashboard']);
    }
  }
}
