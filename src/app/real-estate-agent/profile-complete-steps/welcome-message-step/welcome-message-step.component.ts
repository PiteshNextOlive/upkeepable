import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { GenericFormModel, GenericServiceResultTemplate, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { IRealEstateAgentMessage, IRealEstateAgentWelcomeMessage } from '../../real-estate-agent-type-module';
import { AppToastService } from '../../../toast/app-toast.service';
@Component({
  selector: 'app-welcome-message-step',
  templateUrl: './welcome-message-step.component.html',
  styleUrls: ['./welcome-message-step.component.css']
})
export class WelcomeMessageStepComponent implements OnInit {
  inputFormWelcomeMessage: TForm<IRealEstateAgentWelcomeMessage> = this.fb.group({
    realEstateAgentWelcomeMessageId: [0, Validators.required],
    messageText: ['', [Validators.required, Validators.maxLength(500)]],
    userRefId: ['', Validators.required],
  }) as TForm<IRealEstateAgentWelcomeMessage>
  submitted = false;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,public authService: AuthService,
    public toastService: AppToastService,
    public  commonOpsService:CommonOpsService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService) { }
  get WelcomeMessageformControls() { return this.inputFormWelcomeMessage.controls; }
  ngOnInit(): void {
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId}, "RealEstateAgent", "GetRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericFormModel<IRealEstateAgentMessage>) => {
        this.inputFormWelcomeMessage.reset();
        this.inputFormWelcomeMessage.patchValue(data.formModel);
        this.inputFormWelcomeMessage.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
        if (data.formModel == null) {
          this.inputFormWelcomeMessage.controls.realEstateAgentWelcomeMessageId.patchValue(0);
        }
      });
  }
  onWelcomeMessageFormSubmit() {
    if (this.inputFormWelcomeMessage.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormWelcomeMessage.value, "RealEstateAgent", "UpdateRealEstateAgentWelcomeMessage").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        });
    }
    this.submitted = true;
  }
}
