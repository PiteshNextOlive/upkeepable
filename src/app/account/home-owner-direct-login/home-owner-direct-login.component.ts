import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { GenericFormModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IDirectLoginViewModel } from '../account-type-module';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
@Component({
  selector: 'app-home-owner-direct-login',
  templateUrl: './home-owner-direct-login.component.html',
  styleUrls: ['./home-owner-direct-login.component.css']
})
export class HomeOwnerDirectLoginComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService) { }
  isSomethingWentWrong: boolean = false;
  inputForm: TForm<IDirectLoginViewModel> = this.fb.group({
      userUniqueIdentityString: ["", Validators.required]
    }) as TForm<IDirectLoginViewModel>;

  get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {
    localStorage.removeItem("BearerToken");
    this.route.queryParams
      .subscribe(params => {
        if (params.info == undefined || params.info == '') {
          this.isSomethingWentWrong = true;
        }
        else {
          this.inputForm.controls.userUniqueIdentityString.patchValue(params.info);
          this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "DirectLogin").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: string) => {                      
            if ((<any>data).isAvailable) {
              this.setTokenAndSendUserToHomePage((<any>data).token);
            }
            else {
              this.isSomethingWentWrong = true;
            }
          });
        }
      });
  }
  setTokenAndSendUserToHomePage(token: string) {    
    localStorage.setItem("BearerToken", token);
    this.initiateHomePage();
  }
  initiateHomePage() {
   
    if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
      this.appHttpRequestHandlerService.httpGet({ homeOwnerUserId: this.accountService.getUserJwtDecodedInfo().UserId }, "HomeOwnerAddress", "GetHomeAddressIdByHomeOwnerUserID").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<number>) => {
        this.router.navigate(['/HomeAddress/Dashboard'],{queryParams: { info: data.formModel, dl:"Y" }});
      });
    } 
    else if(this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER'){
      this.appHttpRequestHandlerService.httpGet({ homeOwnerUserId: this.accountService.getUserJwtDecodedInfo().UserId }, "HomeOwnerAddress", "GetHomeAddressIdByHomeOwnerUserID").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<number>) => {
        this.router.navigate(['/RealEstateAgent/Dashboard']);
      });
    }
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
