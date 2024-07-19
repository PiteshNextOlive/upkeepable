import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileManagerAdminComponent } from './profile-manager-admin.component';

describe('ProfileManagerAdminComponent', () => {
  let component: ProfileManagerAdminComponent;
  let fixture: ComponentFixture<ProfileManagerAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileManagerAdminComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileManagerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
