import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReaManagerEditorComponent } from './rea-manager-editor/rea-manager-editor.component';
import { HomeVariableManagerComponent } from './home-variable-manager/home-variable-manager.component';
const appRoutes: Routes = [
        { path: 'Dashboard', component: DashboardComponent },
        { path: 'rea-editor', component:  ReaManagerEditorComponent},
        { path: 'home-variables-manager', component:  HomeVariableManagerComponent},
    // { path: 'AllClients', component: AllClientsComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [RouterModule]
})
export class AdminUserRoutingModule { }