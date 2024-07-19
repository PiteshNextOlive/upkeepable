import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedHomeAddressDetailComponent } from './completed-home-address-detail.component';

describe('CompletedHomeAddressDetailComponent', () => {
  let component: CompletedHomeAddressDetailComponent;
  let fixture: ComponentFixture<CompletedHomeAddressDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedHomeAddressDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedHomeAddressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
