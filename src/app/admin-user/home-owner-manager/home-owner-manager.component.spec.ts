import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnerManagerComponent } from './home-owner-manager.component';

describe('HomeOwnerManagerComponent', () => {
  let component: HomeOwnerManagerComponent;
  let fixture: ComponentFixture<HomeOwnerManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnerManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnerManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
