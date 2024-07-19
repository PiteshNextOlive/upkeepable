import { Component, OnInit, Renderer2, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IState, TForm } from 'src/app/generic-type-module';
import { IRealEstateAgentProfileViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { environment } from 'src/environments/environment';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-rea-manager-editor',
  templateUrl: './rea-manager-editor.component.html',
  styleUrls: ['./rea-manager-editor.component.css']
})
export class ReaManagerEditorComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();


  @ViewChild('content') content: TemplateRef<any>;
  fileUploadEventObject: any;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  profilePhoto: string = this.defaultProfilePhoto;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  invalidSize:boolean=true;
  firstName: string='';
  lastName: string='';
  userId: number;
  inputForm: TForm<IRealEstateAgentProfileViewModel> = this.fb.group({
    isNotficationOn: [0, [Validators.required]],
    userRefId: [0, [Validators.required]],

    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    userImage: [''],
    userImageBase64: [''],
    socialMedia_FacebookUrl:[''],
    socialMedia_TweeterUrl:[''],
    socialMedia_InstagramUrl:[''],
    socialMedia_YoutubeUrl:[''],
    isActive: [],
    isDeleted: [],
    isEmailConfirmed: [],
    userStatusType:[],
    isPoused: [0, [Validators.required]],
    pausedMessage: ['', [Validators.required]],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(80)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    cityName: ['', [Validators.required ,Validators.pattern(/^[a-zA-Z ]*$/), Validators.maxLength(20)]],
    stateCode: ['', Validators.required],
  }) as TForm<IRealEstateAgentProfileViewModel>;
  get formControls() { return this.inputForm.controls; }
  // defaultProfilePhoto: string = environment.defaultProfilePhoto;
  // profilePhoto: string = this.defaultProfilePhoto;
  submitted: boolean=false;
  isDuplicateEmail: boolean=false;
  states: IState[] = [];
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    private fb: UntypedFormBuilder, 
    private modalService: NgbModal, 
    private router: Router,
    public toastService: AppToastService,
    private accountService: AccountService,
    private route: ActivatedRoute,
    public commonOpsService: CommonOpsService) { }

  ngOnInit(): void {
    //this.invalidSize = true;
    this.route.queryParams
    .subscribe(params => {
      // if (params.info == undefined || params.info == '') {
      //   this.isSomethingWentWrong = true;
      // }
      this.userId= params.info;
      this.appHttpRequestHandlerService.httpGet({ id: params.info }, "RealEstateAgent", "GetRealEstateAgentProfileById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentProfileViewModel>) => {
       // console.log(data);
        this.inputForm.patchValue(data.formModel)
        if (data.formModel.userImageBase64 != null) {
          this.profilePhoto = data.formModel.userImageBase64;
        }
        this.firstName = this.inputForm.controls.firstName.value;
        this.lastName = this.inputForm.controls.lastName.value;

        if(this.inputForm.controls.userStatusType.value==2){
          this.inputForm.controls.isPoused.patchValue(1);
          this.inputForm.controls.pausedMessage.patchValue(' ');
        }
        else{
          this.inputForm.controls.isPoused.patchValue(0);
          //this.inputForm.controls.pausedMessage.patchValue('NA');
        }
      });
    });

    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: IState[]) => {
      this.states = data;
    });
  }
  onSubmit() {
    this.submitted=true;
    if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
      this.inputForm.controls.cityName?.patchValue("");
    }

    if(this.inputForm.controls.isPoused.value==0){
      this.inputForm.controls.pausedMessage.patchValue('NA');
    }
    if(this.inputForm.controls.isPoused.value==1  && this.inputForm.controls.userStatusType.value==2){
      this.inputForm.controls.pausedMessage.patchValue('NA');
    }
    if(this.inputForm.controls.pausedMessage?.value?.trim()?.length  == 0 ){
      this.inputForm.controls.pausedMessage?.patchValue("");
    }
    if (this.inputForm.valid && !this.isDuplicateEmail) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "UpdateRealEstateAgentProfileByAdmin").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.router.navigate(['/Admin/Dashboard']);
        });
    }
  }



  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }

  onPhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.open(this.content);
    }
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }

  onImageCropper(croppedImageInfo: any) {
    this.modalService.dismissAll();
   if (croppedImageInfo.targetImageElementId == 'profilePhotoImgElement') {
      this.profilePhoto = croppedImageInfo.croppedImage;
      this.inputForm.controls.userImageBase64.patchValue(this.profilePhoto);
    }
    // if(this.profilePhoto.length < 1400000){
    //   this.invalidSize=true;
    // }else{
    //   this.invalidSize=false;
    // }
  }

  
  removeImage(imageToBeRemoved) {
    if (imageToBeRemoved == 'profilePhotoImgElement') {
    //  this.invalidSize=true;
      this.inputForm.controls.userImage.patchValue(null);
      this.inputForm.controls.userImageBase64.patchValue(null);
      this.profilePhoto = this.defaultProfilePhoto;
    }
   
  }
  toggleChanged(val: any) {
    //console.log("val",val)
    this.inputForm.controls.isPoused.patchValue(val ? 1 : 0);
    if(this.inputForm.controls.isPoused.value==1){
      this.inputForm.controls.pausedMessage.patchValue(' ');
    }
    else{
      this.inputForm.controls.pausedMessage.patchValue(' ');
    }
  }
  openCancelAccountModal(userId: number, content) {
    this.userId=userId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }
  onCancelAccountModelYesClick(){
    this.appHttpRequestHandlerService.httpPost({userId: this.userId} , "RealEstateAgent", "RemoveRea").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.modalService.dismissAll();
      this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
      this.router.navigate(['/Admin/Dashboard']);
    });
  }
  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }
  checkDuplicateEmail(){
    if(this.inputForm.controls.email.valid){
     // console.log(this.inputForm.value)
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
      });
    }
  }
  onEmailFocusOut(){
    if(this.isDuplicateEmail){
      this.inputForm.controls.email.patchValue('');
      this.isDuplicateEmail=false;
    }
  }
}
