import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationManagerComponent } from './recommendation-manager.component';

describe('RecommendationManagerComponent', () => {
  let component: RecommendationManagerComponent;
  let fixture: ComponentFixture<RecommendationManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
