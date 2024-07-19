import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FooterLinkRoutingModule } from './footer-link.routing.module';
@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        FooterLinkRoutingModule
    ],
    declarations:[
    
  ],
    providers:[FormBuilder]
})
export class FooterModule{}
