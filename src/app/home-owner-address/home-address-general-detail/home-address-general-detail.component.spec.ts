import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressGeneralDetailComponent } from './home-address-general-detail.component';

describe('HomeAddressGeneralDetailComponent', () => {
  let component: HomeAddressGeneralDetailComponent;
  let fixture: ComponentFixture<HomeAddressGeneralDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressGeneralDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressGeneralDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
