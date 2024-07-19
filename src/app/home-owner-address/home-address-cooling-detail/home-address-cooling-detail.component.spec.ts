import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeAddressCoolingDetailComponent } from './home-address-cooling-detail.component';

describe('HomeAddressCoolingDetailComponent', () => {
  let component: HomeAddressCoolingDetailComponent;
  let fixture: ComponentFixture<HomeAddressCoolingDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeAddressCoolingDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeAddressCoolingDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
