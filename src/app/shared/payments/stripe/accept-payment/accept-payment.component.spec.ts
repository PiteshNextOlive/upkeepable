import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptPaymentComponent } from './accept-payment.component';

describe('AcceptPaymentComponent', () => {
  let component: AcceptPaymentComponent;
  let fixture: ComponentFixture<AcceptPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptPaymentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
