import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressApplianceDetailComponent } from './home-address-appliance-detail.component';

describe('HomeAddressApplianceDetailComponent', () => {
  let component: HomeAddressApplianceDetailComponent;
  let fixture: ComponentFixture<HomeAddressApplianceDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressApplianceDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressApplianceDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
