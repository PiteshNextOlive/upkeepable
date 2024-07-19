import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { GenericResponseTemplateModel } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GenericServiceResultTemplate} from 'src/app/generic-type-module';
import { AppToastService } from '../../toast/app-toast.service';
import { IHomeAddressIndexPageAdditionalInfoViewModel } from 'src/app/home-owner-address/home-owner-address-type-module';

@Component({
  selector: 'app-subscription-for-ho',
  templateUrl: './subscription-for-ho.component.html',
  styleUrls: ['./subscription-for-ho.component.css']
})
export class SubscriptionForHoComponent implements OnInit {
  @ViewChild('notificationToggle') notificationToggle: ElementRef;
  IsNotiUserId:string=null;
  isNotificationEnabled: boolean = false;
  text: string;
  prevUserId:string=null;
  homeOwnerAddressId: number;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  pageAdditionalInfo: IHomeAddressIndexPageAdditionalInfoViewModel;
  constructor( 
    private accountService: AccountService,
    private authService: AuthService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    private modalService: NgbModal,
    public toastService: AppToastService) { 
    }

    onNotificationToggle(event: Event): void {
      var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
      this.IsNotiUserId = userJwtDecodedInfo.UserId;
      this.isNotificationEnabled = (event.target as HTMLInputElement).checked;
       console.log('Web Notifications are ' + (this.isNotificationEnabled ? 'enabled' : 'disabled'));  
      const requestData = {
        userId: this.IsNotiUserId,
        isNotificationEnabled: this.isNotificationEnabled
      };
  
      this.appHttpRequestHandlerService.httpPost(requestData, "HomeOwnerAddress", "UpdateNotificationByUserId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {     
        //this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
        });
  
    }


  ngOnInit(): void {



    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.IsNotiUserId = userJwtDecodedInfo.UserId;
    var data2={
     IsNotiUserId:this.IsNotiUserId
    };
    this.appHttpRequestHandlerService.httpPost(data2, "HomeOwnerAddress", "GetNotificationByUserId").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: any) => {  
     console.log("Checkdata",data);  
     if(data == true){
       // this.isNotificationEnabled == true;
       this.notificationToggle.nativeElement.checked = true;
     }
     else{
       // this.isNotificationEnabled == false;
       this.notificationToggle.nativeElement.checked = false;
     }
      });



    this.prevUserId = localStorage.getItem('APID');
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.homeOwnerAddressId = this.userJwtDecodedInfo.HomeOwnerAddressId;
    this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetHomeAddressIndexPageAdditionalInfo").pipe(takeUntil(this.ngUnsubscribe))
              .subscribe((additionalInfo: GenericResponseTemplateModel<IHomeAddressIndexPageAdditionalInfoViewModel>) => {
                this.pageAdditionalInfo = additionalInfo.responseDataModel;
});
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
}