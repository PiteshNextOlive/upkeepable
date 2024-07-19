import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLinksStepComponent } from './footer-links-step.component';

describe('FooterLinksStepComponent', () => {
  let component: FooterLinksStepComponent;
  let fixture: ComponentFixture<FooterLinksStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterLinksStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterLinksStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
