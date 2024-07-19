import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RecommendationListComponent } from './recommendation-list/recommendation-list.component';
import { RecommendationRoutingModule } from './recommendation.routing.module';
import { RecommendationAddNewComponent } from './recommendation-add-new/recommendation-add-new.component';
@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        RecommendationRoutingModule
    ],
    declarations:[
    
    RecommendationListComponent,
          RecommendationAddNewComponent
  ],
    providers:[UntypedFormBuilder]
})
export class RecommendationModule{}
