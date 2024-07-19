import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { IHomeOwnerAddressAttribute } from 'src/app/home-owner-address/home-owner-address-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { IHomeVariableMainCategory, IHomeVariableSubCategory, IHomeVariableSubCategoryListItem, IHomeVariableSubCategoryRangeItem } from './home-variable-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-home-variable-manager',
  templateUrl: './home-variable-manager.component.html',
  styleUrls: ['./home-variable-manager.component.css']
})
export class HomeVariableManagerComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  mainCategories:IHomeVariableMainCategory[]=[];
  subCategories:IHomeVariableSubCategory[]=[];
  inputFormMainCategory: TForm<IHomeVariableMainCategory> = this.fb.group({
    homeVariableMainCategoryId: [0, [Validators.required]],
    homeOwnerAddressDetailType: [0, Validators.required],
    title: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(80)]],
    iconName: ['', [Validators.required]],
    lastModifiedOn: [new Date(), Validators.required],
  }) as TForm<IHomeVariableMainCategory>;

  get formControlsMainCategory() { return this.inputFormMainCategory.controls; }


  inputFormSubCategory: TForm<IHomeVariableSubCategory> = this.fb.group({
    homeVariableSubCategoryId: [0, [Validators.required]],
    title: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(80)]],
    iconName: [''],
    lastModifiedOn: [new Date(), Validators.required],
    homeVariableMainCategoryRefId:[0, Validators.required]
  }) as TForm<IHomeVariableSubCategory>;

  get formControlsSubCategory() { return this.inputFormSubCategory.controls; }

  inputFormSubCategoryItem: TForm<IHomeVariableSubCategoryListItem> = this.fb.group({
    homeVariableSubCategoryListItemId: [0, [Validators.required]],
    title: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(80)]],
    isDeleted: [''],
    lastModifiedOn: [new Date(), Validators.required],
    homeVariableSubCategoryRefId:[0, Validators.required]
  }) as TForm<IHomeVariableSubCategoryListItem>;

  get formControlsSubCategoryItem() { return this.inputFormSubCategoryItem.controls; }
  selectedHomeVariableSubCategoryListItemId: number=0;
  selectedHomeVariableSubCategoryId: number=0;
  icons:any[]=[];

  inputFormSubCategoryRangeItem: TForm<IHomeVariableSubCategoryRangeItem> = this.fb.group({
    homeVariableSubCategoryRangeItemId: [0, [Validators.required]],
    minRange: [0, Validators.required],
    maxRange: [0, Validators.required],
    isDeleted: [''],
    lastModifiedOn: [new Date(), Validators.required],
    homeVariableSubCategoryRefId:[0, Validators.required]
  }, { validator: this.rangeValidator }) as TForm<IHomeVariableSubCategoryRangeItem>;
    rangeValidator(frm: UntypedFormGroup) {
      return frm.value.minRange >= frm.value.maxRange ? { 'mismatch': true } : null;
    }
  get formControlsSubCategoryRangeItem() { return this.inputFormSubCategoryRangeItem.controls; }
  selectedIconName: string='';

  selCollapseBtn: string='collapseOne'
  selMainCategoryId: number=1;

  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private modalService: NgbModal,public toastService: AppToastService,
    private fb: UntypedFormBuilder,public httpClient: HttpClient) { }

  ngOnInit(): void {
    this.httpClient.get("assets/img/home-variable-icons-gallary/variable-icons.json").subscribe((data:any[]) =>{
      this.icons=data;
      this.getAllMainCategories(1);
      document.getElementById('collapseOne').classList.add('collapse');
    })
  }


  getAllMainCategories(mainCategoryId: number){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllMainCategories").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableMainCategory[]>) => {
      this.mainCategories=data?.responseDataModel;
      this.getAllSubCategories(mainCategoryId);
      //console.log(this.mainCategories)
    });
  }
  getAllSubCategories(id: number){
    
    this.appHttpRequestHandlerService.httpGet({ id: id }, "HomeVariableManager", "GetAllSubCategoriesByMainCategoryId").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableSubCategory[]>) => {
      this.subCategories=data.responseDataModel;
      //console.log(this.subCategories)
    });
  }

  openEditTitleModal(categoryLevel: number, categoryid: number, subCategoryId: number, content, editType: string): NgbModalRef {
    if(categoryLevel==0){
      this.inputFormMainCategory.patchValue(
        this.mainCategories.filter(x=>x.homeVariableMainCategoryId==categoryid)[0]
      );
      if(this.inputFormMainCategory.controls.iconName.value){
        this.selectedIconName = this.inputFormMainCategory.controls.iconName.value;
        this.selectedIconName = this.selectedIconName.substring(0, this.selectedIconName.lastIndexOf('.'));
      }

    }
    else if(categoryLevel==1){
      this.inputFormSubCategory.patchValue(
        this.subCategories.filter(x=>x.homeVariableSubCategoryId==categoryid)[0]
      );
      if(this.inputFormSubCategory.controls.iconName.value){
        this.selectedIconName = this.inputFormSubCategory.controls.iconName.value;
        this.selectedIconName = this.selectedIconName.substring(0, this.selectedIconName.lastIndexOf('.'));
      }
    }
    else if(categoryLevel==2){

      if(categoryid==11){
        //console.log(this.subCategories.filter(x=>x.homeVariableSubCategoryId==categoryid)[0].homeVariableSubCategoryRangeItems)
        this.inputFormSubCategoryRangeItem.patchValue(this.subCategories.filter(x=>x.homeVariableSubCategoryId==categoryid)[0].homeVariableSubCategoryRangeItems[0]);
      }
      else{
        this.inputFormSubCategoryItem.patchValue(
          this.subCategories.filter(x=>x.homeVariableSubCategoryId==categoryid)[0]
          .homeVariableSubCategoryListItems
          .filter(x=>x.homeVariableSubCategoryListItemId==subCategoryId)[0]
        );
      }
    }

    return this.modalService.open(content, { size: 'lg' });
  }

  openAddSubCategoryItemModal(subCategory: number, content): NgbModalRef{
    this.inputFormSubCategoryItem.reset();
    this.inputFormSubCategoryItem.controls.homeVariableSubCategoryListItemId.patchValue(0);
    this.inputFormSubCategoryItem.controls.homeVariableSubCategoryRefId.patchValue(subCategory);
    this.inputFormSubCategoryItem.controls.isDeleted.patchValue(false);
    this.inputFormSubCategoryItem.controls.lastModifiedOn.patchValue(new Date());
    this.inputFormSubCategoryItem.controls.title.patchValue('');
    return this.modalService.open(content, { size: 'lg' });
  }

  onSubmitMainCategory(){
    if (this.inputFormMainCategory.valid) {
      //console.log(this.inputFormMainCategory.value)
      this.appHttpRequestHandlerService.httpPost(this.inputFormMainCategory.value, "HomeVariableManager", "UpdateMainCategory").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.getAllMainCategories(this.selMainCategoryId);
          //console.log(this.selCollapseBtn, this.selMainCategoryId);
         // document.getElementById(this.selCollapseBtn).classList.add('collapse');
         // this.toggleCollapse(this.selCollapseBtn,this.selMainCategoryId);
      });
    this.closeAllModals();
    }
  }

  onSubmitSubCategory(){
    if (this.inputFormSubCategory.valid) {
    //  console.log(this.inputFormSubCategory.value)
      this.appHttpRequestHandlerService.httpPost(this.inputFormSubCategory.value, "HomeVariableManager", "UpdateSubCategory").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
         // console.log(this.inputFormSubCategory.controls.homeVariableMainCategoryRefId.value)
          this.getAllSubCategories(this.inputFormSubCategory.controls.homeVariableMainCategoryRefId.value);
      });
    this.closeAllModals();
    }
  }

  setCategoryIcon(categoryLevel: number, iconFile: string){
    if(categoryLevel==0){
      this.inputFormMainCategory.controls.iconName.patchValue(iconFile);
    }
    else if(categoryLevel==1){
      this.inputFormSubCategory.controls.iconName.patchValue(iconFile);
    }
    this.selectedIconName = iconFile.substring(0, iconFile.lastIndexOf('.'));
    this.toggleIconGallery();
  }

  onSubmitSubCategoryItem(){
    if (this.inputFormSubCategoryItem.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormSubCategoryItem.value, "HomeVariableManager", "UpdateSubCategoryItem").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          //console.log(this.selCollapseBtn, this.selMainCategoryId)
          document.getElementById(this.selCollapseBtn).classList.add('collapse');
          this.toggleCollapse(this.selCollapseBtn, this.selMainCategoryId);
          //this.getAllSubCategories(this.inputFormSubCategoryItem.controls.homeVariableSubCategoryRefId.value);
      });
      this.closeAllModals();
    }
  }
  closeAllModals(){
    this.modalService.dismissAll();
  }
  openDeleteSubItemModal(subCategoryListId: number, subCategoryId: number, content): NgbModalRef {
    this.selectedHomeVariableSubCategoryListItemId = subCategoryListId;
    this.selectedHomeVariableSubCategoryId = subCategoryId;
    return this.modalService.open(content, { size: 'md' });
  }
  onDeleteItemModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({ id: this.selectedHomeVariableSubCategoryListItemId }, "HomeVariableManager", "DeleteSubItem").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
          document.getElementById(this.selCollapseBtn).classList.add('collapse')
          this.toggleCollapse(this.selCollapseBtn, this.selMainCategoryId)
          //this.getAllSubCategories(this.selectedHomeVariableSubCategoryId);
      });
    this.modalService.dismissAll();
  }

  onSubmitSubCategoryRangeItem(){
    //console.log(this.inputFormSubCategoryRangeItem)
    if (this.inputFormSubCategoryRangeItem.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormSubCategoryRangeItem.value, "HomeVariableManager", "UpdateSubCategoryRangeItem").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.getAllSubCategories(this.inputFormSubCategoryItem.controls.homeVariableSubCategoryRefId.value);
      });
    }
    this.closeAllModals();
  }

  toggleCollapse(collapseBtn: string, mainCategoryId: number){
   // console.log(collapseBtn)
    this.selCollapseBtn = collapseBtn;
    this.selMainCategoryId =mainCategoryId;
    var allCollapsibles = document.querySelectorAll(".accordion-collapse");
    var isAlreadyCollapsed = document.getElementById(collapseBtn).classList.contains('collapse');

    allCollapsibles.forEach(element => {
      if (collapseBtn == element.id && isAlreadyCollapsed){
        document.getElementById(collapseBtn).classList.remove('collapse')
        this.getAllSubCategories(mainCategoryId);
      }
      else if (collapseBtn == element.id && !isAlreadyCollapsed){
        document.getElementById(collapseBtn).classList.add('collapse')
      }
      else{
        document.getElementById(element.id).classList.add('collapse')
      }
    });
  }
  toggleIconGallery(){
    var dropdown = document.getElementById("iconGallery");
   // console.log(dropdown)
    if (dropdown.classList.contains('showIconGallery')) {
      dropdown.classList.remove('showIconGallery');
    }
    else{
      dropdown.classList.add('showIconGallery');
    }
  }
  isCollapsedShown(collapseId: string){
    return !document.getElementById(collapseId).classList.contains('collapse')
  }
}
