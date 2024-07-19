import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecommendationAddNewComponent } from './recommendation-add-new.component';

describe('RecommendationAddNewComponent', () => {
  let component: RecommendationAddNewComponent;
  let fixture: ComponentFixture<RecommendationAddNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecommendationAddNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecommendationAddNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
