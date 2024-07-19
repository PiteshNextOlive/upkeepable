import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { min, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHomeAddressApplianceDetail } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
@Component({
  selector: 'app-home-address-appliance-detail',
  templateUrl: './home-address-appliance-detail.component.html',
  styleUrls: ['./home-address-appliance-detail.component.css']
})
export class HomeAddressApplianceDetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  washingMachineTypeEnum: EnumJsonTemplate[] = [];
  dryerTypeEnum: EnumJsonTemplate[] = [];
  rangeHoodTypeEnum: EnumJsonTemplate[] = [];
  dishwasherTypeEnum: EnumJsonTemplate[] = [];
  ovenTypeEnum: EnumJsonTemplate[] = [];
  stoveTypeEnum: EnumJsonTemplate[] = [];
  microwaveTypeEnum: EnumJsonTemplate[] = [];
  smartLightTypeEnum: EnumJsonTemplate[] = [];
  homeAddressApplianceDetailId: number = 0;

  @Input() homeOwnerAddressAttributeRefId : number;
  @Input() homeAddressApplianceDetailList: IHomeAddressApplianceDetail[];
  @Input() mainCategory: IHomeVariableMainCategory;
  @Output() moveToNextFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<any>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router) { }
  submitted = false;

  inputForm: TForm<IHomeAddressApplianceDetail> = this.fb.group({
    homeAddressApplianceDetailId: [0, Validators.required],
    hasSmartLight: [3],
    hasWashingMachine: [3],
    washingMachineType: [0],
    hasDryer: [3],
    dryerType: [0],
    hasRangeHood: [3],
    rangeHoodType: [3],
    hasDishwasher: [3],
    dishwasherType: [3],
    hasOven: [3],
    ovenType: [3],
    hasStove: [3],
    stoveType: [0],
    hasMicrowave: [3],
    microwaveType: [3],
    smartLightTypeArray: [[]],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressApplianceDetail>;

  get formControls() { return this.inputForm.controls; }
  subCategories:IHomeVariableSubCategory[]=[];
  ngOnInit(): void {}
  ngOnChanges(){
    this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    if (this.homeAddressApplianceDetailList.length > 0 && this.homeAddressApplianceDetailId != 129) {
      this.homeAddressApplianceDetailId = this.homeAddressApplianceDetailList[0].homeAddressApplianceDetailId;
    }
    this.appHttpRequestHandlerService.httpGet({ homeAddressApplianceDetailId: this.homeAddressApplianceDetailId}, "HomeOwnerAddress", "GetHomeAddressApplianceDetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeAddressApplianceDetail>) => {
        this.washingMachineTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "WashingMachineTypeEnum");
        this.dryerTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "DryerTypeEnum");
        this.rangeHoodTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "RangeHoodTypeEnum");
        this.dishwasherTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "DishwasherTypeEnum");
        this.ovenTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "OvenTypeEnum");
        this.stoveTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "StoveTypeEnum");
        this.microwaveTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "MicrowaveTypeEnum");
        this.smartLightTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "SmartLightTypeEnum");
        if(data.formModel.homeAddressApplianceDetailId!=0 && data.formModel.homeAddressApplianceDetailId != 129){
          this.inputForm.patchValue(data.formModel);
          this.inputForm.controls.washingMachineType.patchValue((data.formModel.hasWashingMachine==0? 0:data.formModel.washingMachineType))
          this.inputForm.controls.dryerType.patchValue((data.formModel.hasDryer==0? 0 :data.formModel.dryerType))
          this.inputForm.controls.stoveType.patchValue((data.formModel.hasStove==0? 0 :data.formModel.stoveType))
        }
      });
      this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
      this.inputForm.controls.homeAddressApplianceDetailId.patchValue(this.homeAddressApplianceDetailId);
  }

  getAllSubCategories(id: number){
    if(id){
      this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {
        this.subCategories=data.responseDataModel;
      });
    }
  }

  onSubmit() {
    this.submitted = true;

  //   if(this.formControls.hasWashingMachine.value==0){
  //     this.inputForm.controls.washingMachineType.patchValue(this.subCategories[3]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
  //   }

  //   if(this.formControls.hasDryer.value==0){
  //     this.inputForm.controls.dryerType.patchValue(this.subCategories[5]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
  //   }
    
  //   if(this.formControls.hasStove.value==0){
  //     this.inputForm.controls.stoveType.patchValue(this.subCategories[10]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
  //   }
  //  // console.log(this.inputForm.value)
   
  //   this.formControls.dishwasherType?.value==""? this.inputForm.controls.dishwasherType.patchValue(1): this.inputForm.controls.dishwasherType.patchValue(this.formControls.dishwasherType.value);
  //   this.formControls.dryerType?.value==""? this.inputForm.controls.dryerType.patchValue(this.subCategories[5]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId) : this.inputForm.controls.dryerType.patchValue(this.formControls.dryerType.value);
  //   this.formControls.hasDishwasher?.value==""? this.inputForm.controls.hasDishwasher.patchValue(1): this.inputForm.controls.hasDishwasher.patchValue(this.formControls.hasDishwasher.value);
  //   this.formControls.hasDryer?.value==""? this.inputForm.controls.hasDryer.patchValue(1): this.inputForm.controls.hasDryer.patchValue(this.formControls.hasDryer.value);
  //   this.formControls.hasMicrowave?.value==""? this.inputForm.controls.hasMicrowave.patchValue(1): this.inputForm.controls.hasMicrowave.patchValue(this.formControls.hasMicrowave.value);
  //   this.formControls.hasOven?.value==""? this.inputForm.controls.hasOven.patchValue(1): this.inputForm.controls.hasOven.patchValue(this.formControls.hasOven.value);
  //   this.formControls.hasRangeHood?.value==""? this.inputForm.controls.hasRangeHood.patchValue(1): this.inputForm.controls.hasRangeHood.patchValue(this.formControls.hasRangeHood.value);
  //   this.formControls.hasSmartLight?.value==""? this.inputForm.controls.hasSmartLight.patchValue(1): this.inputForm.controls.hasSmartLight.patchValue(this.formControls.hasSmartLight.value);
  //   this.formControls.hasStove?.value==""? this.inputForm.controls.hasStove.patchValue(1): this.inputForm.controls.hasStove.patchValue(this.formControls.hasStove.value);
  //   this.formControls.hasWashingMachine?.value==""? this.inputForm.controls.hasWashingMachine.patchValue(1): this.inputForm.controls.hasWashingMachine.patchValue(this.formControls.hasWashingMachine.value);
  //   this.formControls.ovenType?.value==""? this.inputForm.controls.ovenType.patchValue(1): this.inputForm.controls.ovenType.patchValue(this.formControls.ovenType.value);
  //   this.formControls.rangeHoodType?.value==""? this.inputForm.controls.rangeHoodType.patchValue(1): this.inputForm.controls.rangeHoodType.patchValue(this.formControls.rangeHoodType.value);
  //   this.formControls.washingMachineType?.value==""? this.inputForm.controls.washingMachineType.patchValue(this.subCategories[3]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId): this.inputForm.controls.washingMachineType.patchValue(this.formControls.washingMachineType.value);
  //   this.formControls.microwaveType?.value==""? this.inputForm.controls.microwaveType.patchValue(1): this.inputForm.controls.microwaveType.patchValue(this.formControls.microwaveType.value);
   
  //   this.formControls.stoveType?.value==""? this.inputForm.controls.stoveType.patchValue(this.subCategories[10]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId): this.inputForm.controls.stoveType.patchValue(this.formControls.stoveType.value);
  //  // this.formControls.microwaveTypeEnum.value==""? this.inputForm.controls.microwaveTypeEnum.patchValue(1): this.inputForm.controls.microwaveTypeEnum.patchValue(this.formControls.microwaveTypeEnum.value);
  // if((this.inputForm?.value?.smartLightTypeArray?.length==0 || this.inputForm?.value?.smartLightTypeArray==null)&& this.formControls.hasSmartLight?.value == 1){
  //   this.inputForm.controls.smartLightTypeArray.patchValue([this.subCategories[1]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId]);
  //  // this.inputForm.value.smartLightTypeArray = ([this.subCategories[1]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId]);
  // }
    if (this.inputForm.valid) {
     // if(!(this.formControls.hasSmartLight.value && this.formControls.hasSmartLight.value==1 &&  (!this.formControls.smartLightTypeArray.value || this.formControls.smartLightTypeArray?.value?.length==0))){
      //  if((this.formControls.hasWashingMachine.value == 0 && this.formControls.washingMachineType.value == 0) || (this.formControls.hasWashingMachine.value > 0 && this.formControls.washingMachineType.value > 0)){
       //   if((this.formControls.hasDryer.value == 0 && this.formControls.dryerType.value == 0) || (this.formControls.hasDryer.value > 0 && this.formControls.dryerType.value > 0)){
        //    if((this.formControls.hasStove.value == 0 && this.formControls.stoveType.value == 0) || (this.formControls.hasStove.value > 0 && this.formControls.stoveType.value > 0)){
              this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressApplianceDetail").pipe(takeUntil(this.ngUnsubscribe))
                .subscribe((data: GenericServiceResultTemplate) => {
                  this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
                  if (!data.hasException) {
                    this.moveToNextFormEvent.emit();
                  }
              });
          //  }
         // }
       // }
      //}
    }
  }
  onChangeASmartLightTypeCheckBox(event: any) {
    this.inputForm.controls.smartLightTypeArray.patchValue(this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.inputForm.controls.smartLightTypeArray.value));
  }
  onChangeYesNo(controlToBeSet){
    if(controlToBeSet=='smartLightType'){
      this.inputForm.controls.smartLightTypeArray.patchValue([]);
    }
    else{
      this.inputForm.controls[controlToBeSet].patchValue(0);
    }
  }
  onReset() {
    this.submitted = false;
    this.inputForm.reset();
  }
}

