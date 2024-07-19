import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageCropperToolComponent } from './image-cropper-tool.component';

describe('ImageCropperToolComponent', () => {
  let component: ImageCropperToolComponent;
  let fixture: ComponentFixture<ImageCropperToolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImageCropperToolComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageCropperToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
