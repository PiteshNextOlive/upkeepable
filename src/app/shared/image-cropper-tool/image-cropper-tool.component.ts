import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ImageCroppedEvent, LoadedImage } from 'ngx-image-cropper';
import { NgbModal, NgbModalConfig, ModalDismissReasons, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-image-cropper-tool',
  templateUrl: './image-cropper-tool.component.html',
  styleUrls: ['./image-cropper-tool.component.css']
})
export class ImageCropperToolComponent implements OnInit {
  imageChangedEvent: any = '';
  croppedImage: any = '';
  submitted:boolean = false;
  invalidSize: boolean = false;
  closeModal: boolean = false;
  @Input() fileUploadEventObject : any;
  @Input() targetParentImageElementId:string;
  @Input() aspectRatio:string;
  @Output() passCroppedImageToParentEvent = new EventEmitter<any>();
  constructor(private modalService: NgbModal,
    config: NgbModalConfig,
    private activeModal:NgbActiveModal) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
  }
  ngOnChanges(){
    this.imageChangedEvent = this.fileUploadEventObject;
    var size = this.fileUploadEventObject.srcElement.files[0].size;

    const totalSizeMB = size / Math.pow(1024,2);
    var n = totalSizeMB.toFixed(3)
   // console.log(totalSizeMB, n);
    if(parseFloat(n)>1){
      this.invalidSize=true;
    }
    else{
      this.invalidSize=false;
    }
  }
  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
    
  }

  onImageCropDone(){
    if(this.submitted == false && this.invalidSize == false){
      this.submitted = true;
      this.passCroppedImageToParentEvent.emit({
        croppedImage: this.croppedImage,
        targetImageElementId: this.targetParentImageElementId,
        closeModal: false
      });
    }
    //this.modalService.dismissAll();
    //this.activeModal.dismiss();
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }
  passCroppedImageToParent(){
    // this.passCroppedImageToParentEvent.emit(this.croppedImage);
  }
  onModelNoClick() {
    //this.modalService.dismissAll();
    this.passCroppedImageToParentEvent.emit({
      closeModal: true
    });
  }
}
