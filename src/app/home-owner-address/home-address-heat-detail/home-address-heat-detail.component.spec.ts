import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressHeatDetailComponent } from './home-address-heat-detail.component';

describe('HomeAddressHeatDetailComponent', () => {
  let component: HomeAddressHeatDetailComponent;
  let fixture: ComponentFixture<HomeAddressHeatDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressHeatDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressHeatDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
