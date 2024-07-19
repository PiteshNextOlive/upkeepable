import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesStepComponent } from './messages-step.component';

describe('MessagesStepComponent', () => {
  let component: MessagesStepComponent;
  let fixture: ComponentFixture<MessagesStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
