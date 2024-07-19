import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  public defaultApiRoot: string=environment.defaultApiRoot + "api/Payment/create-checkout-session";
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private route: ActivatedRoute, private appHttpRequestHandlerService: AppHttpRequestHandlerService) { }

  ngOnInit(): void {
    // this.route.queryParams
    // .subscribe(params => {
    //   var submitForm = (<HTMLFormElement>document.getElementById('checkoutForm'));
    //   setTimeout(() => {
    //     submitForm.action=this.defaultApiRoot;  
    //   (<HTMLInputElement>submitForm.elements.namedItem('userId')).setAttribute('value',params['c3e931f1-9e57-41e9-8025-001ce1a15414']);
    //   (<HTMLInputElement>submitForm.elements.namedItem('productId')).setAttribute('value','price_1MYoJRJVNHhJ5Y9v7pHSU6dm');
    //   (<HTMLFormElement>document.getElementById('checkoutForm')).submit()
    //   }, 1000);
    

    // });
     this.route.queryParams
    .subscribe(params => {
      this.appHttpRequestHandlerService.httpGet({ }, "CommonApi", "Price-Data").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data) => {
        localStorage.setItem("price", data.imageBase64.price_Id_stripe);
        if(data != null)
        {
          var submitForm = (<HTMLFormElement>document.getElementById('checkoutForm'));
      submitForm.action=this.defaultApiRoot;
      let p = localStorage.getItem("price");
      (<HTMLInputElement>submitForm.elements.namedItem('userId')).setAttribute('value',params['c3e931f1-9e57-41e9-8025-001ce1a15414']);
      //(<HTMLInputElement>submitForm.elements.namedItem('productId')).setAttribute('value','price_1MYoJRJVNHhJ5Y9v7pHSU6dm');
      (<HTMLInputElement>submitForm.elements.namedItem('productId')).setAttribute('value',p);
      //(<HTMLInputElement>submitForm.elements.namedItem('productId')).setAttribute('value','price_1OdnYfJVNHhJ5Y9v1GEXbNvy');
      (<HTMLFormElement>document.getElementById('checkoutForm')).submit()
        }
      });
      //localStorage.clear();
      localStorage.removeItem("price");

    });
  }

}
