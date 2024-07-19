import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {

  userJwtDecodedInfo: UserJwtDecodedInfo;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    localStorage.removeItem("BearerToken");
  }
  navigateToHome(){
    this.router.navigate(['/Account/Login'])
    // this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    // if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
    //   this.router.navigate(['/HomeAddress/Dashboard'])
    //   .then(() => {
    //     window.location.reload();
    //   });
    // }
    // else if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
    //   this.router.navigate(['/RealEstateAgent/Dashboard']).then(() => {
    //     window.location.reload();
    //   });
    // }
    // else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
    //   this.router.navigate(['/Admin/Dashboard']).then(() => {
    //     window.location.reload();
    //   });
    // }
  } 
}
