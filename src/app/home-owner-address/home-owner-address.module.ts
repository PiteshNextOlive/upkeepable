import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { ManageHomeAddressDetailComponent } from './manage-home-address-detail/manage-home-address-detail.component';
import { HomeAddressGeneralDetailComponent } from './home-address-general-detail/home-address-general-detail.component';
import { HomeOwnerAddressRoutingModule } from './home-owner-address.routing.module';
import { HomeAddressHeatDetailComponent } from './home-address-heat-detail/home-address-heat-detail.component';
import { HomeAddressCoolingDetailComponent } from './home-address-cooling-detail/home-address-cooling-detail.component';
import { HomeAddressWaterTreatmentDetailComponent } from './home-address-water-treatment-detail/home-address-water-treatment-detail.component';
import { HomeAddressOutsideDetailComponent } from './home-address-outside-detail/home-address-outside-detail.component';
import { HomeAddressApplianceDetailComponent } from './home-address-appliance-detail/home-address-appliance-detail.component';
import { HomeOwnerIndexPageComponent } from './home-owner-index-page/home-owner-index-page.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CompletedHomeAddressDetailComponent } from './completed-home-address-detail/completed-home-address-detail.component';
import { NgbModule, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { CarouselModule } from 'ngx-owl-carousel-o';

@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        HomeOwnerAddressRoutingModule,
        NgxSliderModule,
        NgbModule,
        CarouselModule
    ],
    declarations:[
    ManageHomeAddressDetailComponent,
    HomeAddressGeneralDetailComponent,
    HomeAddressHeatDetailComponent,
    HomeAddressCoolingDetailComponent,
    HomeAddressWaterTreatmentDetailComponent,
    HomeAddressOutsideDetailComponent,
    HomeAddressApplianceDetailComponent,
    HomeOwnerIndexPageComponent,
    CompletedHomeAddressDetailComponent
  ],
    providers:[UntypedFormBuilder, NgbCarousel]
})
export class HomeOwnerAddressModule{}
