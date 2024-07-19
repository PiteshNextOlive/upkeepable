import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaManagerComponent } from './rea-manager.component';

describe('ReaManagerComponent', () => {
  let component: ReaManagerComponent;
  let fixture: ComponentFixture<ReaManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReaManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
