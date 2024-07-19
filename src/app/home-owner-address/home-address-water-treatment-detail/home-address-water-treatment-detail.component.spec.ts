import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressWaterTreatmentDetailComponent } from './home-address-water-treatment-detail.component';

describe('HomeAddressWaterTreatmentDetailComponent', () => {
  let component: HomeAddressWaterTreatmentDetailComponent;
  let fixture: ComponentFixture<HomeAddressWaterTreatmentDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressWaterTreatmentDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressWaterTreatmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
