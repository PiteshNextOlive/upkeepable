import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,UntypedFormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { RealEstateAgentIndexComponent } from './real-estate-agent-index/real-estate-agent-index.component';
import { RealEstateAgentRoutingModule } from './real-estate-agent.routing.module';
import { MessageManagerComponent } from './message-manager/message-manager.component';
import { ClientManagerComponent } from './client-manager/client-manager.component';
import { AllClientsComponent } from './all-clients/all-clients.component';
import { MessageEditorComponent } from './message-editor/message-editor.component';
import { CompleteProfileWizardComponent } from './profile-complete-steps/complete-profile-wizard/complete-profile-wizard.component';
import { QRClientAgentComponent } from '../../app/real-estate-agent/qr-client-agent/qr-client-agent.component';
import { HOWelcomeComponent } from '../../app/real-estate-agent/home-owner-welcom/home-owner-welcom.component';
import { FooterLinksStepComponent } from './profile-complete-steps/footer-links-step/footer-links-step.component';
import { WelcomeMessageStepComponent } from './profile-complete-steps/welcome-message-step/welcome-message-step.component';
import { MessagesStepComponent } from './profile-complete-steps/messages-step/messages-step.component';
import { SocialMediaLinksStepComponent } from './profile-complete-steps/social-media-links-step/social-media-links-step.component';
import { ConfirmProfileStepComponent } from './profile-complete-steps/confirm-profile-step/confirm-profile-step.component';
import { TutorialStepComponent } from './profile-complete-steps/tutorial-step/tutorial-step.component';

import { QRCodeModule } from 'angularx-qrcode';


@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        NgbModule,
        QRCodeModule,
        RealEstateAgentRoutingModule,
        RouterModule,
        CommonModule,
        
        SharedModule
    ],
    declarations:[
    RealEstateAgentIndexComponent,
    MessageManagerComponent,
    ClientManagerComponent,
    AllClientsComponent,
    MessageEditorComponent,
    CompleteProfileWizardComponent,
    QRClientAgentComponent,
    HOWelcomeComponent,
    FooterLinksStepComponent,
    WelcomeMessageStepComponent,
    MessagesStepComponent,
    SocialMediaLinksStepComponent,
    ConfirmProfileStepComponent,
    TutorialStepComponent,
  ],
    providers:[UntypedFormBuilder],
    
})
export class RealEstateAgentModule{}
