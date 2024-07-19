import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { UserJwtDecodedInfo } from '../account-type-module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { AppToastService } from '../../toast/app-toast.service';
import { GenericServiceResultTemplate} from 'src/app/generic-type-module';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Location } from "@angular/common";
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild('notificationToggle') notificationToggle: ElementRef;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  pageId:number=1;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  homeOwnerAddressId: number=0;
  prevUserId:string=null;
  IsNotiUserId:string=null;
  isNotificationEnabled: boolean = false;
  constructor(public authService:AuthService,private router: Router, private route: ActivatedRoute, private modalService: NgbModal, private appHttpRequestHandlerService: AppHttpRequestHandlerService
    ,public toastService: AppToastService,private location: Location
  ) { }

  // onNotificationToggle(event: Event): void {
  //   var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
  //   this.IsNotiUserId = userJwtDecodedInfo.UserId;
  //   this.isNotificationEnabled = (event.target as HTMLInputElement).checked;
  //    console.log('Web Notifications are ' + (this.isNotificationEnabled ? 'enabled' : 'disabled'));  
  //   const requestData = {
  //     userId: this.IsNotiUserId,
  //     isNotificationEnabled: this.isNotificationEnabled
  //   };

  //   this.appHttpRequestHandlerService.httpPost(requestData, "HomeOwnerAddress", "UpdateNotificationByUserId").pipe(takeUntil(this.ngUnsubscribe))
  //   .subscribe((data: GenericServiceResultTemplate) => {     
  //     //this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
  //     });

  // }

  ngOnInit(): void {
    // var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    //  this.IsNotiUserId = userJwtDecodedInfo.UserId;
    //  var data2={
    //   IsNotiUserId:this.IsNotiUserId
    //  };
    //  this.appHttpRequestHandlerService.httpPost(data2, "HomeOwnerAddress", "GetNotificationByUserId").pipe(takeUntil(this.ngUnsubscribe))
    //  .subscribe((data: any) => {  
    //   console.log("Checkdata",data);  
    //   if(data == true){
    //     // this.isNotificationEnabled == true;
    //     this.notificationToggle.nativeElement.checked = true;
    //   }
    //   else{
    //     // this.isNotificationEnabled == false;
    //     this.notificationToggle.nativeElement.checked = false;
    //   }
    //    });
    

    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
    .subscribe(params => {
      //this.homeOwnerAddressId = params.info;
      if(params.id!=undefined && params.id>0){
        this.homeOwnerAddressId = params.id;
      }
    });
  }
  ngAfterViewInit(){
    this.prevUserId = localStorage.getItem('APID');
   // console.log("this.prevUserId",this.prevUserId);
  }
  OpenPageById(pageId){
   // debugger;
    this.pageId=pageId;
  }

  goBack(): void {
    this.location.back();
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }

  onCancelAccountModelYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost(this.prevUserId, "AccountManager", "SetAccountAsCancelled").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
        this.router.navigate(['/Account/Login']);
      });
  }
  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }
  onClickPaymentDetail(paymentDetailLink: string){
    //document.getElementById(paymentDetailLink).click();
    this.router.navigate(['/Manage-payments']);
  }
  onClickDashboard(){
    if (this.userJwtDecodedInfo.RoleName == 'HOME_OWNER_USER') {
        this.router.navigate(['/HomeAddress/Dashboard']);
    } else if (this.userJwtDecodedInfo.RoleName == 'REAL_ESTATE_USER') {
      this.router.navigate(['/RealEstateAgent/Dashboard']);
    }
  }  

}
