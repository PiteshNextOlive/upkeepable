import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllClientsComponent } from './all-clients/all-clients.component';
import { MessageManagerComponent } from './message-manager/message-manager.component';
import { CompleteProfileWizardComponent } from './profile-complete-steps/complete-profile-wizard/complete-profile-wizard.component';
import { RealEstateAgentIndexComponent } from './real-estate-agent-index/real-estate-agent-index.component';
const appRoutes: Routes = [
    { path: 'Dashboard', component: RealEstateAgentIndexComponent },
    { path: 'Messages', component: MessageManagerComponent },
    { path: 'AllClients', component: AllClientsComponent },
    { path: 'CompleteProfileSteps', component: CompleteProfileWizardComponent }
];
@NgModule({
    imports: [
        RouterModule.forChild(appRoutes)
    ],
    exports: [RouterModule]
})
export class RealEstateAgentRoutingModule { }