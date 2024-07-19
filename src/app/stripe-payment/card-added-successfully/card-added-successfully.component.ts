import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-card-added-successfully',
  templateUrl: './card-added-successfully.component.html',
  styleUrls: ['./card-added-successfully.component.css']
})
export class CardAddedSuccessfullyComponent implements OnInit {  userJwtDecodedInfo: UserJwtDecodedInfo;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }
  navigateToHome(){
    //this.authService.onLogoutClick();
   // localStorage.removeItem("BearerToken");
   // this.router.navigate(['/Account/Login']);
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    // if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
    //   this.router.navigate(['/HomeAddress/Dashboard'])
    //   .then(() => {
    //     window.location.reload();
    //   });
    // }
    // else 
    
    if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
      this.router.navigate(['/RealEstateAgent/Dashboard']).then(() => {
        window.location.reload();
      });
    }
    else{
      this.router.navigate(['/Account/Login']);
    }
  } 

}
