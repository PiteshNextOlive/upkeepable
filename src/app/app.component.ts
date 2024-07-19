import { Component,OnInit, HostListener, Renderer2} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NavigationEnd, NavigationStart } from '@angular/router';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; import { MessageService } from './message.service';
import { AppHttpRequestHandlerService } from './shared/app-http-request-handler.service';
import { filter } from 'rxjs/operators';
import { UserJwtDecodedInfo } from './account/account-type-module';
import {EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel,GenericServiceResultTemplate, IState, TForm, INotification } from './generic-type-module';
import { AccountService } from './account/account.service';
import { takeUntil } from 'rxjs/operators';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ContacTypeModel } from './account/account-type-module';
import { AppToastService } from './toast/app-toast.service';
import Swal from 'sweetalert2';
import { SharedService } from 'src/app/shared.service';
import { IPriceEntry } from './home-owner-address/home-owner-address-type-module';
import { PushNotificationService } from './push-notification.service';
import { getMessaging, getToken, onMessage } from "firebase/messaging";

@Component({
  //moduleId: module.id,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  message:any = null;
  private title1: string = 'Browser Push Notifications!';
 isClassApplied = false;
 //istoggleclass = false;
  addClass() {
    this.isClassApplied = true;
  }

  removeClass() {
    this.isClassApplied = false;
  }


  // addtoggle(){
  //   this.istoggleclass = true;
  // }

  // removetoggle() {
  //   this.istoggleclass = false;
  // }

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  submitted = false;  
  title = 'UpKeepable';
  public subscription: Subscription;
  homeOwnerAddressId: number;
  defaultProfilePhoto: string = environment.defaultProfilePhoto;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  menuCode: string='';
  currentURL: string;
  date = new Date();
  sub: Subscription;
  isNewHomeOwner: boolean=false;
  prevUserId:string=null;
  notifications: INotification[]=[];
  isShowNotificationClicked:boolean=false;
  hasLatestNotification:boolean=false;
  areREAMenuShown: boolean=true;
  isManageCard: boolean=false;
  inputForm1: TForm<IPriceEntry> = this.fb.group({
    Price_amount: [0, Validators.required]

}) as TForm<IPriceEntry>;
get formControls1() { return this.inputForm1.controls; }
  constructor(
  
    private _notificationService: PushNotificationService,
    // private messageService: MessageService,    
    private modalService: NgbModal, 
    private sharedService: SharedService,
    private renderer: Renderer2, 
    public authService: AuthService,
    private accountService: AccountService,
    private fb: UntypedFormBuilder,    
    public commonOpsService: CommonOpsService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,    
    public toastService: AppToastService,
    private router: Router,
    private route: ActivatedRoute) {
    
      this._notificationService.requestPermission();
      this.areREAMenuShown=true;
    // this.subscription = this.messageService.getHomeOwnerAddressId().subscribe(msg => { this.homeOwnerAddressId = msg })
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
       
       
        if(event.url.includes('Manage-Cards')){
          this.isManageCard=true;
        }

        if(document.getElementById('mobileMenuButton')){
          document.getElementById('mobileMenuButton').classList.add('collapsed')
        }
        

        if(this.authService.isUserLoggedIn()){
          this.getAllUnreadNotifications(this.authService.getUserJwtDecodedInfo().UserId);
        }

       
        if(event.url.includes('Dashboard') || event.url.includes('AllClients')){
          this.menuCode='Dashboard';
        }
        else if(event.url.includes('Details')){
          this.menuCode='Details';
        }
        else if(event.url.includes('Messages')){
          this.menuCode='Messages';
        }
        else if(event.url.includes('home-variables-manager')){
          this.menuCode='home-variables-manager';
        }
        
        else{
          this.menuCode='';
        }
        if(window.location.href.includes('QRClientbyAgent')){
          this.router.navigate([window.location.href]);
        }

        if(event.url.includes('CompleteProfileSteps') || event.url.includes('success') || event.url.includes('canceled') || event.url.includes('Pick-A-Product')){
          this.areREAMenuShown=false;
        }

        //if (event.url.includes('Dashboard')) {

          // if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
          //   this.menuCode='CL';
          // }
          // else if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
          //   this.menuCode='UpKeep';
          // }
          // else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
          //   this.menuCode='Dashboard';
          // }

          this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();         
          if (this.userJwtDecodedInfo) {
            if(this.userJwtDecodedInfo.RoleName=='ADMIN_USER'){
              this.defaultProfilePhoto = environment.defaultProfilePhoto; 
            }
            else{
              if(this.userJwtDecodedInfo.UserImage!='' && this.userJwtDecodedInfo.UserImage!=null && this.isManageCard==false){
                this.appHttpRequestHandlerService.httpGet({ imageName: this.userJwtDecodedInfo.UserImage }, "CommonApi", "getImageBlob")
                .pipe(takeUntil(this.ngUnsubscribe))
                  .subscribe((data: any) => {
                    if (data != null) {
                      if(data.imageBase64==null || data.imageBase64.length==0){
                        this.defaultProfilePhoto = environment.defaultProfilePhoto;  
                      }
                      else{
                        this.defaultProfilePhoto = data.imageBase64;
                      }
                    }
                    else{
                      this.defaultProfilePhoto = environment.defaultProfilePhoto;
                    }
                  });
                } else {
                  this.defaultProfilePhoto = environment.defaultProfilePhoto;
                }
              } 
            }
        //}
      });
      this.renderer.listen('window', 'click', (event: Event) => {
        var classList = (<HTMLElement>event?.target)?.id;
        if(classList!='mobileMenuButton'){
          document.getElementById('mobileMenuButton')?.classList?.add('collapsed');
          
        }
      });
  }
  inputForm: TForm<ContacTypeModel> = this.fb.group({
    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    message: ['',[Validators.required]]
    }) as TForm<ContacTypeModel>;
    get formControls() { return this.inputForm.controls; }

    ngOnInit(): void {
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

   
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   // console.log('document.location',document.location);
 // console.log('ev',event);
   if(window.location.href.includes('Admin')&& window.location.href.includes('Dashboard')){
    if(this.prevUserId!=null){
      this.directLogin(this.prevUserId);
    }
   }
  }
  ngAfterContentInit() {
    this.sub = this.sharedService.send_data.subscribe(
      data => {
        if(data==true){
          if(localStorage.getItem("NewHomeOwner")=="true"){
             this.isNewHomeOwner = true;
          }
          else{
            this.isNewHomeOwner = false;
          }
        }
      }
    )
  }
  ngAfterViewInit(){
    this.prevUserId = localStorage.getItem('APID')
    // this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    // if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
    //   this.menuCode='CL';
    // }
    // else if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
    //   this.menuCode='UpKeep';
    // }
    // else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
    //   this.menuCode='Dashboard';
    // }
  }
  getAllUnreadNotifications(userId){
    if(this.isManageCard==false){
      this.appHttpRequestHandlerService.httpGet({ id: userId }, "NotificationManager", "GetAllUnreadNotifications")
      .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<INotification[]>) => {
         this.notifications = data.responseDataModel;
         //if(this.notifications.length>0){
          this.isShowNotificationClicked=false;
          this.hasLatestNotification = this.notifications.some(x=>x.notificationStatusType==0);
         //}
        });
    }
    
  }
  onCloseAllModels() {
    this.modalService.dismissAll();
  }
  openAddPriceModal(entryId:number, content, data:IPriceEntry): NgbModalRef {
    
    if(data==undefined){
      this.inputForm1.patchValue({
        Price_amount: 0,
    });
    }
    return this.modalService.open(content, {  size: 'lg', backdrop: 'static',keyboard: false });
  }

  saveEntry(){
  
    if (this.inputForm1.valid) {
      this.modalService.dismissAll();
      this.appHttpRequestHandlerService.httpPost(this.inputForm1.value, "CommonApi", "PriceSave").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        });
    }
  }
  onClickUpkeep(menuCode: string) {
    
    this.menuCode=menuCode;
    this.router.navigate(['/HomeAddress/Dashboard']);
  }
  onClickHome(menuCode: string) {
    this.menuCode=menuCode;
    this.router.navigate(['/HomeAddress/Details']);
  }
  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }
  openProfileManagerPage() {
    // if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER' && this.authService?.getUserJwtDecodedInfo()?.IsAgree =='True'){
    //   this.router.navigate(['/Account/Settings']);
    // }
    // if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER' && this.authService?.getUserJwtDecodedInfo()?.IsAgree =='True'){
    //   this.router.navigate(['/Account/Settings']);
    // }
    // if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
    //   this.router.navigate(['/Account/Settings']);
    // }
    var currentURL = window.location.href;  
   
    if(currentURL.split("/")[4]=="Settings")
      {
        if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER')
          {
            this.router.navigate(['/RealEstateAgent/Dashboard']);
          }
          if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER')
            {
              this.router.navigate(['/HomeAddress/Dashboard']);
            }
            if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER')
              {
                this.router.navigate(['Admin/Dashboard']);
              }
        
      }
      else{
        this.router.navigate(['/Account/Settings']);
      }   
  }

  onClieckViewAllClients(){
    this.router.navigate(['/RealEstateAgent/AllClients']);
  }
  onClieckViewAllMessages(menuCode: string) {
    this.menuCode=menuCode;
    this.router.navigate(['/RealEstateAgent/Messages']);
  }
  onClieckAdminDashboard(menuCode: string) {
    this.menuCode=menuCode;
    this.router.navigate(['/Admin/Dashboard']);
  }
  onClieckHomeVariables(menuCode: string) {
    this.menuCode=menuCode;
    this.router.navigate(['/Admin/home-variables-manager']);
  }
  navigateToHome(){
    if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER' && (this.userJwtDecodedInfo?.IsAgree =='True'|| this.authService.isPrevUserId())){
      this.router.navigate(['/HomeAddress/Dashboard']);
    }
    else if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER' && (this.userJwtDecodedInfo?.IsAgree =='True'|| this.authService.isPrevUserId())){
      this.router.navigate(['/RealEstateAgent/Dashboard']);
    }
    else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
      this.router.navigate(['/Admin/Dashboard']);
    }
    if((this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER' || this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER') && this.userJwtDecodedInfo?.IsAgree =='False' && (!this.authService.isPrevUserId())){
      this.goToLoginPage();
    }
  }
  openStaticPage(pageName:string){
    this.router.navigate(['/'+pageName]);
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    // else if(this.router.routerState.root.snapshot.firstChild.component["name"] == "QRClientAgentComponent"){
    //   this.router.navigate(['/'+pageName]);
    //   setTimeout(()=>{
    //     window.location.reload();
    //   }, 500);
    // }

  }

  openVideoModal(content) {
    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  onVideoModalCancelClick() {
    this.modalService.dismissAll();
  }
  onRequestClick(){
    this.modalService.dismissAll();
  }
  goToLoginPage(){
   
    this.router.navigate(['/Account/Login']);
  }
  directLogin(userId){
    localStorage.removeItem('APID');
    
    this.appHttpRequestHandlerService.httpGet({"userId": userId}, "AccountManager", "DirectLoginByAdmin").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: string) => {
      if ((<any>data).isAvailable) {
        this.setTokenAndSendUserToHomePage((<any>data).token);
      }
      else {
        //this.isSomethingWentWrong = true;
      }
    });
    //window.open('www.google.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes'); // Open new window
  }

  setTokenAndSendUserToHomePage(token: string) {
    localStorage.setItem("BearerToken", token);
    //window.location.reload();
    this.initiateHomePage();
  }
  initiateHomePage() {
   if (this.accountService.getUserJwtDecodedInfo().RoleName == 'ADMIN_USER') {
      this.router.navigate(['/Admin/Dashboard']);
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    } 
  }
  viewAllNotifications(){
    this.router.navigate(['all-notifications']);
  }
  mobileMenuButtonClick(event){

    var isAlreadyCollapsed = document.getElementById('mobileMenuButton')?.classList?.contains('collapsed');
    if(isAlreadyCollapsed){
      document.getElementById('mobileMenuButton')?.classList?.remove('collapsed')
    }
    else{
      document.getElementById('mobileMenuButton')?.classList?.add('collapsed')
    }
  }
  hasMobileMenuButtonHasClass(){
    return !document.getElementById('mobileMenuButton')?.classList?.contains('collapsed');
  }
  onClickDropNotification(){
    this.isShowNotificationClicked=true;
    this.hasLatestNotification=false;
    this.appHttpRequestHandlerService.httpGet({ id: this.authService.getUserJwtDecodedInfo().UserId }, "NotificationManager", "markReadAllNotifications")
    .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean[]>) => {});
  }

  onSubmit() {
   
    if (!this.inputForm.valid) {
      this.submitted = true;
      return;      
    }
        this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "CommonApi", "ContactForm").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.isClassApplied = false;
          this.inputForm.reset();  
          Swal.fire({
            title: 'We have received your request',
            text: 'Your request has been submitted via email. Please check your inbox for updates',
            icon: 'success', // You can change this to 'success', 'error', 'info', etc.
            confirmButtonText: 'CLOSE'
            //showCloseButton: true
          });               
          //this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        });               
  }

}
