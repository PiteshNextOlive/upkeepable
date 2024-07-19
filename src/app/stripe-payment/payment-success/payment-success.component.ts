import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericResponseTemplateModel } from '../../generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { AccountService } from 'src/app/account/account.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.css']
})
export class PaymentSuccessComponent implements OnInit {
  itemId: string;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private authService: AuthService, private router: Router,
    private accountService: AccountService,private route: ActivatedRoute,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    ) { }

  ngOnInit(): void {
    this.itemId = this.route.snapshot.queryParams['id'];
    this.sendIdToServer(this.itemId);
  }

  sendIdToServer(id: string): void {
    this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({id}, "CommonApi", "PaymentDetails").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
      });
    });
  }
  navigateToHome(){
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
      this.router.navigate(['/HomeAddress/Dashboard'])
      .then(() => {
        window.location.reload();
      });
    }
    else if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
      // this.router.navigate(['/RealEstateAgent/Dashboard']).then(() => {
      //   window.location.reload();
      // });
      this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "AccountManager", "CheckIsUserProfileCompleted").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data1: GenericResponseTemplateModel<boolean>) => {
          if(data1.responseDataModel){
            if(this.accountService.getUserJwtDecodedInfo().IsAgree=='False'){
              this.router.navigate(['/Account/TermsAndConditions']);
            }else{
              this.router.navigate(['/RealEstateAgent/Dashboard']);
            }
          }
          else{
            if(this.accountService.getUserJwtDecodedInfo().IsAgree=='False'){
              this.router.navigate(['/Account/TermsAndConditions']);
            }else{
              this.router.navigate(['/RealEstateAgent/CompleteProfileSteps']);
            }
          }
        });
    }
    else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
      this.router.navigate(['/Admin/Dashboard']).then(() => {
        window.location.reload();
      });
    }
    else{
      this.router.navigate(['/Account/Login']).then(() => {
        window.location.reload();
      });
    }
  } 
}
