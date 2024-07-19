import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { SetFirstPasswordComponent } from './set-first-password/set-first-password.component';
import { AccountRoutingModule } from './account.routing.module';
import { LoginComponent } from './login/login.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileManagerComponent } from './profile-manager/profile-manager.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgetUsernameComponent } from './forget-username/forget-username.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeOwnerDirectLoginComponent } from './home-owner-direct-login/home-owner-direct-login.component';
import { FooterLinksManagerComponent } from './footer-links-manager/footer-links-manager.component';
import { CookieService } from 'ngx-cookie';
import { ProfileManagerReaComponent } from './profile-manager-rea/profile-manager-rea.component';
import { ProfileManagerAdminComponent } from './profile-manager-admin/profile-manager-admin.component';
import { ReaRegistrationComponent } from './registration/rea-registration/rea-registration.component';
import { SubscriptionManagerComponent } from './subscription-manager/subscription-manager.component';
import { SubscriptionForHoComponent } from './subscription-for-ho/subscription-for-ho.component';
@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        AccountRoutingModule
    ],
    declarations:[
    SetFirstPasswordComponent,
    LoginComponent,
    SettingComponent,
    ProfileManagerComponent,
    ChangePasswordComponent,
    SubscriptionForHoComponent,
    ForgetUsernameComponent,
    TermsAndConditionsComponent,
    ForgetPasswordComponent,
    ResetPasswordComponent,
    HomeOwnerDirectLoginComponent,
    FooterLinksManagerComponent,
    ProfileManagerReaComponent,
    ProfileManagerAdminComponent,
    ReaRegistrationComponent,
    SubscriptionManagerComponent
  ],
    providers:[UntypedFormBuilder,CookieService]
})
export class AccountModule{}