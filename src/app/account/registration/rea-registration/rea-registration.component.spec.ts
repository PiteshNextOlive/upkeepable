import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaRegistrationComponent } from './rea-registration.component';

describe('ReaRegistrationComponent', () => {
  let component: ReaRegistrationComponent;
  let fixture: ComponentFixture<ReaRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReaRegistrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
