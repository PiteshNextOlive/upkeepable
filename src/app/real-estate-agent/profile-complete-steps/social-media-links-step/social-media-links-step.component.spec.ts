import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialMediaLinksStepComponent } from './social-media-links-step.component';

describe('SocialMediaLinksStepComponent', () => {
  let component: SocialMediaLinksStepComponent;
  let fixture: ComponentFixture<SocialMediaLinksStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialMediaLinksStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialMediaLinksStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
