import { Component, OnInit, TemplateRef, Renderer2, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { IHomeAddressIndexPageAdditionalInfoViewModel, IHomeOwnerAddressAttribute, IRecommendationLink, INewEntry, IHomeOwnerEntryImagesViewModel } from '../home-owner-address-type-module';
import { GenericResponseTemplateModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { NgbModal, NgbModalConfig, NgbCarouselConfig, NgbCarousel, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';
import { OwlOptions, SlidesOutputData } from 'ngx-owl-carousel-o';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { LocationStrategy } from '@angular/common';
import { IArticle } from 'src/app/article/recommendation/article-type-module';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';
import { SharingDataService } from 'src/app/services/sharing-data/sharing-data.service';
import { HttpLoaderService } from 'src/app/shared/http-loader.service';
//import { PushNotificationService } from 'src/app/push-notification.service';
import { PushNotificationService } from '../../push-notification.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";
declare var $: any

@Component({
  selector: 'app-home-owner-index-page',
  templateUrl: './home-owner-index-page.component.html',
  styleUrls: ['./home-owner-index-page.component.css'],
  providers: [DatePipe]
})

export class HomeOwnerIndexPageComponent implements OnInit {
  checkdate = 'date-comparison';
  private title1: string = 'Browser Push Notifications!';

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  isProfileCompleted: boolean = true;
  isKeepDialogClosed: boolean = true;
  isShownNextButton: boolean = false;
  isClickable: boolean = false;
  modalBool: boolean = false;
  statusBool: boolean = false;
  isClick: boolean = false;
  isImageData:boolean = false;
  isNotesData:boolean = false;
  isNoImg:boolean = false;
  isHide:boolean = false;
  imageFile1: any;
  isForceFullyClosed: boolean;
  homeOwnerAddressId: number;
  defaultHomePhoto: string = environment.defaultHomePhoto;
  homeFullAddress: string;
  homeOwnerName: string;
  userStatusType: string;
  isGoBack: boolean = true;
  pageAdditionalInfo: IHomeAddressIndexPageAdditionalInfoViewModel;
  totalRecommendations: number = 0;
  currentRecommedationMonthName: string = "";
  currentRecommedationYear: number;
  tabCode: number = 1;
  iconFile1:string;
  submitted = false;
  invalidSize: boolean = true;
  isFirstRecommendationMonth: boolean;
  isLastRecommendationMonth: boolean;
  homeAddressRecommendationId: number;
  recommendationRefId: number;
  homeOwnerEntryId: number;
  homeRecomendationListIndex: number;
  recommendationIndex: number;
  recommendationTitle: string;
  historyLogDescriptionText: string;
  descriptionText: string;
  title: string;
  lastModifiedOn: Date;
  formattedDate: string;
  profilePhoto: IHomeOwnerEntryImagesViewModel[] = [];
  recommendationImage: string;
  recommendationLinks: IRecommendationLink[] = [];
  newEntryList: INewEntry[] = [];
  historyLogList: INewEntry[] = [];
  isDirectLogin: boolean = false;
  fileUploadEventObject: any;
  formatededphoneNumber: any;
  startedOn: string;
  nextOnReminder: string;
  IsNotiUserId:string=null;
  homeOwnerRecommendationLogsviewmodel: any;
  maxPickerDate = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
 today = new Date();
  maxPickerDate1 = {
    year: this.today.getFullYear(),
    month: this.today.getMonth() + 1,
    day: this.today.getDate(),
  };
  targetImageElementId: string = '';
  private cropModalReference: NgbModalRef;
  private cropBannerReference: NgbModalRef;
  private cancelAccountAlertModel: NgbModalRef;
  entryId: number = 0;
  aspectRatio: string = '1/1';
  inputForm: TForm<INewEntry> = this.fb.group({
    homeOwnerEntryId: [0, Validators.required],
    title: ['', [Validators.required, Validators.maxLength(150), Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    descriptionText: ['', [Validators.required, Validators.maxLength(500)]],
    imageFile: [[]],
    imageFileBase64: [''],
    createdOn: [new Date(), Validators.required],
    startOn: [new Date(), Validators.required],
    lastModifiedOn: [new Date(), Validators.required],
    rememberMeType: [''],
    rememberMe: ['', [Validators.pattern('[0-9]{1,2}')]],
    startedOn: [new Date(), Validators.required],
    startDateJson: ['', Validators.required],
    homeOwnerAddressRefId: [0, Validators.required],
    homeOwnerEntryImages: [[]],

  }) as TForm<INewEntry>;

  get formControls() { return this.inputForm.controls; }
  inputForm1: TForm<INewEntry> = this.fb.group({
    title: ['null'],
    homeOwnerEntryId: [0],
    descriptionText: ['null', [Validators.maxLength(500)]],
    imageFile: [[]],
    imageFileBase64: [''],
    //createdOn: [new Date(), Validators.required],
    createdOn: [new Date()],
    startOn: [new Date()],
    lastModifiedOn: [new Date()],
    rememberMeType: [''],
    rememberMe: ['12'],
    startedOn: [new Date()],
    startDateJson: ['', Validators.required],
    homeOwnerAddressRefId: [0],
    recommendationRefId: [0],
    homeOwnerEntryImages: [[]],

  }) as TForm<INewEntry>;

  get formControls1() { return this.inputForm1.controls; }
  @ViewChild('cropImageModal') cropImageModal: TemplateRef<any>;
  @ViewChild('caroRecomendations', { static: true }) caroRecomendations: NgbCarousel;
  @ViewChild('carArticle', { static: true }) carArticle: NgbCarousel;
  @ViewChild('content') REO_EmailModal: TemplateRef<any>;
  customOptions: OwlOptions = {
    loop: true,
    items: 2,
    margin: 50,
    mouseDrag: true,
    autoplay: true,
    autoplayTimeout: 7000,
    smartSpeed: 800,
    dots: true,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      400: {
        items: 1,
      },
      767: {
        items: 1,
      },
      991: {
        items: 2,
      },
      1199: {
        items: 2,
      }

    }
  }
  activeSlides: SlidesOutputData;
  slidesStore: any[];
  show = false;
  totaRecoSlides = 0;
  entryImg;
  customModal;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  selectedArticle: IArticle;
  defaultProfilePhoto = environment.defaultProfilePhoto;
  defaultApiRoot = environment.defaultApiRoot;
  message:any;
  constructor(

    private _notificationService: PushNotificationService,

    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    private fb: UntypedFormBuilder,
    public commonOpsService: CommonOpsService,
    private location: LocationStrategy,
    public toastService: AppToastService,
    private route: ActivatedRoute,
    public datepipe: DatePipe,
    private modalService: NgbModal,
    config: NgbModalConfig,
    private ngbCarouselConfig: NgbCarouselConfig,
    private ngbCarousel: NgbCarousel,
    private renderer: Renderer2,
    public authService: AuthService,
    private sharingdataService: SharingDataService,
    private httpLoaderService: HttpLoaderService
  ) {

    this._notificationService.requestPermission();

    config.keyboard = true;
    ngbCarouselConfig.keyboard = false;
    ngbCarouselConfig.showNavigationArrows = false;
    ngbCarouselConfig.showNavigationIndicators = false;
    ngbCarouselConfig.wrap = false;
    this.commonOpsService.isForceFullyClosed.subscribe(isPopShow => {
      this.isForceFullyClosed = isPopShow;
    });
    this.renderer.listen('window', 'scroll', (event: Event) => {
      const header = document.querySelector(".fixed-nav-bg");
      const toggleClass = "is-sticky";
      window.addEventListener("scroll", () => {
        const currentScroll = window.pageYOffset;
        if (header != null) {
          if (currentScroll > 150) {
            header.classList.add(toggleClass);
          } else {
            header.classList.remove(toggleClass);
          }
        }
      });
    });

  }
  ngOnChanges() {
    this.ngOnInit();
  }
    
  ngOnInit(): void {
    debugger;
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
     this.IsNotiUserId = userJwtDecodedInfo.UserId;
     var data2={
      IsNotiUserId:this.IsNotiUserId
     }
     this.appHttpRequestHandlerService.httpPost(data2, "HomeOwnerAddress", "GetNotificationByUserId").pipe(takeUntil(this.ngUnsubscribe))
     .subscribe((data: any) => {     
     
      console.log("Checkdata",data);  
      if (data == true){
     
        let data: Array < any >= []; 
        const currentDate = new Date();
        const firstDayOfMonth = this.getFirstDayOfMonth(currentDate);
        if (this.isSameDate(currentDate, firstDayOfMonth)) {
        
          data.push({             
            'title1': 'New Recommendations Available!',  
            'alertContent': 'Check out this months home maintenance tips and tasks'  
        }); 
    }
      this._notificationService.generateNotification(data); 
  }
    else {
     // alert("else")
      }
       });

    // let data: Array < any >= []; 
    // const currentDate = new Date();
    // const firstDayOfMonth = this.getFirstDayOfMonth(currentDate);

    // console.log('Current Date:', currentDate);
    // console.log('First Day of Current Month:', firstDayOfMonth);

    // if (this.isSameDate(currentDate, firstDayOfMonth)) {
    //   data.push({  
    //     'title1': 'New Recommendations Available!',  
    //     'alertContent': 'Check out this months home maintenance tips and tasks'  
    // }); 
    //   //console.log('Today is the first day of the month');
    // } else {
      
    // }

    //   this._notificationService.generateNotification(data);  
 


    var img = this;
    $(document).on("click", ".flip_modal_opener", function () {
      $(".flip_modal_upper_wrapper").addClass("show");
      $("body").css("overflow-y","hidden");
    });
    $(document).on("click", ".logdet", function () {
      $(".flip_modal_upper_wrapper").addClass("show");
      $("body").css("overflow-y","hidden");
    });

    $(document).on("click", ".flip_btn", function () {
      $(".flip_modal_wrapper").addClass("flip safari");
    });

    $(document).on("click", ".flip_modal_wrapper.flip button.btn-close", function () {
      $(".flip_modal_upper_wrapper").removeClass("show");
      $("body").css("overflow-y","auto");
      $(".flip_modal_wrapper").removeClass("flip safari");
    });

    // $(document).on("click", ".save_btn", function () {
    //   $(".flip_modal_wrapper").removeClass("flip");
    // });
    

    $(document).on("click", ".flip_modal_wrapper .btn-close", function () {
      $(".flip_modal_upper_wrapper").removeClass("show");
      $("body").css("overflow-y","auto");
      
    });

    $(document).on("click", ".view_full_image", function () {
      const imageSrc = (event.target as HTMLImageElement).src;
      img.imageFile1 = imageSrc;
      $("div#view_full_image").addClass("show");
      $("body").addClass("modal-open");
    });

    $(document).on("click", "#view_full_image .btn-close", function () {
      $("div#view_full_image").removeClass("show");
      $("body").removeClass("modal-open");
    });

    $(document).on("click", ".view__image", function () {
      const imageSrc = (event.target as HTMLImageElement).src;
      img.imageFile1 = imageSrc;
      $("div#view__image").addClass("show");
      $("body").addClass("modal-open");
    });

    $(document).on("click", "#view__image .btn-close", function () {
      $("div#view__image").removeClass("show");
      $("body").removeClass("modal-open");
    });
    if (localStorage.getItem("name") == "true") {
      document.getElementById("tabs-section").scrollIntoView({
        behavior: "smooth"
      });
    }
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    if (this.caroRecomendations != undefined) {
      this.caroRecomendations.pause();
    }
    this.route.queryParams
      .subscribe(params => {
        if (params.dl) {
          this.isDirectLogin = true;
        }

        this.homeOwnerAddressId = this.userJwtDecodedInfo.HomeOwnerAddressId;

        this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetAllCofigureHomeAddressAttributes").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericResponseTemplateModel<IHomeOwnerAddressAttribute[]>) => {

            this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressIndexPageAdditionalInfo").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((additionalInfo: GenericResponseTemplateModel<IHomeAddressIndexPageAdditionalInfoViewModel>) => {
                this.pageAdditionalInfo = additionalInfo.responseDataModel;
                //console.log("formatenumber", this.pageAdditionalInfo);

                // Phone number formater start
                const cleaned = this.pageAdditionalInfo?.realEstateAgentMessageInfo?.applicationUser?.phone.replace(/\D/g, '');
                const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
                if (match) {
                  this.formatededphoneNumber = '(' + match[1] + ') ' + match[2] + '-' + match[3]
                }
                // Phone number formater end

                this.pageAdditionalInfo?.footerLinks.forEach(foo => {
                  if (foo.linkUrl.startsWith('https://') || foo.linkUrl.startsWith('http://')) {

                  } else {
                    foo.linkUrl = 'https://' + foo.linkUrl;
                  }
                });
                this.isProfileCompleted = !data.responseDataModel.some(x => x.homeOwnerAddressDetailStatusType == 0);
                // if (this.isProfileCompleted) {
                //   this.isKeepDialogClosed = true;
                // } else {
                //  // this.isKeepDialogClosed = this.isForceFullyClosed ? false : true;
                //  var val = localStorage.getItem('firstTimeLogin');
                //  if(val == "1"){
                //  this.isKeepDialogClosed =  false;
                //  localStorage.setItem('firstTimeLogin', '0');
                //  }
                // }
                this.homeOwnerName = additionalInfo.responseDataModel.homeOwnerName;
                this.userStatusType = additionalInfo.responseDataModel.userStatusType;
                this.homeFullAddress = additionalInfo.responseDataModel.fullAddress;
                this.totaRecoSlides = additionalInfo.responseDataModel.homeAddressRecommendationDetailList.length;
                // if(this.authService.isPrevUserId()){
                //   this.isKeepDialogClosed = true;
                //   this.isDirectLogin = false;
                // }
                // else{
                //   if(this.userStatusType=='0'){
                //     this.isKeepDialogClosed = false
                //   }
                //   if(this.userStatusType=='1'){
                //     this.isKeepDialogClosed = true
                //   }
                //   this.isProfileCompleted = !data.responseDataModel.some(x => x.homeOwnerAddressDetailStatusType == 0);
                // }
                var i = 0;
                var j = 0;
                additionalInfo.responseDataModel.homeAddressRecommendationDetailList.forEach(element => {
                  j = 0;
                  if (element.recommendations) {
                    element.recommendations.forEach(recommendation => {
                      additionalInfo.responseDataModel.homeAddressRecommendationDetailList[i].recommendations[j].iconFile
                        = additionalInfo.responseDataModel.homeAddressRecommendationDetailList[i].recommendations[j].iconFile.replace('png', 'svg');
                      j++;
                    });
                  }
                  i++;
                });

                if (additionalInfo.responseDataModel.homeAddressRecommendationDetailList.length > 0) {
                  this.totalRecommendations = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].totalRecommendations;
                  this.currentRecommedationMonthName = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recomendationForMonthName;
                  this.currentRecommedationYear = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recomendationForYear;
                  this.isFirstRecommendationMonth = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].isFirst;
                  this.isLastRecommendationMonth = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].isLast;
                }
                if (additionalInfo.responseDataModel.homeProfileImageBase64 != null) {
                  this.defaultHomePhoto = additionalInfo.responseDataModel.homeProfileImageBase64;
                }
                // var data1 = this.sharingdataService.getHrSharingData();
                // if(data1){
                //  this.toHrSection();
                // }
                this.geAllHOEntry();
                setTimeout(() => {
                  if (this.caroRecomendations != undefined) {
                    this.caroRecomendations.select('slide_' + (this.totaRecoSlides - 1).toString());
                  }
                }, 1000);
               // console.log('dataimag', additionalInfo.responseDataModel.homeAddressRecommendationDetailList[0].recommendations[0].homeRecommendationNotes);
              });
          });
      });
  
  

      this.requestPermission();
      this.listen();

  
    }

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, 
     { vapidKey: environment.firebase.vapidKey}).then(
       (currentToken) => {
         if (currentToken) {
           console.log("Hurraaa!!! we got the token.....");
           console.log(currentToken);
           localStorage.setItem("fb_token",currentToken)
          alert(currentToken);
           const requestOptions = {
             method: 'POST', // GET/POST
             headers: {
               'Authorization': 'Bearer ya29.a0AXooCguz8X9gNo7FD-CYd6_TOPu4UGF83boN0v_vagwijA5IxAeQLs29Zj3904kY8o1wBJRY-XHrpxZMfGIvARDWBXjjzZB9YhEvgmOmVRDrMA5rSm5YzObBd_CZHguysCUW7iCXaDI1agmbxSTP3eFA0R7WKKx3G80gaCgYKAe0SARISFQHGX2MilPmjJ5oVHh8BjDPgan5fcw0171',
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               "message": {
                 "token":currentToken,
                 "notification": {
                   "title": "Hello",
                   "body": "World"
                 },
                 "data": {
                   "key1": "value1",
                   "key2": "value2"
                 }
               }
             }) // Uncomment this line for POST method
           };
           fetch("https://fcm.googleapis.com/v1/projects/traver-lamp/messages:send", requestOptions)
             .then(response => response.json())
             .then(data => console.log(data) );



         } else {
           console.log('No registration token available. Request permission to generate one.');
         }
     }).catch((err) => {
        console.log('An error occurred while retrieving token. ', err);
    });
  }
  listen() {
    const messaging = getMessaging();
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
      this.message=payload;
    });
  }



  
  selectToday(): void {
    const today = new Date();
    this.inputForm1.patchValue({
      startDateJson: {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
      }
    });
  }

  ngAfterViewInit() {
    if (this.isDirectLogin) {
      //this.modalService.open(this.REO_EmailModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => { }, (reason) => { });
    }
    setTimeout(() => {
      if (this.isDirectLogin) {
        this.modalService.open(this.REO_EmailModal, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => { }, (reason) => { });
      }
      if (this.isProfileCompleted) {
        this.isKeepDialogClosed = true;
      } else {
        // this.isKeepDialogClosed = this.isForceFullyClosed ? false : true;
        var val = localStorage.getItem('firstTimeLogin');
        if (val == "1") {
          this.isKeepDialogClosed = false;
          localStorage.setItem('firstTimeLogin', '0');
        }
      }
    }, 2000);
  }
  geAllHOEntry() {
    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetAllHomeOwnerEntry").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<INewEntry[]>) => {

        // setTimeout(() => {
        //   localStorage.setItem("loaderStatus", "");
        // }, 3000);

        //  this.modalService.dismissAll();
        this.newEntryList = data.responseDataModel;
        this.newEntryList.forEach(list => {
          list.startedOn = this.datepipe.transform(list.startOn, 'MMM d, y');
          if (list.rememberMeType == 1) {
            // let n =new Date(list.startOn);
            var d = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + 1 + list.rememberMe), 'MMM d, y');
            list.nextOn = new Date(d);
            if (list.rememberMe > 1) {
              var m = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y ') + '' + '(' + list.rememberMe + ' Months)';
              //list.nextOnReminder1 = new Date(list.startOn).getTime();
              //list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Months)';
              //list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y ') + '' + '(' + list.rememberMe + ' Month)';

              //if (list.recommendationRefId != 0) {
                list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe)) + '' + '(' + list.rememberMe + ' Months)';
                list.nextOnReminder2 = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              //}
              // else {
               //  list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Months)';
              // }
              //list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Months)';
              list.nextOnReminder1 = new Date(list.nextOnReminder2.replace(/@/, '')).getTime();
              //console.log('if c 2r', list.nextOnReminder2);
              //alert('nextOnReminder1: ' + list.nextOnReminder1);
              //list.nextOnReminder1 = Date.parse(this.datepipe.transform(m, 'MMM d, y @ h:mm a'));
              // const parsedDate = Date.parse(m);
              // const dateObject = new Date(this.datepipe.transform(parsedDate, 'MMM d, y @ h:mm a'));
              // list.nextOnReminder1 = dateObject.getTime();
              // console.log(list.nextOnReminder1);
              // list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              // list["nextReminderDate"] = new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe);
              //   var m = new Date(Date.now());
              //   var n = new Date(this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)');
              //   var newDate = list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              //  if (n >= m)
              //  {
              //   list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              //  }
              //  else{
              //   list.nextOnReminder = list.nextOnReminder = this.datepipe.transform(new Date(newDate).setMonth(new Date(newDate).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              //  }
            }
            else {
              var m = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y') + '' + '(' + list.rememberMe + ' Month)';
              //list.nextOnReminder1 = new Date(list.startOn).getTime();
              // alert('nextOnReminder2: ' + list.nextOnReminder1);
              //list.nextOnReminder1 = Date.parse(this.datepipe.transform(m, 'MMM d, y @ h:mm a'));
              // const parsedDate = Date.parse(m);
              // const dateObject = new Date(this.datepipe.transform(parsedDate, 'MMM d, y @ h:mm a'));
              // list.nextOnReminder1 = dateObject.getTime();
              // console.log(list.nextOnReminder1);
              // const date = new Date();
              // const formattedDate = date.toLocaleDateString('en-GB', {
              //   day: '2-digit', month: 'short', year: 'numeric'
              // }).replace(/ /, ' ') + ' @ ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });              
              // var datum = Date.parse(formattedDate);
              // console.log('date',new Date(list.startOn).getTime());
              //list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
               list.nextOnReminder = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y') + '' + '(' + list.rememberMe + ' Month)';
               list.nextOnReminder2 = this.datepipe.transform(new Date(list.startOn).setMonth(new Date(list.startOn).getMonth() + list.rememberMe), 'MMM d, y @ h:mm a') + '' + '(' + list.rememberMe + ' Month)';
              list.nextOnReminder1 = new Date(list.nextOnReminder2.replace(/@/, '')).getTime();
              //console.log('if c 2r', list.nextOnReminder);
            }
          }
        });
        //this.historyLogList = this.newEntryList.filter((item: any) => item.nextOn <= Date.now());
        //this.newEntryList = this.newEntryList.filter((item: any) => item.nextOn >= Date.now());
        this.historyLogList = this.newEntryList.filter((item: any) => item.nextOnReminder1 <= Date.now());
        this.newEntryList = this.newEntryList.filter((item: any) => item.nextOnReminder1 >= Date.now());
        //alert('Date now: ' + Date.now());
        //var currentDate = new Date().setMonth(new Date().getMonth() + 0);
        // this.historyLogList = this.newEntryList.filter((item: any) => item.nextReminderDate <= currentDate);
        //this.newEntryList = this.newEntryList.filter((item: any) => item.nextReminderDate >= currentDate);
      });
  }

  open1(content,entryId) {
    this.entryId = entryId;
    this.cancelAccountAlertModel = this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }); 
  }

    onConfirmationModal_No(){
    this.cancelAccountAlertModel.close()
  }

  onConfirmationModal_Yes(entryId){
    this.cancelAccountAlertModel.close();
    this.deleteMessages(entryId);
  }

  deleteMessages(entryId){
    this.appHttpRequestHandlerService.httpGet({ entryId: entryId}, "HomeOwnerAddress", "DeleteEntryByIds").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericServiceResultTemplate) => {
      this.toastService.show("","Deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
      this.modalService.dismissAll();
      this.geAllHOEntry();
    });
  }
  openAddNewEntryModal(entryId: number, content, data: INewEntry): NgbModalRef {
    this.entryId = entryId;
    this.inputForm.reset();
    this.profilePhoto = null;
    this.submitted = false;
    if (data != undefined) {
      this.inputForm.patchValue({
        homeOwnerEntryId: entryId,
        title: data.title,
        descriptionText: data.descriptionText,
        imageFile: '',
        imageFileBase64: '',
        homeOwnerEntryImages: data.homeOwnerEntryImages,
        rememberMe: data.rememberMe,
        createdOn: data.createdOn,
        startOn: data.startOn,
        lastModifiedOn: new Date(),
        rememberMeType: data.rememberMeType,
        startedOn: new Date(),
        startDateJson: {
          year: new Date(data.startOn).getFullYear(),
          month: new Date(data.startOn).getMonth() + 1,
          day: new Date(data.startOn).getDate()
        },
      });
      this.startedOn = this.datepipe.transform(data.startOn, 'MMM d, y @ h:mm a');
      this.historyLogDescriptionText = this.formControls.descriptionText.value;
      this.profilePhoto = data.homeOwnerEntryImages;
    }
    if (data == undefined) {
      this.inputForm.patchValue({
        homeOwnerEntryId: 0,
        title: '',
        descriptionText: '',
        imageFile: '',
        imageFileBase64: '',
        rememberMe: 0,
        createdOn: new Date(),
        startOn: new Date(),
        lastModifiedOn: new Date(),
        rememberMeType: '',
        startedOn: new Date(),
        startDateJson: '',
      });
      this.profilePhoto = null;
    }
    return this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
  }
  passClickToProfileFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onProfilePhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropModalReference = this.openCropImageModal(this.cropImageModal);
    }
  }
  onRemoveImage() {
    this.profilePhoto = null;
    this.inputForm.controls.imageFileBase64.patchValue(this.profilePhoto);
    this.inputForm.controls.imageFile.patchValue(this.profilePhoto);
  }
  removeImage(index: number) {
    this.profilePhoto.splice(index, 1);
  }
  onCancelCropImageModal() {
    this.cropModalReference?.close('Close click')
  }
  openCropImageModal(content): NgbModalRef {
    this.entryImg = this.modalService.open(content, { size: 'lg', backdrop: 'static', keyboard: false });
    return this.entryImg;
  }
  setTabCode(tabCode: number) {
    this.tabCode = tabCode;
    if (tabCode == 1) {
      // this.geAllHOEntry();
      // this.ngOnInit();
      window.location.reload();
    }
    if (tabCode == 2) {
      this.geAllHOEntry();
    }

  }
  onClickEditHomeDetail() {
    this.router.navigate(['/HomeAddress/ManageHomeDetails']);
  }
  closeDialog() {
    this.isKeepDialogClosed = true;
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.commonOpsService.isForceFullyClosed.next(false);
  }
  open(content) {
    this.show = false;
    this.customModal = this.modalService.open(content, { size: 'lg', centered: true });

  }
  showNextMonthRecomendations(caroRecomendations) {
    caroRecomendations.next();

  }
  showPreviousMonthRecomendations(caroRecomendations) {
    caroRecomendations.prev();
  }
  showPreviousarticle(carArticle) {
    carArticle.prev();
  }
  showNextarticle(carArticle) {
    carArticle.next();
  }
  onSlide(event) {
    let currIndex = event.current.split('_')[1];
    this.totalRecommendations = this.pageAdditionalInfo.homeAddressRecommendationDetailList[currIndex].totalRecommendations;
    this.currentRecommedationMonthName = this.pageAdditionalInfo.homeAddressRecommendationDetailList[currIndex].recomendationForMonthName;
    this.currentRecommedationYear = this.pageAdditionalInfo.homeAddressRecommendationDetailList[currIndex].recomendationForYear;
    this.isFirstRecommendationMonth = this.pageAdditionalInfo.homeAddressRecommendationDetailList[currIndex].isFirst;
    this.isLastRecommendationMonth = this.pageAdditionalInfo.homeAddressRecommendationDetailList[currIndex].isLast;
  }

  openRecommendationModal(content, homeAddressRecommendationId: number, homeRecomendationListIndex: number, recommendationIndex: number, caroRecomendations: any) {
    caroRecomendations.pause();
    //this.ngOnInit();
    this.modalBool = false;
    this.recommendationImage = '';
    this.recommendationLinks = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].recommendationLinks;
    this.descriptionText = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].descriptionText;
    this.recommendationTitle = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].recommendationTitle;
    this.lastModifiedOn = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].lastModifiedOn;
    const isoDate = this.lastModifiedOn;
    this.formattedDate = this.datepipe.transform(isoDate, 'MMMM d, y');
    this.appHttpRequestHandlerService.httpGet({ imageName: this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].imageFile },
      "CommonApi", "getImageBlob").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        if (data != null) {
          this.recommendationImage = data.imageBase64;
        }
      });
      this.iconFile1 = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].iconFile;
    if (this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].homeRecommendationNotes != null) {
      this.profilePhoto =this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].homeRecommendationNotes.homeOwnerEntryImages;
      this.historyLogDescriptionText =this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].homeRecommendationNotes.descriptionText;
      this.isShownNextButton = true;
      this.homeOwnerEntryId = this.pageAdditionalInfo.homeAddressRecommendationDetailList[homeRecomendationListIndex].recommendations[recommendationIndex].homeRecommendationNotes.homeOwnerEntryId;
      if( this.profilePhoto.length >= 2)
        {
         this.isImageData = true;
        }
        else{
          this.isImageData = false;
        }
        
    }
    else {
      this.homeOwnerEntryId = 0;
      this.isNotesData = true;
      
    }
    this.homeAddressRecommendationId = homeAddressRecommendationId;
    this.homeRecomendationListIndex = homeRecomendationListIndex;
    this.recommendationIndex = recommendationIndex;
    // this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => { }, (reason) => { });
  }
  setRecommendationStatus(homeAddressRecommendationStausType: number) {
    this.appHttpRequestHandlerService.httpGet({ homeAddressRecommendationId: this.homeAddressRecommendationId, homeAddressRecommendationStausType: homeAddressRecommendationStausType }, "HomeOwnerAddress", "SetHomeAddressRecommendationStatus").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.pageAdditionalInfo.homeAddressRecommendationDetailList[this.homeRecomendationListIndex].recommendations[this.recommendationIndex].homeAddressRecommendationStausType = homeAddressRecommendationStausType;
        this.modalService.dismissAll();
      });
  }
  onModalCloseClick() {
    this.modalService.dismissAll();
  }
  getPassedData(data: SlidesOutputData) {
    this.activeSlides = data;
  }
  getFooterLinksBySourceType(sourceType: number) {
    return this.pageAdditionalInfo?.footerLinks.filter(x => x.footerLinkSourceType == sourceType);
  }
  onPhotoBrowserInputChange(event, targetImageElementId, aspectRatio) {
    if (event.target.value.length) {
      this.fileUploadEventObject = event;
      this.targetImageElementId = targetImageElementId;
      this.aspectRatio = aspectRatio;
      this.cropBannerReference = this.modalService.open(this.cropImageModal);
    }
  }
  passClickToFileInput(browserInputId: string) {
    document.getElementById(browserInputId).click();
  }
  onCancelAccountModelNoClick() {
    this.cropModalReference?.close('Close click');
    this.cropBannerReference?.close('Close click');
  }
  onCancelAccountModelNoClick1() {
    $(".flip_modal_upper_wrapper").removeClass("show");
    $("body").css("overflow-y","auto");
    $(".flip_modal_wrapper").removeClass("flip safari");
  }
  onCloseAllModels(value: string) {
    if (this.entryId > 0 && value != '1') {
      this.geAllHOEntry();
    }
    this.modalService.dismissAll();
  }
  onImageCropper(croppedImageInfo: any) {
    this.cropBannerReference?.close();
    this.cropModalReference?.close();
    if (croppedImageInfo.targetImageElementId == 'homePhotoImgElement') {
      this.modalService.dismissAll();
      this.defaultHomePhoto = croppedImageInfo.croppedImage;
      (<HTMLInputElement>document.getElementById('homePhotoBrowserInput')).value = '';
      this.appHttpRequestHandlerService.httpPost({ homeOwnerAddressId: this.homeOwnerAddressId, homeProfileImageBase64: this.defaultHomePhoto }, "HomeOwnerAddress", "UpdateHomeAddressPhoto").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("", "Submitted", 3000, "bg-success text-white", "fa-check-circle");
          //this.ngOnInit();
          window.location.reload();
          this.geAllHOEntry();
        });
    }
    if (croppedImageInfo.targetImageElementId == 'profilePhotoImgElement') {
      if (this.profilePhoto == null) {
        this.profilePhoto = [];
      }
      this.profilePhoto.push({ imageFileBase64: croppedImageInfo.croppedImage });
      this.inputForm.controls.homeOwnerEntryImages.patchValue(this.profilePhoto);
      this.inputForm1.controls.homeOwnerEntryImages.patchValue(this.profilePhoto);
      var img = new Image();
      img.src = croppedImageInfo.croppedImage;
      img.addEventListener('load', function () {
        var width = img.width;
        var height = img.height;
        var size = img.sizes;
      });
      this.entryImg.close();
    }
  }
  openProfileManagerPage() {
    this.router.navigate(['/Account/Settings']);
  }
  saveEntry() {
    this.submitted = true;
    this.inputForm.controls.homeOwnerAddressRefId.patchValue(this.homeOwnerAddressId);
    this.inputForm.controls.rememberMeType.patchValue(1);
    // this.inputForm.controls.homeOwnerEntryImages.patchValue(this.profilePhoto);
    if (this.inputForm.valid) {

      this.modalService.dismissAll();
      let u = new Date(this.inputForm.controls.startDateJson.value.year, this.inputForm.controls.startDateJson.value.month - 1, this.inputForm.controls.startDateJson.value.day + 1);
      let y = u.setUTCHours(19, 0, 0); // Set the hour to 19 (7 PM) in UTC
      this.inputForm.controls.rememberMe.patchValue(Number(this.inputForm.controls.rememberMe.value));
      this.inputForm.controls.startOn.patchValue(new Date(y));
      // this.inputForm.controls.startOn.patchValue(new Date(this.inputForm.controls.startDateJson.value.year, this.inputForm.controls.startDateJson.value.month - 1, this.inputForm.controls.startDateJson.value.day + 1));
      // this.inputForm.controls.startOn.patchValue(new Date(this.inputForm.controls.startDateJson.value.year, this.inputForm.controls.startDateJson.value.month - 1, this.inputForm.controls.startDateJson.value.day,24,30,0));
      //this.inputForm.controls.startOn.patchValue(new Date(this.inputForm.controls.startDateJson.value.year, this.inputForm.controls.startDateJson.value.month - 1, this.inputForm.controls.startDateJson.value.day + 1, 0, 30));
      this.inputForm.controls.startDateJson.patchValue(JSON.stringify(this.inputForm.controls.startDateJson.value));
      this.inputForm.controls.rememberMeType.patchValue(1);
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "HomeOwnerAddress", "AddNewHomeOwnerEntry").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("", "Submitted", 3000, "bg-success text-white", "fa-check-circle");
          //this.sharingdataService.geAllHOEntry();
          this.geAllHOEntry();
        });
    }
  }
  openArticleViewModal(articleId: number, content) {
    this.isGoBack = false;
    this.appHttpRequestHandlerService.httpGet({ id: articleId }, "Article", "GetArticleById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IArticle>) => {
        this.selectedArticle = data.responseDataModel;
        this.appHttpRequestHandlerService.httpGet({ id: articleId, userId: this.userJwtDecodedInfo.UserId }, "Article", "AddViewToArticle").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericServiceResultTemplate) => { });
        this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true, }).result.then((result) => { }, (reason) => { });
      });
  }
  dismissAllModals() {
    this.isGoBack = true;
    this.modalService.dismissAll();
  }

  toHrSection() {
    document.getElementById("tabs-section").scrollIntoView({
      behavior: "smooth"
    })
    this.sharingdataService.setHrSharingData(false);
  }
  openAddNewNotesHistoryModalDetail(homeOwnerEntryId: number, content) {
    this.submitted = false;
    if (homeOwnerEntryId != 0) {
      this.appHttpRequestHandlerService.httpGet({ homeOwnerEntryId: homeOwnerEntryId }, "HomeOwnerAddress", "GetHomeOwnerEntryForRecommendationLog").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<INewEntry[]>) => {
          this.newEntryList = data.responseDataModel;
          this.startedOn = this.datepipe.transform(this.newEntryList[0].startOn, 'MMM d, y');
          this.nextOnReminder = this.datepipe.transform(new Date(this.newEntryList[0].startOn).setMonth(new Date(this.newEntryList[0].startOn).getMonth() + this.newEntryList[0].rememberMe)) + '' + '(' + this.newEntryList[0].rememberMe + ' Months)';
          this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered: true, }).result.then((result) => { }, (reason) => { });
          //console.log('datadetails',this.newEntryList);
        });
    }
  }

  openHistoryRecommendationDetails(homeOwnerAddressId: number, recommendationRefId:number) {
    this.submitted = false;
      this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: homeOwnerAddressId, recommendationRefId: recommendationRefId}, "HomeOwnerAddress", "GetHomeAddressIndexPageAdditionalSingleInfo").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((additionalInfo: GenericResponseTemplateModel<IHomeAddressIndexPageAdditionalInfoViewModel>) => {
        this.pageAdditionalInfo = additionalInfo.responseDataModel;
        this.modalBool = false;
        this.recommendationImage = '';
        this.recommendationLinks = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].recommendationLinks;
        this.descriptionText = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].descriptionText;
        this.recommendationTitle = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].recommendationTitle;
        this.lastModifiedOn = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].lastModifiedOn;
        const isoDate = this.lastModifiedOn;
        this.formattedDate = this.datepipe.transform(isoDate, 'MMMM d, y');
        this.appHttpRequestHandlerService.httpGet({ imageName: this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].imageFile },
          "CommonApi", "getImageBlob").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: any) => {
            if (data != null) {
              this.recommendationImage = data.imageBase64;
            }
          });
          this.iconFile1 = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].iconFile;
        if (this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].homeRecommendationNotes != null) {
          this.profilePhoto =this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].homeRecommendationNotes.homeOwnerEntryImages;
          this.historyLogDescriptionText =this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].homeRecommendationNotes.descriptionText;
          this.isShownNextButton = true;
          this.homeOwnerEntryId = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].homeRecommendationNotes.homeOwnerEntryId;
          if( this.profilePhoto.length >= 2)
            {
             this.isImageData = true;
            }
            this.isNotesData = true;
        }
        else {
          this.homeOwnerEntryId = 0;
        }
        this.homeAddressRecommendationId = this.pageAdditionalInfo.homeAddressRecommendationDetailList[0].recommendations[0].homeAddressRecommendationId;
        });
  }

  openAddNewNotesHistoryModal(homeOwnerEntryId: number, recommendationRefId: number, statusBool) {
    this.modalBool = true;
    this.recommendationRefId = recommendationRefId;
    this.inputForm1.reset();
    this.profilePhoto = null;
    this.submitted = false;
    if (homeOwnerEntryId != 0) {
      this.appHttpRequestHandlerService.httpGet({ homeOwnerEntryId: homeOwnerEntryId }, "HomeOwnerAddress", "GetHomeOwnerEntryById").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<INewEntry[]>) => {
          this.newEntryList = data.responseDataModel;
          if (data != undefined) {
            this.inputForm1.patchValue({
              homeOwnerEntryId: homeOwnerEntryId,
              recommendationRefId: recommendationRefId,
              title: 'null',
              descriptionText: this.newEntryList[0].descriptionText,
              imageFile: '',
              imageFileBase64: '',
              homeOwnerEntryImages: this.newEntryList[0].homeOwnerEntryImages,
              rememberMe: this.newEntryList[0].rememberMe,
              createdOn: this.newEntryList[0].createdOn,
              startOn: this.newEntryList[0].startOn,
              lastModifiedOn: new Date(),
              rememberMeType: this.newEntryList[0].rememberMeType,
              startedOn: new Date(),
              startDateJson: {
                year: new Date(this.newEntryList[0].startOn).getFullYear(),
                month: new Date(this.newEntryList[0].startOn).getMonth() + 1,
                day: new Date(this.newEntryList[0].startOn).getDate()
              },
            });
          if(statusBool === 1)
            {
             this.geAllHOEntry();
            }
            this.startedOn = this.datepipe.transform(this.newEntryList[0].startOn, 'MMM d, y @ h:mm a');
            this.historyLogDescriptionText = this.formControls1.descriptionText.value;
            this.profilePhoto = this.newEntryList[0].homeOwnerEntryImages;
            if(this.profilePhoto.length === 0)
              {
              this.isNoImg = true;
              }
              else{
                this.isNoImg = false;
              }
            this.isShownNextButton = true;
            this.recommendationRefId = this.recommendationRefId;
          }
        });
    }
    else {
      this.inputForm1.patchValue({
        homeOwnerEntryId: 0,
        title: '',
        descriptionText: '',
        imageFile: '',
        imageFileBase64: '',
        rememberMe: 0,
        createdOn: new Date(),
        startOn: new Date(),
        lastModifiedOn: new Date(),
        rememberMeType: '',
        startedOn: new Date(),
        startDateJson: '',
      });
    }
    this.isShownNextButton = false;
  }
  saveLogEntry() {
    this.submitted = true;
    if(this.homeAddressRecommendationId === undefined)
      {
        this.inputForm1.controls.recommendationRefId.value;
      }
      else{
        this.inputForm1.controls.recommendationRefId.patchValue(this.homeAddressRecommendationId);
      }
    this.inputForm1.controls.homeOwnerAddressRefId.patchValue(this.homeOwnerAddressId);
    this.inputForm1.controls.rememberMeType.patchValue(1);
    if (this.inputForm1.controls.descriptionText.value === '' || this.inputForm1.controls.descriptionText.value === null) {
      this.inputForm1.controls.descriptionText.patchValue('');
    }
    else {
      this.inputForm1.controls.descriptionText.value;
    }
    // if(this.inputForm1.controls.startDateJson.value === null || this.inputForm1.controls.startDateJson.value === '')
    //   {
    //     const newDate = new Date();
    //     const year = newDate.getFullYear();
    //     const month = newDate.getMonth() + 1; // Adding 1 because months are zero-based
    //     const day = newDate.getDate();
    //     const jsonObject = { year: year };
    //     const jsonObject1 = { month: month };
    //     const jsonObject2 = { day: day };
    //    // Convert the JSON object to a JSON string
    //    this.inputForm1.controls.startDateJson.value.year = JSON.stringify(jsonObject);
    //    this.inputForm1.controls.startDateJson.value.month = JSON.stringify(jsonObject1);
    //    this.inputForm1.controls.startDateJson.value.day = JSON.stringify(jsonObject2);
    //     u = new Date(year, month - 1, day + 1);
    //   }
    //   else
    //   {
    //     u = new Date(this.inputForm1.controls.startDateJson.value.year, this.inputForm1.controls.startDateJson.value.month - 1, this.inputForm1.controls.startDateJson.value.day + 1);
    //   }
    // u = new Date(this.inputForm1.controls.startDateJson.value.year, this.inputForm1.controls.startDateJson.value.month - 1, this.inputForm1.controls.startDateJson.value.day + 1);
    if (this.inputForm1.valid) {
      $(".flip_modal_wrapper").removeClass("flip safari");
      $("body").css("overflow-y","auto");
      $(".flip_modal_upper_wrapper").removeClass("show");
      let u = new Date(this.inputForm1.controls.startDateJson.value.year, this.inputForm1.controls.startDateJson.value.month - 1, this.inputForm1.controls.startDateJson.value.day + 1);
      let y = u.setUTCHours(19, 0, 0); // Set the hour to 19 (7 PM) in UTC
      this.inputForm1.controls.rememberMe.patchValue(Number(12));
      this.inputForm1.controls.startOn.patchValue(new Date(y));
      //this.inputForm1.controls.startDateJson.patchValue(JSON.stringify(this.inputForm1.controls.startDateJson.value));
      this.inputForm1.controls.rememberMeType.patchValue(1);
      this.appHttpRequestHandlerService.httpPost(this.inputForm1.value, "HomeOwnerAddress", "AddNewHomeOwnerEntry").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          if (data.hasException === false && this.homeAddressRecommendationId !== undefined) {
            this.appHttpRequestHandlerService.httpGet({ homeAddressRecommendationId: this.homeAddressRecommendationId, homeAddressRecommendationStausType: 1 }, "HomeOwnerAddress", "SetHomeAddressRecommendationStatus").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((data: GenericResponseTemplateModel<boolean>) => {
                //this.pageAdditionalInfo.homeAddressRecommendationDetailList[this.homeRecomendationListIndex].recommendations[this.recommendationIndex].homeAddressRecommendationStausType = 1;
              });
              this.ngOnInit();
              if( this.homeAddressRecommendationId === undefined)
                {
                 this.geAllHOEntry();
                }
          }
        });
      
    }
  }

  getFirstDayOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(),17);
  }

  isSameDate(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  
}
