import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
const appRoutes: Routes=[
];
@NgModule({
    imports:[
        RouterModule.forChild(appRoutes)
    ],
    exports:[RouterModule]
})
export class FooterLinkRoutingModule{}