import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpLoaderService } from './http-loader.service';
import { HttpLoaderComponent } from './http-loader/http-loader.component';
import {SharedRoutingModule} from './shared.routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonOpsService } from './common-ops-service';
import { ImageCropperToolComponent } from './image-cropper-tool/image-cropper-tool.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MonthYearPickerComponent } from './month-year-picker/month-year-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AcceptPaymentComponent } from './payments/stripe/accept-payment/accept-payment.component';
 @NgModule({
   declarations: [
    HttpLoaderComponent,
    ImageCropperToolComponent,
    MonthYearPickerComponent,
    AcceptPaymentComponent
  ],
   imports: [
    RouterModule,
     CommonModule,
     SharedRoutingModule,
     FormsModule,
     ReactiveFormsModule,
     ImageCropperModule,
     NgbModule
   ],
   exports: [
    HttpLoaderComponent,
    ImageCropperToolComponent,
    MonthYearPickerComponent,
    AcceptPaymentComponent
   ],
   providers: [HttpLoaderService, CommonOpsService,NgbActiveModal]
 })
 export class SharedModule { }