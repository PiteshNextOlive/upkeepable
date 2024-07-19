import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaManagerEditorComponent } from './rea-manager-editor.component';

describe('ReaManagerEditorComponent', () => {
  let component: ReaManagerEditorComponent;
  let fixture: ComponentFixture<ReaManagerEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReaManagerEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaManagerEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
