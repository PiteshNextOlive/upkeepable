import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const appRoutes: Routes=[
    // { path:'appfileupload', component: ApplicationFileUploadComponent},
    // { path:'appdocuments', component: ApplicationDocumentsComponent}
];
@NgModule({
    imports:[
        RouterModule.forChild(appRoutes)
    ],
    exports:[RouterModule]
})
export class SharedRoutingModule{}