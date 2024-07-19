import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { LabelType, Options } from '@angular-slider/ngx-slider';
import { IHomeAddressHeatingDetail, IHomeAddressHeatingDetailParms } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
import { NgbModal, NgbModalConfig, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
import { SimpleChanges } from '@angular/core';
@Component({
  selector: 'app-home-address-heat-detail',
  templateUrl: './home-address-heat-detail.component.html',
  styleUrls: ['./home-address-heat-detail.component.css']
})
export class HomeAddressHeatDetailComponent implements OnInit {
  tempValue: number = 70;
 // thermostatTem: boolean = false;
  options1: any;
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
  heatingSystemTypeEnum: EnumJsonTemplate[] = [];
  // heatingSystemUsageFrequencyTypeEnum: EnumJsonTemplate[] = [];
  // heatingSystemAreaTypeEnum: EnumJsonTemplate[] = [];
  homeAddressHeatingDetailId: number = 0;
  heatingDetailParmsArray: IHomeAddressHeatingDetailParms[] = [];
  @Input() homeOwnerAddressAttributeRefId: number;
  @Input() homeAddressHeatingDetailList: IHomeAddressHeatingDetail[];
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
  inputForm: TForm<IHomeAddressHeatingDetail> = this.fb.group({
    homeAddressHeatingDetailId: [0, Validators.required],
    dontHaveHeatingDetail: [0],
    thermostatTemperature: [null],
    heatingDetailParms: [[]],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressHeatingDetail>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void { }
  ngOnChanges(changes: SimpleChanges){
    if(!changes.mainCategory.currentValue) return;
    //console.log(changes);
    this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    //console.log("hy",this.homeAddressHeatingDetailList)
    if (this.homeAddressHeatingDetailList.length > 0 && this.homeAddressHeatingDetailId != 10188) {
      this.homeAddressHeatingDetailId = this.homeAddressHeatingDetailList[0].homeAddressHeatingDetailId;
    }
    this.appHttpRequestHandlerService.httpGet({ homeAddressHeatingDetailId: this.homeAddressHeatingDetailId }, "HomeOwnerAddress", "GetHomeAddressHeatingDetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeAddressHeatingDetail>) => {
        this.heatingSystemTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HeatingSystemTypeEnum");
        //this.heatingSystemUsageFrequencyTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HeatingSystemUsageFrequencyTypeEnum");
        //this.heatingSystemAreaTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HeatingSystemAreaTypeEnum");
        //console.log('dm',data.formModel);
        if (data.formModel.homeAddressHeatingDetailId != 0 && data.formModel.homeAddressHeatingDetailId != 10188) {
          this.inputForm.patchValue(data.formModel);
          this.tempValue = this.inputForm.controls.thermostatTemperature.value;
         // console.log('TV',this.tempValue);
          setTimeout(()=>{
            for (let i = 0; i < data.formModel.heatingDetailParms.length; i++) {
              (<HTMLSelectElement>document.getElementById('heatingSystemType_'+i)).value=data.formModel.heatingDetailParms[i].heatingSystemType.toString();
            }
          }, 500);
        }
          //console.log("HD",data.formModel.heatingDetailParms)
        if (data.formModel.heatingDetailParms != undefined && data.formModel.homeAddressHeatingDetailId != 10188) {
          this.heatingDetailParmsArray = data.formModel.heatingDetailParms;
        }
        else {
          this.onAddNewHomeDetailParam();
        }
        if (this.homeOwnerAddressDetailStatusType == 2) {
          this.inputForm.controls.dontHaveHeatingDetail.patchValue(1);
          this.options = Object.assign({}, this.options, {disabled: true});
          this.options1 = this.inputForm.get('thermostatTemperature').disable();
        }
      });
      //console.log('Opt',this.options);
      //console.log('Hp',this.heatingDetailParmsArray);
    this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
    this.inputForm.controls.homeAddressHeatingDetailId.patchValue(this.homeAddressHeatingDetailId);
  }
  
  getAllSubCategories(id: number){
    if(id){
      this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {
        this.subCategories=data.responseDataModel;
        this.options = Object.assign({}, this.options, {
          floor: this.subCategories[3].homeVariableSubCategoryRangeItems[0].minRange,
          ceil: this.subCategories[3].homeVariableSubCategoryRangeItems[0].maxRange
        });
        console.log('sc',this.subCategories)
      });
    }
  }
  onSubmit() {
//     if(this.heatingDetailParmsArray[1].age_Month === 0 &&  this.heatingDetailParmsArray[1].age_Year === 0 && this.heatingDetailParmsArray[1].heatingSystemType === 0)
//     {
// console.log('true');
//     }
    if((this.inputForm.controls.thermostatTemperature.value < 55 && this.inputForm.controls.thermostatTemperature.value != null) || (this.inputForm.controls.thermostatTemperature.value > 95 && this.inputForm.controls.thermostatTemperature.value != null))
    {
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      this.submitted = false;
      return;
    }
    if(this.inputForm.controls.thermostatTemperature.value == null)
    {
      this.inputForm.controls.thermostatTemperature.patchValue(55);
    }
    this.inputForm.controls.heatingDetailParms.patchValue(this.heatingDetailParmsArray);
   // console.log(this.inputForm.controls.heatingDetailParms.value)
    this.submitted = true;
    // var allValidationOk=true;
    // var i=0;
    // console.log(this.heatingDetailParmsArray)
    // this.heatingDetailParmsArray.forEach(element => {
    //   if (this.heatingDetailParmsArray[i].age_Month == 0 && this.heatingDetailParmsArray[i].age_Year == 0) {
    //     (<HTMLElement>document.getElementById('ageError_' + i)).style.display = 'block';
    //     allValidationOk=false;
    //   }
    //   else {
    //     (<HTMLElement>document.getElementById('ageError_' + i)).style.display = 'none';
    //   }
  
    //   if (this.heatingDetailParmsArray[i].heatingSystemType<=0) {
    //     (<HTMLElement>document.getElementById('heatingSystemTypeError_' + i)).style.display = 'block';
    //     allValidationOk=false;
    //   }
    //   else {
    //     (<HTMLElement>document.getElementById('heatingSystemTypeError_' + i)).style.display = 'none';
    //   }
    //   i++;
    // });
    //this.inputForm.controls.thermostatTemperature.patchValue(this.tempValue);
    // var invalidAgeInputs = this.heatingDetailParmsArray?.map((e, i) => (e.age_Month == 0 && e.age_Year == 0) ? i : '').filter(String);
    // var invalidTypeInputs = this.heatingDetailParmsArray?.map((e, i) => (e.heatingSystemType==0) ? i : '').filter(String);
    // var errorAllElements = (<HTMLCollection>document.getElementsByClassName('errorText'));
    // if(this.inputForm.controls.dontHaveHeatingDetail?.value == 0){
    //   if(invalidAgeInputs?.length > 0 || invalidTypeInputs?.length > 0){
    //     return;
    //   }
    // }
   if(this.enterKeyPressCount > 1) 
   {
    return;
   }
    if (this.inputForm.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressHeatingDetail").pipe(takeUntil(this.ngUnsubscribe))
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

  onAddNewHomeDetailParam() {
    if(this.inputForm.controls.dontHaveHeatingDetail.value==1 && this.heatingDetailParmsArray.length==0){
      this.heatingDetailParmsArray.push({ age_Month: 0, age_Year: 0, heatingSystemType: 0, thermostatTemperature:0 });
    }
    if(this.inputForm.controls.dontHaveHeatingDetail.value==0){
      this.heatingDetailParmsArray.push({ age_Month: 0, age_Year: 0, heatingSystemType: 0,thermostatTemperature: 0 });
    }

  }
  onChangeHomeDetailParm(index: number, type: string) {
    let elementValue = Number((<HTMLInputElement>document.getElementById(type + '_' + index)).value);
    if (type == 'age_Month') {
      this.heatingDetailParmsArray[index].age_Month = elementValue;
    }
    else if (type == 'age_Year') {
      this.heatingDetailParmsArray[index].age_Year = elementValue;
    }
    else if (type == 'heatingSystemType') {
      this.heatingDetailParmsArray[index].heatingSystemType = elementValue;
    }

    // if (this.heatingDetailParmsArray[index].age_Month == 0 && this.heatingDetailParmsArray[index].age_Year == 0) {
    //   (<HTMLElement>document.getElementById('ageError_' + index)).style.display = 'block';
    // }
    // else {
    //   (<HTMLElement>document.getElementById('ageError_' + index)).style.display = 'none';
    // }

    // if (this.heatingDetailParmsArray[index].heatingSystemType<=0) {
    //   (<HTMLElement>document.getElementById('heatingSystemTypeError_' + index)).style.display = 'block';
    // }
    // else {
    //   (<HTMLElement>document.getElementById('heatingSystemTypeError_' + index)).style.display = 'none';
    // }

  }
  onRemoveHomeDetailParm(index: number) {
    this.heatingDetailParmsArray.splice(index, 1);
  }
  chaeckValidTemp(){
    // if(this.inputForm.controls.thermostatTemperature.value == null ){
    //   return true;
    // }
    if (this.inputForm.controls.thermostatTemperature?.value == 0 &&  this.inputForm.controls.thermostatTemperature.value != null) {
     return false;
    }
    if(this.inputForm.controls.thermostatTemperature.value < 55 &&  this.inputForm.controls.thermostatTemperature.value != null){
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      return false;
    }
    if(this.inputForm.controls.thermostatTemperature.value > 95 &&  this.inputForm.controls.thermostatTemperature.value != null){
      (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
      return false;
    }
    (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'none';
    return false;
  }
  onClickDontHave(event) {
    if (event.target.checked) {
      this.inputForm.controls.dontHaveHeatingDetail.patchValue(1);
      this.tempValue=this.subCategories[3].homeVariableSubCategoryRangeItems[0].minRange;
      //this.options = Object.assign({}, this.options, {disabled: true});
      this.options1 = this.inputForm.get('thermostatTemperature').disable();
      this.heatingDetailParmsArray=[{ age_Month: 0, age_Year: 0, heatingSystemType: 0, thermostatTemperature:1 }];
    }
    else {
      this.inputForm.controls.dontHaveHeatingDetail.patchValue(0);
      //this.options = Object.assign({}, this.options, {disabled: false});
     this.options1 = this.inputForm.get('thermostatTemperature').enable();
    }
    //this.disableControlByClassName("heatParm", event.target.checked);
    // var x = (<HTMLCollection>document.getElementsByClassName("heatParm"));
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
  keyDownFunction(event) {
    if (event.keyCode === 13) {
      this.enterKeyPressCount++;
    }
  }
  open(content) {
    this.onSubmit();
    // if (this.inputForm.controls.dontHaveHeatingDetail.value == 1) {
    //   this.onSubmit();
    // }
    // else {

    //   var invalidAgeInputs = this.heatingDetailParmsArray.map((e, i) => (e.age_Month == 0 && e.age_Year == 0) ? i : '').filter(String);
    //   var invalidTypeInputs = this.heatingDetailParmsArray.map((e, i) => (e.heatingSystemType==0) ? i : '').filter(String);
    //   var errorAllElements = (<HTMLCollection>document.getElementsByClassName('errorText'));
    //   for (var i = 0; i < errorAllElements.length; i++) {
    //     (<HTMLElement>errorAllElements[i]).style.display = 'none';
    //   }
    //   if (invalidAgeInputs.length > 0 && this.inputForm.controls.dontHaveHeatingDetail.value==0) {
    //     invalidAgeInputs.forEach(element => {
    //       (<HTMLElement>document.getElementById('ageError_' + element)).style.display = 'block';
    //     });
    //   }
    //   if (invalidTypeInputs.length > 0 && this.inputForm.controls.dontHaveHeatingDetail.value==0) {
    //     invalidTypeInputs.forEach(element => {
    //       (<HTMLElement>document.getElementById('heatingSystemTypeError_' + element)).style.display = 'block';
    //     });
    //   }
    //   if(!this.inputForm.value.thermostatTemperature){
    //    //this.thermostatTem = true;
    //    (<HTMLElement>document.getElementById('thermostatTem')).style.display = 'block';
    //   }
    //   if(invalidAgeInputs.length==0 && invalidTypeInputs.length==0 && this.inputForm.value.thermostatTemperature>=55){
    //     this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => { }, (reason) => { });
    //   }
    // }
  }
}
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     