import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteProfileWizardComponent } from './complete-profile-wizard.component';

describe('CompleteProfileWizardComponent', () => {
  let component: CompleteProfileWizardComponent;
  let fixture: ComponentFixture<CompleteProfileWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompleteProfileWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompleteProfileWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
