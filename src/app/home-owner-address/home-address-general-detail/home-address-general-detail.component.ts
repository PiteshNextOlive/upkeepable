import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder,  Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHomeAddressGeneralDetail } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-home-address-general-detail',
  templateUrl: './home-address-general-detail.component.html',
  styleUrls: ['./home-address-general-detail.component.css']
})
export class HomeAddressGeneralDetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  homeTypeEnum: EnumJsonTemplate[] = [];
  homeFloorTypeEnum: EnumJsonTemplate[] = [];
  homeSidingTypeEnum: EnumJsonTemplate[] = [];
  isValidYear: boolean = true;
  validYear: number = 0;
  isZeroValidArea: boolean = false;
  isValidArea: boolean = true;
  currentYear: number = 0;
  homeGarageSizeTypeEnum: EnumJsonTemplate[] = [];
  @Input() homeOwnerAddressAttributeRefId : number;
  @Input() homeAddressGeneralDetailList: IHomeAddressGeneralDetail[];
  @Input() mainCategory: IHomeVariableMainCategory;

  @Output() moveToNextFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<any>();
  homeAddressGeneralDetailId: number=0;
  wantToEdit: boolean=false;
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router) { 
    }
  submitted = false;

  inputForm: TForm<IHomeAddressGeneralDetail> = this.fb.group({
    homeAddressGeneralDetailId: [0, Validators.required],
    homeType: [0],
    homeAge_Year: [0],
    homeAge_Month: [0],
    homeTotalArea_SqFt: [0],
    floorsCount: [0],
    floorTypesArray: [[]],
    homeSidingType: [0],
    isGarage: [1],
    garageSize: [0],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressGeneralDetail>;

  get formControls() { return this.inputForm.controls; }
  subCategories:IHomeVariableSubCategory[]=[];
  ngOnInit(): void {
    this.validYear = (new Date()).getFullYear() - 300;
    this.currentYear = (new Date()).getFullYear();
    if(this.homeAddressGeneralDetailList.length>0){
      this.homeAddressGeneralDetailId = this.homeAddressGeneralDetailList[0].homeAddressGeneralDetailId;
    }
  }
  ngOnChanges(){    
    setTimeout(() => {
      this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    }, 500);
   
    if(this.homeAddressGeneralDetailList.length>0){
      this.homeAddressGeneralDetailId = this.homeAddressGeneralDetailList[0].homeAddressGeneralDetailId;
    }
  }

  getValues(){
    this.appHttpRequestHandlerService.httpGet({ homeAddressGeneralDetailId: this.homeAddressGeneralDetailId }, "HomeOwnerAddress", "GetHomeAddressGeneraldetail").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericFormModel<IHomeAddressGeneralDetail>) => {      
      this.homeTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HomeTypeEnum");
      this.homeFloorTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HomeFloorTypeEnum");
      this.homeSidingTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HomeSidingTypeEnum");
      this.homeGarageSizeTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HomeGarageSizeTypeEnum");
      if(data.formModel.homeAddressGeneralDetailId!=0){       
        this.inputForm.patchValue(data.formModel);
        this.inputForm.controls.isGarage.patchValue(data.formModel.isGarage==1 ? "1": "0");
      }
    });
  this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
  this.inputForm.controls.homeAddressGeneralDetailId.patchValue(this.homeAddressGeneralDetailId);
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
    
    if(this.inputForm.controls.homeType?.value == null || this.inputForm.controls.homeType?.value == 0)
    {
      this.inputForm.patchValue({
         homeType: this.subCategories[0]?.homeVariableSubCategoryListItems[0]?.homeVariableSubCategoryListItemId,
       })
    }
    if (this.inputForm.controls.homeTotalArea_SqFt?.value == null || isNaN(this.inputForm.controls.homeTotalArea_SqFt?.value)) {
      this.inputForm.controls.homeTotalArea_SqFt?.patchValue(0); 
    }
    if (this.inputForm.controls?.homeAge_Year?.value == null) {
      this.inputForm.controls?.homeAge_Year?.patchValue(0); 
      this.inputForm.controls?.homeAge_Month.patchValue(0); 
      this.isValidYear = true;
    }
    if(this.inputForm.valid && this.isValidYear){
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressGeneraldetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        if(!data.hasException){
          this.moveToNextFormEvent.emit();
        }
      });
    }
    this.submitted = true;
  }
  onChangeFoorTypeCheckBox(event: any) {
    this.inputForm.controls.floorTypesArray.patchValue(this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.inputForm.controls.floorTypesArray.value));
  }

  chaeckValidYear(){
    this.validYear = (new Date()).getFullYear() - 300;
    this.currentYear = (new Date()).getFullYear();
    if (this.inputForm.controls?.homeAge_Year?.value == 0) {
      this.inputForm.controls?.homeAge_Year?.patchValue(Number(this.inputForm.controls?.homeAge_Year?.value?.toString().slice(0,1))); 
    }
    if (this.inputForm.controls.homeAge_Year?.value?.toString().length > 4) {
      this.inputForm.controls.homeAge_Year?.patchValue(Number(this.inputForm.controls.homeAge_Year?.value?.toString().slice(0,4))); 
    }
    if((new Date()).getFullYear() - this.inputForm.controls?.homeAge_Year?.value < 300){
      this.isValidYear = true;
      this.inputForm.controls.homeAge_Month?.patchValue((new Date()).getFullYear() - this.inputForm.controls.homeAge_Year?.value);
    }
    else{
      this.isValidYear = false;
      this.inputForm.controls.homeAge_Month?.patchValue((new Date()).getFullYear() - this.inputForm.controls?.homeAge_Year?.value);
    }
    if((new Date()).getFullYear() - this.inputForm.controls.homeAge_Year?.value < 0){
      this.isValidYear = false;
      this.inputForm.controls.homeAge_Month?.patchValue((new Date()).getFullYear() - this.inputForm.controls.homeAge_Year?.value);
    }
    if (this.inputForm.controls?.homeAge_Year?.value == null) {
      this.isValidYear = true; 
      this.inputForm.controls?.homeAge_Month.patchValue(0); 
    }
   
  }
  chaeckValidArea(){
    if (this.inputForm.controls.homeTotalArea_SqFt?.value == 0) {
      this.inputForm.controls.homeTotalArea_SqFt?.patchValue(Number(this.inputForm.controls.homeTotalArea_SqFt?.value?.toString().slice(0,1))); 
    }
    if (this.inputForm.controls.homeTotalArea_SqFt?.value?.toString().length > 13) {
      this.inputForm.controls.homeTotalArea_SqFt?.patchValue(Number(this.inputForm.controls.homeTotalArea_SqFt?.value?.toString().slice(0,13))); 
    }
    if(this.inputForm.controls.homeTotalArea_SqFt.value == null){
      this.inputForm.controls.homeTotalArea_SqFt?.patchValue(Number(this.inputForm.controls.homeTotalArea_SqFt?.value?.toString().slice(0,1)));
    }
    if(this.inputForm.controls.homeTotalArea_SqFt.value < 0){
      this.inputForm.controls.homeTotalArea_SqFt?.patchValue(Number(this.inputForm.controls.homeTotalArea_SqFt?.value?.toString().slice(0,1)));
    }
  }

  onReset() {
    this.submitted = false;
    this.inputForm.reset();
  }
  onEditClick(){
    this.wantToEdit=true;
  }
}
