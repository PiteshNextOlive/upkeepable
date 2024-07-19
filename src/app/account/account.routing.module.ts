import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SetFirstPasswordComponent } from './set-first-password/set-first-password.component';
import { LoginComponent } from './login/login.component';
import { SettingComponent } from './setting/setting.component';
import { AuthGuard } from '../auth.guard';
import { ForgetUsernameComponent } from './forget-username/forget-username.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { HomeOwnerDirectLoginComponent } from './home-owner-direct-login/home-owner-direct-login.component';
import { ReaRegistrationComponent } from './registration/rea-registration/rea-registration.component';
import { QRClientAgentComponent } from '../../app/real-estate-agent/qr-client-agent/qr-client-agent.component';
import { HOWelcomeComponent } from '../../app/real-estate-agent/home-owner-welcom/home-owner-welcom.component';
const appRoutes: Routes=[
    { path:'SetPassword', component:SetFirstPasswordComponent },
    { path:'', component:LoginComponent },
    { path:'Login', component:LoginComponent },
    { path:'Settings', component:SettingComponent, canActivate:[AuthGuard] },
    { path:'ForgetUsername', component: ForgetUsernameComponent},
    { path:'TermsAndConditions', component: TermsAndConditionsComponent},
    { path: 'ForgetPassword', component: ForgetPasswordComponent},
    { path: 'ResetPassword', component: ResetPasswordComponent},
    { path: 'DirectLogin', component: HomeOwnerDirectLoginComponent},
    { path: 'ReaRegistration', component: ReaRegistrationComponent},
    { path: 'QRClientbyAgent', component: QRClientAgentComponent },
    { path: 'HOWelcomeComponent', component: HOWelcomeComponent },
];
@NgModule({
    imports:[
        RouterModule.forChild(appRoutes)
    ],
    exports:[RouterModule]
})
export class AccountRoutingModule{}