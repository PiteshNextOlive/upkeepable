import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';
import { GenericResponseTemplateModel } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { ConfirmProfileStepComponent } from '../confirm-profile-step/confirm-profile-step.component';
import { FooterLinksStepComponent } from '../footer-links-step/footer-links-step.component';
import { MessagesStepComponent } from '../messages-step/messages-step.component';
import { SocialMediaLinksStepComponent } from '../social-media-links-step/social-media-links-step.component';
import { WelcomeMessageStepComponent } from '../welcome-message-step/welcome-message-step.component';
import { AuthService } from '../../../auth.service';
import { LocationStrategy } from '@angular/common';
@Component({
  selector: 'app-complete-profile-wizard',
  templateUrl: './complete-profile-wizard.component.html',
  styleUrls: ['./complete-profile-wizard.component.css']
})
export class CompleteProfileWizardComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  stepCode: number =1;
  maxSteps: number=5;
  IsDisabled: boolean = false;
  @ViewChild('SocialMediaLinksStepComponentTemplate') SocialMediaLinksStepComponentTemplate: SocialMediaLinksStepComponent;
  @ViewChild('WelcomeMessageStepComponentTemplate') WelcomeMessageStepComponentTemplate: WelcomeMessageStepComponent;
  @ViewChild('ConfirmProfileStepComponentTemplate') ConfirmProfileStepComponentTemplate: ConfirmProfileStepComponent;
  @ViewChild('FooterLinksStepComponentTemplate') FooterLinksStepComponentTemplate: FooterLinksStepComponent;
  @ViewChild('MessagesStepComponentTemplate') MessagesStepComponentTemplate: MessagesStepComponent;

  constructor( private router: Router,  public authService: AuthService, private appHttpRequestHandlerService: AppHttpRequestHandlerService, private accountService: AccountService, private location: LocationStrategy) {
    // history.pushState(null, null, window.location.href);
    // // check if back or forward button is pressed.
    // this.location.onPopState(() => {
    //     history.pushState(null, null, null);
    //    window.location.reload();
    // });
  }

  ngOnInit(): void {
  }
  setStepCode(step: number){
    this.stepCode = this.stepCode + step;
  }
  save(){
    if(this.stepCode==1){
      this.SocialMediaLinksStepComponentTemplate.onSubmit();
      if(this.SocialMediaLinksStepComponentTemplate.inputForm.valid==true && this.SocialMediaLinksStepComponentTemplate.invalidSize){
        this.setStepCode(1);
      }else{
        return;
      }
      
    }
    else if(this.stepCode==2){
      if(this.FooterLinksStepComponentTemplate.footerLinks.length>0)
      {
        this.setStepCode(1)
      }
      else{
        this.FooterLinksStepComponentTemplate.onSubmitFooterLink();
        return;
      }

      // if(this.FooterLinksStepComponentTemplate.footerLinks.length==0){
      //   alert('Na bai')
      // }
      // else{
      //   this.setStepCode(1)
      // }
    }
    else if(this.stepCode==3){
      this.WelcomeMessageStepComponentTemplate.onWelcomeMessageFormSubmit();
      if(this.WelcomeMessageStepComponentTemplate.inputFormWelcomeMessage.valid == true)
      {
        this.setStepCode(1);
      }else{
        return;
      }
      
    }
    else if(this.stepCode==4){
      if(this.MessagesStepComponentTemplate.MessageList.length > 0)
      {
        this.setStepCode(1)
      }
      else{
        let p = document.getElementById('msgshow');
         p.removeAttribute("hidden");
        p.outerText;
        return;
      }

      // if(this.FooterLinksStepComponentTemplate.footerLinks.length==0){
      //   alert('Na bai')
      // }
      // else{
      //   this.setStepCode(1)
      // }
    }
    else if(this.stepCode==5){
      if(this.ConfirmProfileStepComponentTemplate.invalidSize){
        this.ConfirmProfileStepComponentTemplate.onSubmit();
      this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId, flag: true}, "AccountManager", "SetIsUserProfileCompleted").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data1: GenericResponseTemplateModel<boolean>) => {
          this.stepCode=this.maxSteps+1;
            //this.navigateToHome();
            //this.router.navigate(['/RealEstateAgent/Dashboard']);
           
          });
      }
    }
    else{
      this.setStepCode(1)
    }
  }

  onClickSetStepEvent(event){
    this.stepCode=event;
  }
  navigateToHome(){
    this.appHttpRequestHandlerService.httpGet({ id: this.accountService.getUserJwtDecodedInfo().UserId}, "AccountManager", "RevalidateUserToken").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<string>) => {
      localStorage.setItem("BearerToken", data.responseDataModel);
      if(this.accountService.getUserJwtDecodedInfo().RoleName=='HOME_OWNER_USER'){
        this.router.navigate(['/HomeAddress/Dashboard'])
        .then(() => {
          window.location.reload();
        });
      }
      else if(this.accountService.getUserJwtDecodedInfo().RoleName=='REAL_ESTATE_USER' && (this.accountService.getUserJwtDecodedInfo().IsAgree=='True' || this.authService.isPrevUserId())){
        this.router.navigate(['/RealEstateAgent/Dashboard']).then(() => {
          window.location.reload();
        });
      }
      else if(this.accountService.getUserJwtDecodedInfo().RoleName=='ADMIN_USER'){
        this.router.navigate(['/Admin/Dashboard']).then(() => {
          window.location.reload();
        });
      }
    });
  } 
  isDisabled(){
   // setTimeout(() => {
      if(this.stepCode==1){
        this.IsDisabled = false;
      }
      else if(this.stepCode==2 && this.FooterLinksStepComponentTemplate){
        this.IsDisabled = (this.FooterLinksStepComponentTemplate.footerLinks.length==0);
      }
      else if(this.stepCode==3 && this.WelcomeMessageStepComponentTemplate){
        if(this.WelcomeMessageStepComponentTemplate.inputFormWelcomeMessage.controls.messageText.value && this.WelcomeMessageStepComponentTemplate.inputFormWelcomeMessage.controls.messageText.value.length>0){
          this.IsDisabled = this.WelcomeMessageStepComponentTemplate.inputFormWelcomeMessage.controls.messageText.value.trim().length==0;
        }
        else{
          this.IsDisabled = true;
        }
      }
      else if(this.stepCode==4 && this.MessagesStepComponentTemplate){
        this.IsDisabled = (this.MessagesStepComponentTemplate.MessageList.length==0);
      }
      else{
        this.IsDisabled = false;
      }
   // }, 1000);
  }

}
