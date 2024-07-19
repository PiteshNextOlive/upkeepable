import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SponsorRegisterComponent } from './sponsor-register.component';

describe('SponsorRegisterComponent', () => {
  let component: SponsorRegisterComponent;
  let fixture: ComponentFixture<SponsorRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SponsorRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SponsorRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
