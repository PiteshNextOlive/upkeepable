import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-accept-payment',
  templateUrl: './accept-payment.component.html',
  styleUrls: ['./accept-payment.component.css']
})
export class AcceptPaymentComponent implements OnInit {
  stripe = Stripe('pk_test_51BTUDGJAJfZb9HEBwDg86TN1KNprHjkfipXmEDMb0gSCassK5T3ZfxsAbcgKVmAIXF7oZ6ItlZZbXO6idTHE67IM007EwQ4uN3');
  //stripe = Stripe('pk_live_51MIbG8Efh9w7mXGWgCHgdEMnqUPn77p4Mf6SJHdVNVKWGXgXvkgmzBZI2JQb9CIqZpuKW69MAOhO4re3ySIpF8rD00zgDSfKw6');
  elements = this.stripe.elements();
   styleCard =  {
    'style': {
      'base': {
        'fontFamily': 'Arial, sans-serif',
        'fontSize': '8px',
        'color': '#C1C7CD',
      },
      'Invalid': {  'color': 'red', },
    }
  }; 
  

  constructor() {
   
  }

  ngOnInit(): void {
  }
  ngAfterViewInit() {
  var card = this.elements.create('card', this.styleCard);
  //console.log('sdfsfd', card)

  card.mount('#card-element'); 

}
}
