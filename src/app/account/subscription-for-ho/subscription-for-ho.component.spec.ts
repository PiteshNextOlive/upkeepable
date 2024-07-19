import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscriptionForHoComponent } from './subscription-for-ho.component';

describe('SubscriptionForHoComponent', () => {
  let component: SubscriptionForHoComponent;
  let fixture: ComponentFixture<SubscriptionForHoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubscriptionForHoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscriptionForHoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
