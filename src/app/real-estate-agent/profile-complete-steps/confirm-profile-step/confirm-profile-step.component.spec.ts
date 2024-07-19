import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmProfileStepComponent } from './confirm-profile-step.component';

describe('ConfirmProfileStepComponent', () => {
  let component: ConfirmProfileStepComponent;
  let fixture: ComponentFixture<ConfirmProfileStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmProfileStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmProfileStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
