import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressOutsideDetailComponent } from './home-address-outside-detail.component';

describe('HomeAddressOutsideDetailComponent', () => {
  let component: HomeAddressOutsideDetailComponent;
  let fixture: ComponentFixture<HomeAddressOutsideDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressOutsideDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressOutsideDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
