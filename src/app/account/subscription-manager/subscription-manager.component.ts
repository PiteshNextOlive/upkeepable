import { Token } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AccountService } from 'src/app/account/account.service';
import { AuthService } from 'src/app/auth.service';
import { GenericFormModel, GenericResponseTemplateModel,GenericServiceResultTemplate,TForm } from 'src/app/generic-type-module';
import { IRealEstateAgentProfileViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppToastService } from '../../toast/app-toast.service';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import Swal from 'sweetalert2';
import { IFilterTransactionViewModal, IStripeInvoiceDetailViewModal, IStripeSubscriptionDetailViewModal } from '../../stripe-payment/stripe-payment-type-module';

@Component({
  selector: 'app-subscription-manager',
  templateUrl: './subscription-manager.component.html',
  styleUrls: ['./subscription-manager.component.css']
})
export class SubscriptionManagerComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  stripeSubscriptionDetail: IStripeSubscriptionDetailViewModal;

  inputForm: TForm<IFilterTransactionViewModal> = this.fb.group({
    monthYear: [{ year: new Date().getFullYear(), month: new Date().getMonth()+1 }, Validators.required],
  }) as TForm<IFilterTransactionViewModal>;
  stripeInvoiceDetailList: IStripeInvoiceDetailViewModal[]=[];
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private authService: AuthService,
    private router: Router,
    private accountService: AccountService,
    private fb: UntypedFormBuilder,private modalService: NgbModal,public toastService: AppToastService) { }

  ngOnInit(): void {
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId }, "Stripe", "GetCustomerActiveSubscriptions").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IStripeSubscriptionDetailViewModal>) => {
       // console.log(data.responseDataModel)
        this.stripeSubscriptionDetail = data.responseDataModel;
        if(this.stripeSubscriptionDetail && (this.stripeSubscriptionDetail.status=='active' || this.stripeSubscriptionDetail.status=='trialing')){
          this.stripeSubscriptionDetail.plan_Amount=this.stripeSubscriptionDetail.plan_Amount/100;
          // this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId, subscriptionId: this.stripeSubscriptionDetail.subscriptionId, month:0, year: 0 }, "Stripe", "GetInvoices").pipe(takeUntil(this.ngUnsubscribe))
          // .subscribe((data1: GenericResponseTemplateModel<IStripeInvoiceDetailViewModal[]>) => {
          //   this.stripeInvoiceDetailList = data1.responseDataModel;
          // });
          this.getInvoices(0,0);
        }
      });
  }
  onAddCard(){
    this.router.navigate(['/Manage-Cards'], {queryParams: { 'c3e931f1-9e57-41e9-8025-001ce1a15414':  this.accountService.getUserJwtDecodedInfo().UserId}});
  }
  filterData(){
   // console.log(this.inputForm.controls.monthYear.value.month)
    this.getInvoices(this.inputForm.controls.monthYear.value.month,this.inputForm.controls.monthYear.value.year);
    
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {
    }, (reason) => {
    });
  }

  onCancelAccountModelNoClick() {
    this.modalService.dismissAll();
  }


  onCancelAccountModelYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "AccountManager", "SetAccountAsCancelledEmail").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericServiceResultTemplate) => {
        Swal.fire({
          title: 'We have received your request to close this account',
          //text: 'Your request has been submitted via email. Please check your inbox for updates',
          icon: 'success', // You can change this to 'success', 'error', 'info', etc.
          confirmButtonText: 'CLOSE'
          //showCloseButton: true
        });
        //this.toastService.show("","Request has been sent.", 3000,"bg-success text-white","fa-check-circle");
       // this.toastService.show("","Account has been closed.", 3000,"bg-success text-white","fa-check-circle");
       // this.router.navigate(['/Account/Login']);
      });
  }
  getInvoices(month: number, year: number){
    var userJwtDecodedInfo: UserJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.appHttpRequestHandlerService.httpGet({ id: userJwtDecodedInfo.UserId, subscriptionId: this.stripeSubscriptionDetail.subscriptionId, month:month, year: year}, "Stripe", "GetInvoices").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data1: GenericResponseTemplateModel<IStripeInvoiceDetailViewModal[]>) => {
      this.stripeInvoiceDetailList = data1.responseDataModel;
      console.log("invicelist",this.stripeInvoiceDetailList);
    });
  }
}
