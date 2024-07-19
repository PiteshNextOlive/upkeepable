import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHomeAddressCoolingDetail, IHomeAddressCoolingDetailParms } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
import { SimpleChanges } from '@angular/core';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-home-address-cooling-detail',
  templateUrl: './home-address-cooling-detail.component.html',
  styleUrls: ['./home-address-cooling-detail.component.css']
})
export class HomeAddressCoolingDetailComponent implements OnInit {
  tempValue: number = 70;
  //thermostatTem: boolean = false;
  options1:any;
  options: Options = {
    floor: 50,
    ceil: 90,
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
      return '<b>' + value +'<span class="slider-tab-text">&#8457;</span></b>'
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
  coolingDetailParmsArray: IHomeAddressCoolingDetailParms[] = [];
  coolingSystemTypeEnum: EnumJsonTemplate[] = [];
  coolingSystemUsageFrequencyTypeEnum: EnumJsonTemplate[] = [];
  coolingSystemAreaTypeEnum: EnumJsonTemplate[] = [];
  homeAddressCoolingDetailId: number = 0;
  @Input() homeOwnerAddressAttributeRefId: number;
  @Input() homeAddressCoolingDetailList: IHomeAddressCoolingDetail[];
  @Input() homeOwnerAddressDetailStatusType: number;
  @Input() mainCategory: IHomeVariableMainCategory;
  @Output() moveToNextFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<any>();

  subCategories:IHomeVariableSubCategory[]=[];

  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    private router: Router,
    public toastService: AppToastService,
    private modalService: NgbModal,
    config: NgbModalConfig) {
      config.backdrop = 'static';
      config.keyboard = false;
    }
  submitted = false;
  enterKeyPressCount = 0;
  inputForm: TForm<IHomeAddressCoolingDetail> = this.fb.group({
    homeAddressCoolingDetailId: [0, Validators.required],
    thermostatTemperature: [null],
    // coolingSystemType: [1, Validators.required],
    // age_Year: [0, [Validators.required, Validators.min(0)]],
    // age_Month: [0, [Validators.required, Validators.min(0)]],
    // coolingSystemUsageFrequencyType: [1, Validators.required],
    // areaTypeArray: [[], Validators.required],
    dontHaveDetail: [0],
    coolingDetailParms: [[]],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressCoolingDetail>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges) {
    if(!changes.mainCategory.currentValue) return;
    this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    //this.getAllSubCategories(3);
   // console.log('Hd',this.homeAddressCoolingDetailList)
    if (this.homeAddressCoolingDetailList.length > 0 && this.homeAddressCoolingDetailId != 133) {
      this.homeAddressCoolingDetailId = this.homeAddressCoolingDetailList[0].homeAddressCoolingDetailId;
    }
    this.appHttpRequestHandlerService.httpGet({ homeAddressCoolingDetailId: this.homeAddressCoolingDetailId }, "HomeOwnerAddress", "GetHomeAddressCoolingDetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeAddressCoolingDetail>) => {
        this.coolingSystemTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "CoolingSystemTypeEnum");
        this.coolingSystemUsageFrequencyTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "CoolingSystemUsageFrequencyTypeEnum");
        this.coolingSystemAreaTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "CoolingSystemAreaTypeEnum");
        if (data.formModel.homeAddressCoolingDetailId != 0 && data.formModel.homeAddressCoolingDetailId != 133) {
          this.inputForm.patchValue(data.formModel);
          this.tempValue = this.inputForm.controls.thermostatTemperature.value;

          setTimeout(()=>{
            for (let i = 0; i < data.formModel.coolingDetailParms.length; i++) {
              //console.log(data.formModel.coolingDetailParms[i]);

              (<HTMLSelectElement>document.getElementById('coolingSystemType_'+i)).value=data.formModel.coolingDetailParms[i].coolingSystemType.toString();
              (<HTMLSelectElement>document.getElementById('coolingSystemUsageFrequencyType_'+i)).value=data.formModel.coolingDetailParms[i].coolingSystemUsageFrequencyType.toString();
            }
          }, 500);


        }
        if (data.formModel.coolingDetailParms != undefined && data.formModel.homeAddressCoolingDetailId != 133) {
          this.coolingDetailParmsArray = data.formModel.coolingDetailParms;
        }
        else {
          this.coolingDetailParmsArray.push({ age_Month: 0, age_Year: 0, coolingSystemType: 0, coolingSystemUsageFrequencyType:0, thermostatTemperature:1 });
        }
        if (this.homeOwnerAddressDetailStatusType == 2) {
          this.inputForm.controls.dontHaveDetail.patchValue(1);
          this.options = Object.assign({}, this.options, {disabled: true});
          this.options1 = this.inputForm.get('thermostatTemperature').disable();
        }
      });
    this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
    this.inputForm.controls.homeAddressCoolingDetailId.patchValue(this.homeAddressCoolingDetailId);
  }
  getAllSubCategories(id: number){
   // debugger;
    if(id){
      this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {
        this.subCategories=data.responseDataModel;
        //this.options.floor=this.subCategories[1].homeVariableSubCategoryRangeItems[0].minRange;
        this.options = Object.assign({}, this.options, {
          floor: this.subCategories[1].homeVariableSubCategoryRangeItems[0].minRange,
          ceil: this.subCategories[1].homeVariableSubCategoryRangeItems[0].maxRange
        });
      });
    }
  }
  onSubmit() {
    if((this.inputForm.controls.thermostatTemperature.value < 55 && this.inputForm.controls.thermostatTemperature.value != null) || (this.inputForm.controls.thermostatTemperature.value > 95 && this.inputForm.controls.thermostatTemperature.value != null))
    {
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      this.submitted = false;
      return;
    }
    if(this.inputForm.controls.thermostatTemperature?.value == null)
    {
      this.inputForm.controls.thermostatTemperature.patchValue(55);
    }
    this.inputForm.controls.coolingDetailParms.patchValue(this.coolingDetailParmsArray);
    this.submitted = true;
  //   var invalidAgeInputs = this.coolingDetailParmsArray?.map((e, i) => (e.age_Month == 0 && e.age_Year == 0) ? i : '').filter(String);
  //   var invalidTypeInputs = this.coolingDetailParmsArray?.map((e, i) => (e.coolingSystemType==0) ? i : '').filter(String);
  //   var invalidFreqTypeInputs = this.coolingDetailParmsArray?.map((e, i) => (e.coolingSystemUsageFrequencyType==0) ? i : '').filter(String);
  //   if(this.inputForm.controls?.dontHaveDetail?.value == 0){
  //   if(invalidAgeInputs?.length > 0 || invalidTypeInputs?.length > 0 || invalidFreqTypeInputs?.length > 0){
  //     return;
  //   }
  // }
    //this.inputForm.controls.thermostatTemperature.patchValue(this.tempValue);
    if (this.enterKeyPressCount > 1) {
      return;
    }
    if (this.inputForm.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressCoolingDetail").pipe(takeUntil(this.ngUnsubscribe))
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.enterKeyPressCount++;
    }
  }
  onAddNewHomeDetailParam() {
    this.coolingDetailParmsArray.push({ age_Month: 0, age_Year: 0, coolingSystemType: 0, coolingSystemUsageFrequencyType:0, thermostatTemperature:1 });
  }
  chaeckValidTemp(){
    if (this.inputForm.controls.thermostatTemperature?.value == 0 && this.inputForm.controls.thermostatTemperature.value != null) {
     return false;
    }
    if(this.inputForm.controls.thermostatTemperature.value < 55 && this.inputForm.controls.thermostatTemperature.value != null ){
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      return false;
    }
    if(this.inputForm.controls.thermostatTemperature.value > 95 && this.inputForm.controls.thermostatTemperature.value != null ){
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      return false;
    }
    // if(this.inputForm.controls.thermostatTemperature.value == null ){
    //   return false;
    // }
    (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
    return true;
  }
  onChangeHomeDetailParm(index: number, type: string) {
    let elementValue = Number((<HTMLInputElement>document.getElementById(type + '_' + index)).value);
    if (type == 'age_Month') {
      this.coolingDetailParmsArray[index].age_Month = elementValue;
    }
    else if (type == 'age_Year') {
      this.coolingDetailParmsArray[index].age_Year = elementValue;
    }
    else if (type == 'coolingSystemType') {
      this.coolingDetailParmsArray[index].coolingSystemType = elementValue;
    }
    else if (type == 'coolingSystemUsageFrequencyType') {
      this.coolingDetailParmsArray[index].coolingSystemUsageFrequencyType = elementValue;
    }

    // if (this.coolingDetailParmsArray[index].age_Month == 0 && this.coolingDetailParmsArray[index].age_Year == 0) {
    //   (<HTMLElement>document.getElementById('ageError_' + index)).style.display = 'block';
    // }
    // else {
    //   (<HTMLElement>document.getElementById('ageError_' + index)).style.display = 'none';
    // }

    // if (this.coolingDetailParmsArray[index].coolingSystemType == 0) {
    //   (<HTMLElement>document.getElementById('coolingSystemTypeError_' + index)).style.display = 'block';
    // }
    // else {
    //   (<HTMLElement>document.getElementById('coolingSystemTypeError_' + index)).style.display = 'none';
    // }

    // if (this.coolingDetailParmsArray[index].coolingSystemUsageFrequencyType == 0) {
    //   (<HTMLElement>document.getElementById('coolingSystemUsageFrequencyTypeError_' + index)).style.display = 'block';
    // }
    // else {
    //   (<HTMLElement>document.getElementById('coolingSystemUsageFrequencyTypeError_' + index)).style.display = 'none';
    // }
  }
  onRemoveHomeDetailParm(index: number) {
    this.coolingDetailParmsArray.splice(index, 1);
  }
  onClickDontHave(event) {
    if (event.target.checked) {
      this.inputForm.controls.dontHaveDetail.patchValue(1);
      this.tempValue=this.subCategories[1].homeVariableSubCategoryRangeItems[0].minRange;
      //this.options = Object.assign({}, this.options, {disabled: true});
      this.options1 = this.inputForm.get('thermostatTemperature').disable();
      this.coolingDetailParmsArray = [{ age_Month: 0, age_Year: 0, coolingSystemType:0, coolingSystemUsageFrequencyType:0, thermostatTemperature:0}];


    }
    else {
      this.inputForm.controls.dontHaveDetail.patchValue(0);
      this.options = Object.assign({}, this.options, {disabled: false});
      this.options1 = this.inputForm.get('thermostatTemperature').enable();
    }
    //this.disableControlByClassName("coolParm", event.target.checked);
    // var x = (<HTMLCollection>document.getElementsByClassName("coolParm"));
    // console.log(x)
    // var i;
    // for (i = 0; i < x.length; i++) {
    //   if(event.target.checked){
    //     (<HTMLElement>x[i]).setAttribute("disabled", "disabled");
    //   }
    //   else{
    //     (<HTMLElement>x[i]).removeAttribute("disabled");
    //   }
    // }

  }

  disableControlByClassName(className: string, boolVal: boolean) {
    let elements = (<HTMLCollection>document.getElementsByClassName(className));
    var i;
    for (i = 0; i < elements.length; i++) {
      if (boolVal) {

        (<HTMLElement>elements[i]).setAttribute("disabled", "disabled");
      }
      else {
        (<HTMLElement>elements[i]).removeAttribute("disabled");
      }
    }
  }

  onReset() {
    this.submitted = false;
    this.inputForm.reset();
  }
  onModelYesClick() {
    this.onAddNewHomeDetailParam();
    this.modalService.dismissAll();
  }
  onModelNoClick() {
    this.onSubmit();
    this.modalService.dismissAll();
  }
  closeModalClick() {
    this.modalService.dismissAll();
  }
  open(content) {
    this.onSubmit();
    // if (this.inputForm.controls.dontHaveDetail.value == 1) {
    //   this.onSubmit();
    // }
    // else{
    //   var invalidAgeInputs = this.coolingDetailParmsArray.map((e, i) => (e.age_Month == 0 && e.age_Year == 0) ? i : '').filter(String);
    //   var invalidTypeInputs = this.coolingDetailParmsArray.map((e, i) => (e.coolingSystemType==0) ? i : '').filter(String);
    //   var invalidFreqTypeInputs = this.coolingDetailParmsArray.map((e, i) => (e.coolingSystemUsageFrequencyType==0) ? i : '').filter(String);
      

    //   var errorAllElements = (<HTMLCollection>document.getElementsByClassName('errorText'));
    //   for (var i = 0; i < errorAllElements.length; i++) {
    //     (<HTMLElement>errorAllElements[i]).style.display = 'none';
    //   }
    //   if (invalidAgeInputs.length > 0 && this.inputForm.controls.dontHaveDetail.value==0) {
    //     invalidAgeInputs.forEach(element => {
    //       (<HTMLElement>document.getElementById('ageError_' + element)).style.display = 'block';
    //     });
    //   }

    //   if (invalidTypeInputs.length > 0 && this.inputForm.controls.dontHaveDetail.value==0) {
    //     invalidTypeInputs.forEach(element => {
    //       (<HTMLElement>document.getElementById('coolingSystemTypeError_' + element)).style.display = 'block';
    //     });
    //   }
    //   if (invalidFreqTypeInputs.length > 0 && this.inputForm.controls.dontHaveDetail.value==0) {
    //     invalidFreqTypeInputs.forEach(element => {
    //       (<HTMLElement>document.getElementById('coolingSystemUsageFrequencyTypeError_' + element)).style.display = 'block';
    //     });
    //   }
    //   if(!this.inputForm.value.thermostatTemperature){
    //    // this.thermostatTem = true;
    //    (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'block';
    //    }
    //   if(invalidAgeInputs.length==0 && invalidTypeInputs.length==0 && invalidFreqTypeInputs.length==0 && this.inputForm.value.thermostatTemperature>=55){
    //     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => { }, (reason) => { });
    //   }
    // }
  }
}
