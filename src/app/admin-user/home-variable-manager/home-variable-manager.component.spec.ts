import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeVariableManagerComponent } from './home-variable-manager.component';

describe('HomeVariableManagerComponent', () => {
  let component: HomeVariableManagerComponent;
  let fixture: ComponentFixture<HomeVariableManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeVariableManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeVariableManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
