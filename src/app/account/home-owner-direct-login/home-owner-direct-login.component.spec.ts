import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnerDirectLoginComponent } from './home-owner-direct-login.component';

describe('HomeOwnerDirectLoginComponent', () => {
  let component: HomeOwnerDirectLoginComponent;
  let fixture: ComponentFixture<HomeOwnerDirectLoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnerDirectLoginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnerDirectLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
