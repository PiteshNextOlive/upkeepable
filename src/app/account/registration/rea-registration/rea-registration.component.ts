import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { GenericFormModel, GenericResponseTemplateModel, IState, TForm } from 'src/app/generic-type-module';
import { IRealEstateAgentRegistrationViewModel, IReaNewUserResponseViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { AppToastService } from '../../../toast/app-toast.service';
import { AccountService } from '../../account.service';

@Component({
  selector: 'app-rea-registration',
  templateUrl: './rea-registration.component.html',
  styleUrls: ['./rea-registration.component.css']
})
export class ReaRegistrationComponent implements OnInit {
  stepCode: number = 1;
  isDuplicateEmail: boolean=false;
  submittedStep1:boolean=false;
  submittedStep2:boolean=false;
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  inputForm: TForm<IRealEstateAgentRegistrationViewModel> = this.fb.group({
    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],
    address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    cityName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
    stateCode: ['', Validators.required],
   // stateCode: ['', Validators.required],
  }) as TForm<IRealEstateAgentRegistrationViewModel>;
  get formControls() { return this.inputForm.controls; }
  states: IState[] = [];
  constructor(private fb: UntypedFormBuilder,
    public toastService: AppToastService,
    private accountService: AccountService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private authService: AuthService) { }

  ngOnInit(): void {
    localStorage.removeItem("BearerToken");
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: IState[]) => {
        this.states = data;
      });
  }
  setFormStep(step: number, isPrev: boolean){
    if(isPrev){
      this.stepCode = step;
    }
    else if(step==2){
      this.submittedStep1=true;
      if(this.formControls.firstName.valid && this.formControls.lastName.valid && this.formControls.email.valid  && this.formControls.phone.valid && !this.isDuplicateEmail){
        this.stepCode = step;
      }
    }
    else if(step==3){
      this.submittedStep2=true;
      if(this.formControls.address.valid && this.formControls.zipCode.valid && this.formControls.cityName.valid){
        
        this.onSubmitInviteClient()
      }
    }
  }
  onSubmit(){

  }
  checkDuplicateEmail(){
   // console.log(this.inputForm.controls.email.value)
    if(this.inputForm.controls.email.valid){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.email.value, id: 0}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
      });
    }
  }
  onEmailFocusOut(){
    if(this.isDuplicateEmail){
      //this.inputForm.controls.email.patchValue('');
     // this.isDuplicateEmail=false;
    }
  }


  onSubmitInviteClient() {
    // this.inputForm.controls.userRefId.patchValue(0);
    // this.inputForm.controls.isActive.patchValue(true);
    // this.inputForm.controls.isDeleted.patchValue(false);
    // this.inputForm.controls.isEmailConfirmed.patchValue(false);
    // this.inputForm.controls.userStatusType.patchValue(0);
    //this.inputFormHomeOwner.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo.UserId);
    //this.inputForm.controls..patchValue(this.inputFormHomeOwner.controls.reaUser.value.userId);
    if (this.inputForm.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "ReaUserRegistration").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<IReaNewUserResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
          this.stepCode = 3;
          //this.inputForm.reset();
          // this.submittedStep1=false;
          // this.submittedStep2=false;
        });
    }
    //this.submitted = true;
  }
}
