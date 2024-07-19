import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IHomeAddressOutsideDetail } from '../home-owner-address-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { Router } from '@angular/router';
import { AppToastService } from '../../toast/app-toast.service';
import { IHomeVariableMainCategory, IHomeVariableSubCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
@Component({
  selector: 'app-home-address-outside-detail',
  templateUrl: './home-address-outside-detail.component.html',
  styleUrls: ['./home-address-outside-detail.component.css']
})
export class HomeAddressOutsideDetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  grassTypeEnum: EnumJsonTemplate[] = [];
  fenseTypeEnum: EnumJsonTemplate[] = [];
  treeTypeEnum: EnumJsonTemplate[] = [];
  shrubsTypeEnum: EnumJsonTemplate[] = [];
  poolTypeEnum: EnumJsonTemplate[] = [];
  hotTubTypeEnum: EnumJsonTemplate[] = [];
  homeAddressOutsideDetailId: number = 0;
  @Input() homeOwnerAddressAttributeRefId: number;
  @Input() homeAddressOutsideDetailList: IHomeAddressOutsideDetail[];
  @Input() mainCategory: IHomeVariableMainCategory;
  @Output() moveToNextFormEvent = new EventEmitter<any>();
  @Output() closeFormEvent = new EventEmitter<any>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router) { }
  submitted = false;

  inputForm: TForm<IHomeAddressOutsideDetail> = this.fb.group({
    homeAddressOutsideDetailId: [0, Validators.required],
    hasLawn: [3],
    grassType: [0],
    hasFense: [3],
    fenseType: [0],
    hasSpinklers: [3],
    hasTrees: [3],
    treeType: [0],
    hasShrubs: [3],
    shrubsType: [3],
    hasPool: [3],
    poolType: [0],
    hasHotTub: [3],
    hotTubType: [0],
    lastModifiedOn: [new Date(), Validators.required],
    homeOwnerAddressAttributeRefId: [0, Validators.required]
  }) as TForm<IHomeAddressOutsideDetail>;

  get formControls() { return this.inputForm.controls; }
  subCategories:IHomeVariableSubCategory[]=[]
  ngOnInit(): void {}
  ngOnChanges(){
    if (this.homeAddressOutsideDetailList.length > 0 && this.homeAddressOutsideDetailId != 10126) {
      this.homeAddressOutsideDetailId = this.homeAddressOutsideDetailList[0].homeAddressOutsideDetailId;
      //this.inputForm.controls.homeAddressOutsideDetailId.patchValue(this.homeAddressOutsideDetailList[0].homeAddressOutsideDetailId)
    }

    this.getAllSubCategories(this.mainCategory?.homeVariableMainCategoryId);
    this.appHttpRequestHandlerService.httpGet({ homeAddressOutsideDetailId: this.homeAddressOutsideDetailId }, "HomeOwnerAddress", "GetHomeAddressOutsideDetail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IHomeAddressOutsideDetail>) => {
        this.grassTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "GrassTypeEnum");
        this.fenseTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "FenseTypeEnum");
        this.treeTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "TreeTypeEnum");
        this.shrubsTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "ShrubsTypeEnum");
        this.poolTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "PoolTypeEnum");
        this.hotTubTypeEnum = this.commonOpsService.getEnumItemsByEnumName(data.enumListTemplateLists, "HotTubTypeEnum");

        if (data.formModel.homeAddressOutsideDetailId != 0 && data.formModel.homeAddressOutsideDetailId != 10126) {

          setTimeout(()=>{
            this.inputForm.patchValue(data.formModel);
            this.inputForm.controls.grassType.patchValue((data.formModel.hasLawn==0? 0:data.formModel.grassType))
            this.inputForm.controls.fenseType.patchValue((data.formModel.hasFense==0? 0:data.formModel.fenseType))
            this.inputForm.controls.poolType.patchValue((data.formModel.hasPool==0? 0:data.formModel.poolType))
          }, 500);

          
        }

      });
    this.inputForm.controls.homeOwnerAddressAttributeRefId.patchValue(this.homeOwnerAddressAttributeRefId);
    
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
    this.submitted = true;
    // if(this.formControls.hasLawn.value==0){
    //   this.inputForm.controls.grassType.patchValue(this.subCategories[1]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
    // }

    // if(this.formControls.hasFense.value==0){
    //   this.inputForm.controls.fenseType.patchValue(this.subCategories[3]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
    // }
    
    // if(this.formControls.hasPool.value==0){
    //   this.inputForm.controls.poolType.patchValue(this.subCategories[8]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId);
    // }
    // this.formControls.hasLawn.value==""? this.inputForm.controls.hasLawn.patchValue(1): this.inputForm.controls.hasLawn.patchValue(this.formControls.hasLawn.value);
    // this.formControls.fenseType.value==""? this.inputForm.controls.fenseType.patchValue(this.subCategories[3]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId): this.inputForm.controls.fenseType.patchValue(this.formControls.fenseType.value);
    // this.formControls.grassType.value==""? this.inputForm.controls.grassType.patchValue(this.subCategories[1]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId): this.inputForm.controls.grassType.patchValue(this.formControls.grassType.value);
    // this.formControls.hasFense.value==""? this.inputForm.controls.hasFense.patchValue(1): this.inputForm.controls.hasFense.patchValue(this.formControls.hasFense.value);
    // this.formControls.hasHotTub.value==""? this.inputForm.controls.hasHotTub.patchValue(1): this.inputForm.controls.hasHotTub.patchValue(this.formControls.hasHotTub.value);
    // this.formControls.hasPool.value==""? this.inputForm.controls.hasPool.patchValue(1): this.inputForm.controls.hasPool.patchValue(this.formControls.hasPool.value);
    // this.formControls.hasShrubs.value==""? this.inputForm.controls.hasShrubs.patchValue(1): this.inputForm.controls.hasShrubs.patchValue(this.formControls.hasShrubs.value);
    // this.formControls.hasSpinklers.value==""? this.inputForm.controls.hasSpinklers.patchValue(1): this.inputForm.controls.hasSpinklers.patchValue(this.formControls.hasSpinklers.value);
    // this.formControls.hasTrees.value==""? this.inputForm.controls.hasTrees.patchValue(1): this.inputForm.controls.hasTrees.patchValue(this.formControls.hasTrees.value);
    // this.formControls.hotTubType.value==""? this.inputForm.controls.hotTubType.patchValue(1): this.inputForm.controls.hotTubType.patchValue(this.formControls.hotTubType.value);
    // this.formControls.poolType.value==""? this.inputForm.controls.poolType.patchValue(this.subCategories[8]?.homeVariableSubCategoryListItems[0].homeVariableSubCategoryListItemId): this.inputForm.controls.poolType.patchValue(this.formControls.poolType.value);
    // this.formControls.shrubsType.value==""? this.inputForm.controls.shrubsType.patchValue(1): this.inputForm.controls.shrubsType.patchValue(this.formControls.shrubsType.value);
    // this.formControls.treeType.value==""? this.inputForm.controls.treeType.patchValue(1): this.inputForm.controls.treeType.patchValue(this.formControls.treeType.value);
    if (this.inputForm.valid){
      //if((this.formControls.hasLawn.value == 0 && this.formControls.grassType.value == 0) || (this.formControls.hasLawn.value > 0 && this.formControls.grassType.value > 0)){
       // if((this.formControls.hasFense.value == 0 && this.formControls.fenseType.value == 0) || (this.formControls.hasFense.value > 0 && this.formControls.fenseType.value > 0)){
        //  if((this.formControls.hasPool.value == 0 && this.formControls.poolType.value == 0) || (this.formControls.hasPool.value > 0 && this.formControls.poolType.value > 0)){
            this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddUpdateHomeAddressOutsideDetail").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data: GenericServiceResultTemplate) => {
                this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
                if (!data.hasException) {
                  this.moveToNextFormEvent.emit();
                }
              });
         //   }
       // }
     // }
    }
  }
  onChangeAreaTypeCheckBox(event: any) {
    this.inputForm.controls.areaTypeArray.patchValue(this.commonOpsService.prepareCommaSeparatedCheckBoxValues(event, this.inputForm.controls.areaTypeArray.value));
  }

  onChangeYesNo(controlToBeSet){
    this.inputForm.controls[controlToBeSet].patchValue(0);
  }
  onReset() {
    this.submitted = false;
    this.inputForm.reset();
  }
}
