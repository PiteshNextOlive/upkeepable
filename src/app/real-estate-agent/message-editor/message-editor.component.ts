import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { LocationStrategy } from '@angular/common';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { GenericFormModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { IRealEstateAgentMessage, IRealEstateAgentMessageViewModel } from '../real-estate-agent-type-module';
import { Router } from '@angular/router';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-message-editor',
  templateUrl: './message-editor.component.html',
  styleUrls: ['./message-editor.component.css']
})
export class MessageEditorComponent implements OnInit {
  public monthNamesWithCodes: any[] = [
    { monthCode: 1, monthAbbr: 'Jan.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 2, monthAbbr: 'Feb.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 3, monthAbbr: 'Mar.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 4, monthAbbr: 'Apr.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 5, monthAbbr: 'May.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 6, monthAbbr: 'Jun.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 7, monthAbbr: 'Jul.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 8, monthAbbr: 'Aug.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 9, monthAbbr: 'Sep.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 10, monthAbbr: 'Oct.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 11, monthAbbr: 'Nov.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false },
    { monthCode: 12, monthAbbr: 'Dec.', isSelcted: false, isDisabled: false, isAlreadyDrafted: false }];
  public currentYear: number = new Date().getFullYear();
  public yearsWithInfo: any[] = [
    { year: this.currentYear, isSelcted: true, isDisabled: false },
    { year: this.currentYear + 1, isSelcted: false, isDisabled: false }];
  public selectedMonth: number = 0;
  public selectedYear: number = this.currentYear;
  submitted = false;
  optionalLinks: string[] = [];
  isValidURL: boolean = true;
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  fileUploadEventObject: any;
  targetImageElementId: string = '';
  aspectRatio: string = '1/1';
  messageHomePhoto: string = '';
  userId: number;
  createLink = false;
  invalidSize:boolean=true;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public isMonthYearSelected=true;
  isMessageInEditMode=false;
  private cropModalReference: NgbModalRef;
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private modalService: NgbModal,
    private fb: UntypedFormBuilder,
    public toastService: AppToastService,
    public commonOpsService:CommonOpsService,
    private location: LocationStrategy,
    private router: Router,
    public authService: AuthService,
    private sharingdata: SharingDataService) {
      history.pushState(null, null, window.location.href);
      this.location.onPopState(() => {
        this.modalService.dismissAll();
        history.pushState(null, null, window.location.href);
        });
     }
    @Input() realEstateAgentMessageId:number=0;
    @Output() refreshMessageListEvent = new EventEmitter<any>();
  inputFormMessage: TForm<IRealEstateAgentMessage> = this.fb.group({
    realEstateAgentMessageId: [0, Validators.required],
    month: ['', Validators.required],
    year: ['', Validators.required],
    subject: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(150)]],
    shortDescription: ['NA', Validators.required],
    messageText: ['', [Validators.required, Validators.maxLength(400)]],
    optionalLinks: [[]],
    messageImage: [''],
    optionalLinkText: ['', [Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    messageImageBase64: [''],
    userRefId: [0, Validators.required],
    selectedMonthCommaSeparated: ['', Validators.required],
    selectedYearCommaSeparated: ['', Validators.required],
    realEstateAgentMessageLinks:[[]]
  }) as TForm<IRealEstateAgentMessage>;
  //, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
  get formControls() { return this.inputFormMessage.controls; }
  ngOnInit(): void {


  }
  ngOnChanges(){

    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.userId = Number(this.userJwtDecodedInfo.UserId);

    if(this.realEstateAgentMessageId==0){
      this.isMessageInEditMode=false;
      this.selectedYear =  new Date().getFullYear();
      this.currentYear = this.selectedYear;
      this.inputFormMessage.reset();
      //this.onClickYear(this.currentYear);
      this.inputFormMessage.controls.year.patchValue(this.selectedYear);
      this.optionalLinks=[];
      this.yearsWithInfo = [
        { year: this.currentYear, isSelcted: true, isDisabled: false },
        { year: this.currentYear + 1, isSelcted: false, isDisabled: false }];

      this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
        return {
          monthCode: i.monthCode,
          monthAbbr: i.monthAbbr,
          isSelcted: false,
          isDisabled: false,
          isAlreadyDrafted: false
        }
      });
      this.disableAllPastMonths(this.currentYear);
      this.getAlreadyDraftedMessageMonthsByYear();
      this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(0);
    }
    else{
      this.isMessageInEditMode=true;
      this.getRealEstateMessage(this.realEstateAgentMessageId);

    }
  }
  getRealEstateMessage(realEstateAgentMessageId) {
    this.yearsWithInfo = this.yearsWithInfo.map(i => {
      return {
        year: i.year,
        isSelcted:false,
        isDisabled: false
      }});

      this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
        return {
          monthCode: i.monthCode,
          monthAbbr: i.monthAbbr,
          isSelcted: false,
          isDisabled: false,
          isAlreadyDrafted: false
        }
      });
    this.appHttpRequestHandlerService.httpGet({ id: realEstateAgentMessageId }, "RealEstateAgent", "GetRealEstateAgentDraftedMessagesById").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessage>) => {
       // console.log(data);
        this.inputFormMessage.reset();
        this.inputFormMessage.patchValue(data.formModel);
        this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(this.realEstateAgentMessageId);

        this.inputFormMessage.controls.selectedYearCommaSeparated.patchValue(data.formModel.year);

        this.messageHomePhoto = this.inputFormMessage.controls.messageImageBase64.value;

      //console.log(this.messageHomePhoto)
        this.inputFormMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
        if (data.formModel == null) {
          //this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(0);
        }
        //console.log('CXCXCXCXCXCXCX', this.optionalLinks)
        this.optionalLinks = this.inputFormMessage.controls.realEstateAgentMessageLinks.value.map(i => {
          return i.linkUrl
        });
        if(this.optionalLinks!=null && this.optionalLinks.length>0){
          this.inputFormMessage.controls.optionalLinks.patchValue(this.optionalLinks)
        }

        //console.log('CXCXCXCXCXCXCX', this.optionalLinks)


        this.yearsWithInfo = this.yearsWithInfo.map(i => {
          return {
            year: i.year,
            isSelcted: (i.year==this.inputFormMessage.controls.year.value),
            isDisabled: !(i.year==this.inputFormMessage.controls.year.value)
          }});

          this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
            return {
              monthCode: i.monthCode,
              monthAbbr: i.monthAbbr,
              isSelcted: (i.monthCode==this.inputFormMessage.controls.month.value),
              isDisabled: !(i.monthCode==this.inputFormMessage.controls.month.value),
              isAlreadyDrafted: false
            }
          });

        //this.inputFormMessage.controls.realEstateAgentMessageLinks.patchValue(this.inputFormMessage.controls.optionalLinks.value);
    });
  }
  onClickYear(year: number) {
    this.isMonthYearSelected=true;
    if(!this.isMessageInEditMode){
      this.yearsWithInfo = this.yearsWithInfo.map(i => {
        return {
          year: i.year,
          isSelcted: (i.year == year)? !i.isSelcted : i.isSelcted
        }
      });
      if(this.yearsWithInfo.filter(x=>x.isSelcted).length==1 && this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year == this.currentYear){
        this.disableAllPastMonths(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year);
      }
      else if(this.yearsWithInfo.filter(x=>x.isSelcted).length==0){
        this.yearsWithInfo = this.yearsWithInfo.map(i => {
          return {
            year: i.year,
            isSelcted: (i.year == year)? i.isSelcted : !i.isSelcted
          }
        });
        if(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year == this.currentYear){
          this.disableAllPastMonths(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year);
  
        }
        else
        {
          this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
            return {
              monthCode: i.monthCode,
              monthAbbr: i.monthAbbr,
              isSelcted: false,
              isDisabled: false,
             isAlreadyDrafted: false
            }
          });
        }
      }
      else if(this.yearsWithInfo.filter(x=>x.isSelcted).length > 1)
      {
        this.yearsWithInfo = this.yearsWithInfo.map(i => {
          return {
            year: i.year,
            isSelcted: (i.year == year)? i.isSelcted : !i.isSelcted
          }
        });
        if(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year == this.currentYear){
          this.disableAllPastMonths(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year);
  
        }
      }
      else{
        this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
          return {
            monthCode: i.monthCode,
            monthAbbr: i.monthAbbr,
            isSelcted: i.isSelcted,
            isDisabled: false,
            isAlreadyDrafted: false
          }
        });
      }
      this.selectedYear = year;
      this.inputFormMessage.controls.year.patchValue(this.selectedYear);
      this.getAlreadyDraftedMessageMonthsByYear();
      if(this.selectedYear == this.currentYear+1)
      {
        if(this.yearsWithInfo.filter(x=>x.isSelcted==true)[0].year != this.currentYear)
        {
          this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
            return {
              monthCode: i.monthCode,
              monthAbbr: i.monthAbbr,
              isSelcted: false,
              isDisabled: false,
             isAlreadyDrafted: false
            }
          });
        }
       
      }
      //this.getRealEstateMessage();
    }
  }
//   checkValidUrl(orderNo){
//     console.log(orderNo);
//     console.log(orderNo?.value);
//     var myVariable = orderNo?.value;
// if(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/i.test(myVariable)) {
//   //alert("valid url");
//   this.isValidURL=true;
// } else {
//   //alert("invalid url");
//   this.isValidURL=false;
// }
 // }
  onMonthClick(monthCode: number, isDisabled: boolean, isAlreadyDrafted: boolean) {
    this.isMonthYearSelected=true;
    if(!this.isMessageInEditMode){
      if (!isAlreadyDrafted) {
        this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
          return {
            monthCode: i.monthCode,
            monthAbbr: i.monthAbbr,
            isSelcted: (i.monthCode == monthCode && !isDisabled) ? !i.isSelcted : i.isSelcted,
            isDisabled: i.isDisabled,
            isAlreadyDrafted: i.isAlreadyDrafted
          }
        });
        this.selectedMonth = monthCode;
        this.inputFormMessage.controls.month.patchValue(this.selectedMonth);
      }
      //this.getRealEstateMessage();
    }
  }
  onMessageFormSubmit() {
    this.inputFormMessage.controls.shortDescription.patchValue('NA');
    this.inputFormMessage.controls.month.patchValue(this.selectedMonth);
    this.inputFormMessage.controls.year.patchValue(this.selectedYear);
    this.submitted = true;
    var i = 0;
    let selectedMonthCommaSeparated: string = '';
    this.monthNamesWithCodes.filter(x => x.isSelcted).forEach(element => {
      if (i > 0) {
        selectedMonthCommaSeparated += ','
      }
      selectedMonthCommaSeparated += element.monthCode;
      i++;
    });
    this.inputFormMessage.controls.selectedMonthCommaSeparated.patchValue(selectedMonthCommaSeparated);

    i = 0;
    let selectedYearCommaSeparated: string = '';
    this.yearsWithInfo.filter(x => x.isSelcted).forEach(element => {
      if (i > 0) {
        selectedYearCommaSeparated += ','
      }
      selectedYearCommaSeparated += element.year;
      i++;
    });
    this.inputFormMessage.controls.selectedYearCommaSeparated.patchValue(selectedYearCommaSeparated);


    this.inputFormMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);


    this.isMonthYearSelected = (this.monthNamesWithCodes.filter(x => x.isSelcted).length==0 || this.yearsWithInfo.filter(x => x.isSelcted).length==0)? false : true;


    //this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(0);
    //console.log(this.inputFormMessage.value)
    if (this.inputFormMessage.valid && this.isMonthYearSelected) {
      this.modalService.dismissAll();
      //if(this.createLink==true){
        // if(this.inputFormMessage.controls.optionalLinkText.value && this.inputFormMessage.controls.optionalLinkText.value.trim().length>0){
        //   this.optionalLinks.push(this.inputFormMessage.controls.optionalLinkText.value.trim());
        //   this.inputFormMessage.controls.optionalLinks.patchValue(this.optionalLinks);
        // }
        if(this.inputFormMessage.controls.optionalLinkText.value && this.inputFormMessage.controls.optionalLinkText.value.trim().length>0){
          if(this.optionalLinks==null || this.optionalLinks == undefined){
            this.optionalLinks = [];
          }
          this.optionalLinks.push(this.inputFormMessage.controls.optionalLinkText.value.trim());
          this.inputFormMessage.controls.optionalLinks.patchValue(this.optionalLinks);
        }  
    // }
      
      this.appHttpRequestHandlerService.httpPost(this.inputFormMessage.value, "RealEstateAgent", "AddUpdateMessage").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          if(this.realEstateAgentMessageId==0){
            this.toastService.show("","Monthly message created successfully", 3000,"bg-success text-white","fa-check-circle");
          }
          if(this.realEstateAgentMessageId>0){
            this.toastService.show("","Monthly message edited successfully", 3000,"bg-success text-white","fa-check-circle");
          }
          //this.getMessageList_Drafted();
          this.refreshMessageListEvent.emit();
          this.modalService.dismissAll();
          this.sharingdata.getMessageList();
        });
        //window.location.reload();
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
      this.cropModalReference  = this.openCropImageModal(this.cropImageModal);
    }
  }
  onImageCropper(croppedImageInfo: any) {
    this.cropModalReference.close()
    if (croppedImageInfo.targetImageElementId == 'messagePhotoImgElement') {
      this.messageHomePhoto = croppedImageInfo.croppedImage;
      (<HTMLInputElement>document.getElementById('messagePhotoBrowserInput')).value = '';
      this.inputFormMessage.controls.messageImageBase64.patchValue(this.messageHomePhoto);
      // if(this.messageHomePhoto.length < 1400000){
      //   this.invalidSize=true;
      // }else{
      //   this.invalidSize=false;
      // }
      // this.appHttpRequestHandlerService.httpPost({ homeOwnerAddressId: this.homeOwnerAddressId, homeProfileImageBase64: this.defaultHomePhoto }, "HomeOwnerAddress", "UpdateHomeAddressPhoto").pipe(takeUntil(this.ngUnsubscribe))
      //   .subscribe((data: GenericServiceResultTemplate) => { });
    }
    else if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {}
  }
  openCropImageModal(content) : NgbModalRef{
    return this.modalService.open(content, { size: 'lg' });
  }
  onRemoveImage() {
  //  this.invalidSize=true;
    this.messageHomePhoto = null;
    this.inputFormMessage.controls.messageImageBase64.patchValue(this.messageHomePhoto);
  }
  onCancelCropImageModal(){
    this.cropModalReference.close('Close click')
  }
  onAddNewOptionalLink(linkString: string) {
    if(!this.inputFormMessage.controls.optionalLinkText.errors?.pattern){
    if (linkString && linkString.trim().length > 0){
      if(this.optionalLinks==null){
        this.optionalLinks=[];
      }
      this.createLink = true;
      this.optionalLinks.push(linkString);
      this.inputFormMessage.controls.optionalLinks.patchValue(this.optionalLinks);
      this.inputFormMessage.controls.optionalLinkText.reset();
    }
    else{
      this.createLink = false;
      this.inputFormMessage.controls.optionalLinkText.reset();
    }
  }
  if(this.inputFormMessage.controls.optionalLinkText.value == null || this.inputFormMessage.controls.optionalLinkText.value==undefined){
    this.inputFormMessage.controls.optionalLinkText.patchValue("");
  }
  }

  onRemoveOptionalLink(index: number) {
    this.optionalLinks.splice(index, 1);
    this.inputFormMessage.controls.optionalLinks.patchValue(this.optionalLinks);
  }
  disableAllPastMonths(selctedYear: number) {
    let currentMonth: number = new Date().getMonth();
    if (selctedYear == this.currentYear) {
      this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
        return {
          monthCode: i.monthCode,
          monthAbbr: i.monthAbbr,
          isSelcted: false,
          isDisabled: (currentMonth >= i.monthCode),
          isAlreadyDrafted: i.isAlreadyDrafted
        }
      });
    }
    else {
      this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
        return {
          monthCode: i.monthCode,
          monthAbbr: i.monthAbbr,
          isSelcted: false,
          isDisabled: false
        }
      });
    }
  }
  getAlreadyDraftedMessageMonthsByYear() {
    let selectedYearCommaSeparated: string[] = [];
    this.yearsWithInfo.filter(x => x.isSelcted).forEach(element => {
      selectedYearCommaSeparated.push(element.year);
    });

    let years = JSON.stringify(selectedYearCommaSeparated);

    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId, years: years }, "RealEstateAgent", "GetAlreadyDraftedMessageMonthsByYear").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessageViewModel[]>) => {
        //console.log((data.formModel.filter(x=>x.month==11).length == selectedYearCommaSeparated.length), data.formModel.filter(x=>x.month==11).length , selectedYearCommaSeparated.length);
        this.monthNamesWithCodes = this.monthNamesWithCodes.map(i => {
          return {
            monthCode: i.monthCode,
            monthAbbr: i.monthAbbr,
            isSelcted: i.isSelcted,
            isDisabled: i.isDisabled,
            isAlreadyDrafted: (data.formModel.filter(x=>x.month==i.monthCode).length == selectedYearCommaSeparated.length) //(data.formModel.includes(i.monthCode) && (data.formModel.length==years.length))
          }
        });
        // this.inputFormMessage.reset();
        // this.inputFormMessage.patchValue(data.formModel);
        // this.inputFormMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
        // if(data.formModel==null){
        //   this.inputFormMessage.controls.realEstateAgentMessageId.patchValue(0);
        // }
      });
  }
  onClickCloseModal() {
    this.modalService.dismissAll();
  }
}
