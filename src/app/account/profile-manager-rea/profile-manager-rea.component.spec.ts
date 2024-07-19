import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagerReaComponent } from './profile-manager-rea.component';

describe('ProfileManagerReaComponent', () => {
  let component: ProfileManagerReaComponent;
  let fixture: ComponentFixture<ProfileManagerReaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileManagerReaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileManagerReaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
