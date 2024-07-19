import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeOwnerIndexPageComponent } from './home-owner-index-page.component';

describe('HomeOwnerIndexPageComponent', () => {
  let component: HomeOwnerIndexPageComponent;
  let fixture: ComponentFixture<HomeOwnerIndexPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeOwnerIndexPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeOwnerIndexPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
