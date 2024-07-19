import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { PrivacyComponent } from './static-pages/privacy/privacy.component';
// import { ReplyToEmailComponent } from './account/reply-to-email/reply-to-email.component';
import { TermsComponent } from './static-pages/terms/terms.component';
import { LegalComponent } from './static-pages/legal/legal.component';
import { SiteMapComponent } from './static-pages/site-map/site-map.component';
import { FaqComponent } from './static-pages/faq/faq.component';
import { NotifiationAllComponent } from './notifiation-all/notifiation-all.component';
import { ProductListComponent } from './stripe-payment/product-list/product-list.component';
import { PaymentSuccessComponent } from './stripe-payment/payment-success/payment-success.component';
import { PaymentFailedComponent } from './stripe-payment/payment-failed/payment-failed.component';
//import { SubscriptionManagerComponent } from './account/subscription-manager/subscription-manager.component';
import { ManageCardComponent } from './stripe-payment/manage-card/manage-card.component';
import { CardAddedSuccessfullyComponent } from './stripe-payment/card-added-successfully/card-added-successfully.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { SponsorRegisterComponent } from './static-pages/sponsor-register/sponsor-register.component';
import { QRClientAgentComponent } from '../app/real-estate-agent/qr-client-agent/qr-client-agent.component';

const routes: Routes = [
  {
    path:"recommendation", loadChildren:()=>import('./recommendation/recommendation.module')
    .then(mod=>mod.RecommendationModule), canActivate:[AuthGuard]
  },
  {
    path:"HomeAddress", loadChildren:()=>import('./home-owner-address/home-owner-address.module')
    .then(mod=>mod.HomeOwnerAddressModule), canActivate:[AuthGuard]
  },
  {
    path:"RealEstateAgent", loadChildren:()=>import('./real-estate-agent/real-estate-agent.module')
    .then(mod=>mod.RealEstateAgentModule), canActivate:[AuthGuard]
  },
  {
    path:"", loadChildren:()=>import('./account/account.module')
    .then(mod=>mod.AccountModule)
  },
  {
    path:"Account", loadChildren:()=>import('./account/account.module')
    .then(mod=>mod.AccountModule)
  },
  {
    path:"Admin", loadChildren:()=>import('./admin-user/admin-user.module')
    .then(mod=>mod.AdminUserModule), canActivate:[AuthGuard]
  },
  {path:"privacy", component:PrivacyComponent},
  {path:"terms", component:TermsComponent},
  {path:"legal", component:LegalComponent},
  // {path:"replytoemail", component:ReplyToEmailComponent},
  {path:"sitemap", component:SiteMapComponent},
  {path:"faq", component:FaqComponent},
  {path:"all-notifications", component:NotifiationAllComponent},
  {path:"Pick-A-Product", component:ProductListComponent},
  {path:"success", component:PaymentSuccessComponent},
  {path:"canceled", component:PaymentFailedComponent},
  //{path:"Manage-payments", component: SubscriptionManagerComponent, canActivate:[AuthGuard]},
  {path:"Manage-Cards", component: ManageCardComponent, canActivate:[AuthGuard]},
  {path:"Card-added-successfully", component:CardAddedSuccessfullyComponent},
  {path:"contact-form", component:ContactFormComponent}, 
  {path:"sponsor-register", component: SponsorRegisterComponent}, 
  {path: ':id', component: QRClientAgentComponent },
  
  // { path: 'QRClientbyAgent', component: QRClientAgentComponent }

  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
