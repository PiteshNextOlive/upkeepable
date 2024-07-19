import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageHomeAddressDetailComponent } from './manage-home-address-detail/manage-home-address-detail.component';
import { HomeOwnerIndexPageComponent } from '../home-owner-address/home-owner-index-page/home-owner-index-page.component';
import { CompletedHomeAddressDetailComponent } from '../home-owner-address/completed-home-address-detail/completed-home-address-detail.component';
const appRoutes: Routes=[
    { path:'ManageHomeDetails', component:ManageHomeAddressDetailComponent },
    { path:'Dashboard', component:HomeOwnerIndexPageComponent },
    { path:'Details', component: CompletedHomeAddressDetailComponent }
];
@NgModule({
    imports:[
        RouterModule.forChild(appRoutes)
    ],
    exports:[RouterModule]
})
export class HomeOwnerAddressRoutingModule{}