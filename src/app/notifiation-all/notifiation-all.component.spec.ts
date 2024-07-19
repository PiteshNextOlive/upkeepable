import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotifiationAllComponent } from './notifiation-all.component';

describe('NotifiationAllComponent', () => {
  let component: NotifiationAllComponent;
  let fixture: ComponentFixture<NotifiationAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotifiationAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotifiationAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
