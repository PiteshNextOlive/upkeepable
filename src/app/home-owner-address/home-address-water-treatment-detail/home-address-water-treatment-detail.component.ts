import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHomeAddressWaterTreatmentDetail } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
@Component({
  selector: 'app-home-address-water-treatment-detail',
  templateUrl: './home-address-water-treatment-detail.component.html',
  styleUrls: ['./home-address-water-treatment-detail.component.css']
})
export class HomeAddressWaterTreatmentDetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  waterTreatmentHeatingTypeEnum: EnumJsonTemplate[] = [];
  waterTreatmentFilterTypeEnum: EnumJsonTemplate[] = [];
  waterTreatmentSoftenerTypeEnum: EnumJsonTemplate[] = [];
  //waterTreatmentAreaTypeEnum: EnumJsonTemplate[] = [];
  homeAddressWaterTreatmentDetailId: number = 0;
  @Input() homeOwnerAddressAttributeRefId: number;
  @Input() homeAddressWaterTreatmentDetailList: IHomeAddressWaterTreatmentDetail[];
  @Input() mainCategory: IHomeVariableMainCategory;
  @Output() moveToNextFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<any>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router) { }
  submitted = false;

  inputForm: TForm<IHomeAddressWaterTreatmentDetail> = this.fb.group({
    homeAddressWaterTreatmentDetailId: [0, Validators.required],
    waterTreatmentHeatingType: [0],
    heatingTemperature: [0],
    isHeatingTemperatureKnown: [1],
    waterTreatmentFilterType: [0],
    filterAge: [0],
    isFilterAgeKnown: [1],
    waterTreatmentSoftenerType: [3],
    //areaTypeArray: [[], Validators.required],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressWaterTreatmentDetail>;

  get formControls() { return this.inputForm.controls; }
  subCategories:IHomeVariableSubCategory[]=[];
  ngOnInit(): void {}
  ngOnChanges(){
    this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    if (this.homeAddressWaterTreatmentDetailList.length > 0 && this.homeOwnerAddressAttributeRefId != 13166) {
      this.homeAddressWaterTreatmentDetailId = this.homeAddressWaterTreatmentDetailList[0].homeAddressWaterTreatmentDetailId;
    }
    this.appHttpRequestHandlerService.httpGet({ homeAddressWaterTreatmentDetailId: this.homeAddressWaterTreatmentDetailId }, "HomeOwnerAddress", "GetHomeAddressWaterTreatmentDetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeAddressWaterTreatmentDetail>) => {
        this.waterTreatmentHeatingTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "WaterTreatmentHeatingTypeEnum");
        this.waterTreatmentFilterTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "WaterTreatmentFilterTypeEnum");
        this.waterTreatmentSoftenerTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "WaterTreatmentSoftenerTypeEnum");
        //this.waterTreatmentAreaTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "WaterTreatmentAreaTypeEnum");
        if (data.formModel.homeAddressWaterTreatmentDetailId != 0 && data.formModel.homeOwnerAddressAttributeRefId != 13166) {
          this.inputForm.patchValue(data.formModel);
        }
      });
    this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
    this.inputForm.controls.homeAddressWaterTreatmentDetailId.patchValue(this.homeAddressWaterTreatmentDetailId);
  }

  getAllSubCategories(id: number){
    if(id){
      this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {
        this.subCategories=data.responseDataModel;
        //console.log(this.subCategories)
      });
    }
  }
  onSubmit() {
    if(this.inputForm.controls.heatingTemperature.value == null || this.inputForm.controls.heatingTemperature.value.toString() == "")
    {
      this.inputForm.controls.heatingTemperature.patchValue(0);
    }
    this.submitted = true;
    //console.log(this.inputForm.controls.isFilterAgeKnown.value, this.inputForm.controls.filterAge.value)
    // if (this.inputForm.valid && !(this.inputForm.controls.isFilterAgeKnown.value==1 && this.inputForm.controls.filterAge.value==0)) {
    //   console.log('can save')
    // }

    // if (this.inputForm.valid && !(this.inputForm.controls.isFilterAgeKnown.value==1 && this.inputForm.controls.filterAge.value==0)) {
      if (this.inputForm.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressWaterTreatmentDetail").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          if (!data.hasException) {
            this.moveToNextFormEvent.emit();
          }
        });
    }
  }
  // onChangeAreaTypeCheckBox(event: any) {
  //   this.inputForm.controls.areaTypeArray.patchValue(this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.inputForm.controls.areaTypeArray.value));
  // }
  onClickDontHave(event, control) {
    if (event.target.checked) {
      if(control=='heatingTemperature'){
        this.inputForm.controls.isHeatingTemperatureKnown.patchValue(0);
        this.inputForm.controls.heatingTemperature.patchValue(0);
      }
      else if(control=='filterAge'){
        this.inputForm.controls.isFilterAgeKnown.patchValue(0);
        this.inputForm.controls.filterAge.patchValue(0);
      }
      
    }
    else {
      if(control=='heatingTemperature'){
        this.inputForm.controls.isHeatingTemperatureKnown.patchValue(1);
        this.inputForm.controls.heatingTemperature.patchValue('');
      }
      else if(control=='filterAge'){
          this.inputForm.controls.isFilterAgeKnown.patchValue(1);
        }
    }
  }
  onReset() {
    this.submitted = false;
    this.inputForm.reset();
  }
  // onIsHeatingTemperatureKnown(event){
  //   console.log(event.target.checked)
  //   this.inputForm.controls.isHeatingTemperatureKnown.patchValue(false);
  // }
}
