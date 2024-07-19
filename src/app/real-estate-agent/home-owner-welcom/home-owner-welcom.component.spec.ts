import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HOWelcomeComponent } from './home-owner-welcom.component';

describe('HOWelcomeComponent', () => {
  let component: HOWelcomeComponent;
  let fixture: ComponentFixture<HOWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HOWelcomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HOWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
