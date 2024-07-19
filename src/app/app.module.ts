import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppHttpRequestHandlerService } from './shared/app-http-request-handler.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppHttpInterceptor } from './shared/app-http.interceptor';
import { SharedModule } from './shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from './../environments/environment';
import { ToastContainerComponent } from './toast/toast-container/toast-container.component';
// import { MessageService } from './message.service';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { CookieModule } from 'ngx-cookie';
import { PrivacyComponent } from './static-pages/privacy/privacy.component';
import { TermsComponent } from './static-pages/terms/terms.component';
import { LegalComponent } from './static-pages/legal/legal.component';
import { ReplyToEmailComponent } from './account/reply-to-email/reply-to-email.component';
import { SiteMapComponent } from './static-pages/site-map/site-map.component';
import { FaqComponent } from './static-pages/faq/faq.component';
import { NotifiationAllComponent } from './notifiation-all/notifiation-all.component';
import { ProductListComponent } from './stripe-payment/product-list/product-list.component';
import { PaymentSuccessComponent } from './stripe-payment/payment-success/payment-success.component';
import { PaymentFailedComponent } from './stripe-payment/payment-failed/payment-failed.component';
//import { SubscriptionManagerComponent } from './account/subscription-manager/subscription-manager.component';
import { ManageCardComponent } from './stripe-payment/manage-card/manage-card.component';
import { CardAddedSuccessfullyComponent } from './stripe-payment/card-added-successfully/card-added-successfully.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { CookieService } from 'ngx-cookie';
import { SponsorRegisterComponent } from './static-pages/sponsor-register/sponsor-register.component';
import { initializeApp } from "firebase/app";
initializeApp(environment.firebase);
export function authTokenGetter(){
  return localStorage.getItem("BearerToken");
}
@NgModule({
  declarations: [
    AppComponent,
    ToastContainerComponent,
    PrivacyComponent,
    ReplyToEmailComponent,
    TermsComponent,
    LegalComponent,
    SiteMapComponent,
    FaqComponent,
    NotifiationAllComponent,
    ProductListComponent,
    PaymentSuccessComponent,
    PaymentFailedComponent,
    ManageCardComponent,
    CardAddedSuccessfullyComponent,
    ContactFormComponent,
    SponsorRegisterComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    JwtModule.forRoot({
      config:{
        tokenGetter:authTokenGetter,
        allowedDomains:environment.allowedDomains,
        disallowedRoutes:[]
      }
    }),
    NgbModule,
    BrowserAnimationsModule,
    CarouselModule, 
    CookieModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AppHttpRequestHandlerService,
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AppHttpInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
