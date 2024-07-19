import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterLinksManagerComponent } from './footer-links-manager.component';

describe('FooterLinksManagerComponent', () => {
  let component: FooterLinksManagerComponent;
  let fixture: ComponentFixture<FooterLinksManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterLinksManagerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterLinksManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
