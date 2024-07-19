import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRClientAgentComponent } from './qr-client-agent.component';

describe('QRClientAgentComponent', () => {
  let component: QRClientAgentComponent;
  let fixture: ComponentFixture<QRClientAgentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRClientAgentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QRClientAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
