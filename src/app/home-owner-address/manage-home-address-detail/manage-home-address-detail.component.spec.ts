import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHomeAddressDetailComponent } from './manage-home-address-detail.component';
import { BrowserAnimationsModule,NoopAnimationsModule  } from '@angular/platform-browser/animations'; 

describe('ManageHomeAddressDetailComponent', () => {
  let component: ManageHomeAddressDetailComponent;
  let fixture: ComponentFixture<ManageHomeAddressDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageHomeAddressDetailComponent ], imports: [ BrowserAnimationsModule,NoopAnimationsModule  ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageHomeAddressDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
