import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealEstateAgentIndexComponent } from './real-estate-agent-index.component';

describe('RealEstateAgentIndexComponent', () => {
  let component: RealEstateAgentIndexComponent;
  let fixture: ComponentFixture<RealEstateAgentIndexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RealEstateAgentIndexComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RealEstateAgentIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
