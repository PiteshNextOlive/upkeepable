import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,UntypedFormBuilder, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { AdminUserRoutingModule } from './admin-user.routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ArticleManagerComponent } from './article-manager/article-manager.component';
import { CouponManagementComponent } from './coupon-management/coupon-management.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeOwnerManagerComponent } from './home-owner-manager/home-owner-manager.component';
import { NgxBootstrapMultiselectModule } from 'ngx-bootstrap-multiselect';
import { ReaManagerComponent } from './rea-manager/rea-manager.component';
import { ReaManagerEditorComponent } from './rea-manager-editor/rea-manager-editor.component';
import { RecommendationManagerComponent } from './recommendation-manager/recommendation-manager.component';
import { HomeVariableManagerComponent } from './home-variable-manager/home-variable-manager.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        AdminUserRoutingModule,
        FormsModule,
        NgbModule,
        NgxBootstrapMultiselectModule,
        NgxSliderModule
    ],
    declarations:[
  
    DashboardComponent,
       ArticleManagerComponent,
       CouponManagementComponent,
       HomeOwnerManagerComponent,
       ReaManagerComponent,
       ReaManagerEditorComponent,
       RecommendationManagerComponent,
       HomeVariableManagerComponent
  ],
  exports:[HomeOwnerManagerComponent],
    providers:[UntypedFormBuilder]
})
export class AdminUserModule{}
