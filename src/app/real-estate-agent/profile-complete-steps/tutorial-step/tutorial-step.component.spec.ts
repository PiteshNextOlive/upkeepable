import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TutorialStepComponent } from './tutorial-step.component';

describe('TutorialStepComponent', () => {
  let component: TutorialStepComponent;
  let fixture: ComponentFixture<TutorialStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TutorialStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorialStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
