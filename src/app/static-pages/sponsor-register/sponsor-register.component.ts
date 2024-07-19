import { Component, OnInit ,Renderer2} from '@angular/core';
import { TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IDataTableParamsViewModel, IState } from 'src/app/generic-type-module';
import { UntypedFormBuilder,UntypedFormGroup,Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from 'src/app/account/account.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';
import { IReaNewUserResponseViewModel,IReaViewModel } from 'src/app/real-estate-agent/real-estate-agent-type-module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/auth.service';
import { ISponsorRegisterViewModel,ISponsorRegResponseViewModel } from 'src/app/generic-type-module';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-sponsor-register',
  templateUrl: './sponsor-register.component.html',
  styleUrls: ['./sponsor-register.component.css']
})
export class SponsorRegisterComponent implements OnInit {
  submitted = false;
  fieldOldPass: boolean;
  fieldNewPass: boolean;
  fieldConfirmNewPass: boolean;
  email: string = '';
  resendId : number = 0;
  date = new Date();

  isActive = false;

  isClassApplied = false;
  istoggleclass = false;
   addClass() {
     this.isClassApplied = true;
   }
 
   removeClass() {
     this.isClassApplied = false;
   }

  toggleClass() {
    this.isActive = !this.isActive;
  }


  isOpen = false;
  openPopup(){
    this.isOpen = !this.isOpen;
  }

  get formControls() { return this.inputForm.controls; }
  states: IState[] = [];


  inputForm = this.fb.group({
    isNotficationOn: [1],
    IsActive: [false],
    isDeleted: [false],
    isEmailConfirmed: [false],
    userRefId: [0, [Validators.required]],
    FirstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    LastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),Validators.maxLength(20)]],
    Email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    Phone: ['', [Validators.required, Validators.pattern('^(\\+?\d{1,4}[\s-])?(?!0+\s+,?$)\\d{10}\s*,?$')]],  
    Address: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(300)]],
    ZipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
    CityName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    StateCode: ['', Validators.required],
    Password: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.minLength(6)]],
    ConfirmPassword: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/)]],
  },{ validator: this.passwordMatchValidator });




  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  isDuplicateEmail: boolean=false;

  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    private renderer: Renderer2, 
    public authService: AuthService,
    private fb: UntypedFormBuilder, 
    public commonOpsService:CommonOpsService,
    private modalService: NgbModal, 
    private router: Router,
    public toastService: AppToastService,
    private accountService: AccountService) { 

      
      if(this.authService.isUserLoggedIn()){
       // this.getAllUnreadNotifications(this.authService.getUserJwtDecodedInfo().UserId);
      }

    }



  ngOnInit(): void {
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "CommonApi", "GetAllStatesList").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: IState[]) => {
      this.states = data;
    });    
  }
  
  passwordMatchValidator(frm: UntypedFormGroup) {
    return frm.value.Password === frm.value.ConfirmPassword ? null : { 'mismatch': true };
  }
  toggleOldPass() {
    this.fieldOldPass = !this.fieldOldPass;
  }
  toggleNewPass() {
    this.fieldNewPass = !this.fieldNewPass;
  }

  onClickLogin(){
    this.router.navigate(['/Account/Login']);
  }  
  onSubmitSponsorRegister() {
    
    this.email = this.inputForm.value.Email;
    // if(this.inputForm.controls.cityName?.value?.trim()?.length  == 0){
    //   this.inputForm.controls.cityName?.patchValue("");
    // }
   this.inputForm.patchValue({
  userRefId:0,
  isActive: true,
  isDeleted: false,
  isEmailConfirmed:false
   })

    // this.inputForm.controls.isActive.patchValue(true);
    // this.inputForm.controls.isDeleted.patchValue(false);
    // this.inputForm.controls.isEmailConfirmed.patchValue(false);
    // this.inputFormHomeOwner.controls.realEstateAgentUserRefId.patchValue(this.userJwtDecodedInfo.UserId);
    // this.inputForm.controls..patchValue(this.inputFormHomeOwner.controls.reaUser.value.userId);
    if (this.inputForm.valid && !this.isDuplicateEmail) {      
    
      this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "RealEstateAgent", "CreatesponsorRegister").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericFormModel<ISponsorRegResponseViewModel>) => {
          this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");        
          this.inputForm.reset();
           this.resendId =  data.formModel.id;
           this.isOpen = true;
           this.submitted = false;
        });          
      }     
     this.submitted = true;
   
  }

  SendEmail(email:any)
  {

        this.appHttpRequestHandlerService.httpPost({Id: this.resendId, Email: email} , "RealEstateAgent", "ResendEmailVerificationTest").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: string) => {
           // this.inputForm.reset();
            this.toastService.show("","Resend Email Verification successfully", 3000,"bg-success text-white","fa-check-circle");
            //this.modalService.dismissAll();
          //this.clientManagerTemplate.searchByKeyword('');
           
          });
     
  }


  openInviteClientModal(content) : NgbModalRef{
    this.inputForm.reset();
   // this.invalidSize= true;
    this.submitted=false;
    this.isDuplicateEmail=false;
    this.inputForm.patchValue({
      isNotficationOn: 0,
      userRefId: 0,
  
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      userImage: '',
      userImageBase64: '',
      socialMedia_FacebookUrl:'',
      socialMedia_TweeterUrl:'',
      socialMedia_InstagramUrl:'',
      socialMedia_YoutubeUrl:'',
      stateCode:''
    });
   // this.profilePhoto=null;
    this.inputForm.controls.userRefId.patchValue(0);
    this.inputForm.controls.isActive.patchValue(true);
    this.inputForm.controls.isDeleted.patchValue(false);
    this.inputForm.controls.isEmailConfirmed.patchValue(false);
    this.inputForm.controls.userStatusType.patchValue(0);
    this.inputForm.controls.isNotficationOn.patchValue(0);
    return this.modalService.open(content, { size: 'lg', backdrop: 'static',keyboard: false });
  }

  checkDuplicateEmail(){
    if(this.inputForm.value.Email){
      this.accountService.checkDuplicateEmail({value: this.inputForm.controls.Email.value, id: this.inputForm.controls.userRefId.value}).pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<boolean>) => {
        this.isDuplicateEmail = data.responseDataModel;
      });
    }
  }
  onEmailFocusOut(){

    if(this.isDuplicateEmail){
      //this.inputForm.controls.email.patchValue('');
      //this.isDuplicateEmail=false;
    }
  }

  openStaticPage(pageName:string){
    this.router.navigate(['/'+pageName]);
      setTimeout(()=>{
        window.location.reload();
      }, 500);
    // else if(this.router.routerState.root.snapshot.firstChild.component["name"] == "QRClientAgentComponent"){
    //   this.router.navigate(['/'+pageName]);
    //   setTimeout(()=>{
    //     window.location.reload();
    //   }, 500);
    // }

  }

  goToLoginPage(){   
    this.router.navigate(['/Account/Login']);
  }

  onSubmit() {
   
    if (!this.inputForm.valid) {
      this.submitted = true;
      return;      
    }
        this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "CommonApi", "ContactForm").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericServiceResultTemplate) => {
          this.isClassApplied = false;
          this.inputForm.reset();  
          Swal.fire({
            title: 'We have received your request',
            text: 'Your request has been submitted via email. Please check your inbox for updates',
            icon: 'success', // You can change this to 'success', 'error', 'info', etc.
            confirmButtonText: 'CLOSE'
            //showCloseButton: true
          });               
          //this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
        });               
  }
  
}
