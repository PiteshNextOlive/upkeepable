import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecommendationListComponent } from './recommendation-list/recommendation-list.component';
const appRoutes: Routes=[
    { path:'list', component:RecommendationListComponent },
];
@NgModule({
    imports:[
        RouterModule.forChild(appRoutes)
    ],
    exports:[RouterModule]
})
export class RecommendationRoutingModule{}