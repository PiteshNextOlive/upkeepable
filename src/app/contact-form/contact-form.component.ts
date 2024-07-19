import { Component, OnInit} from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { EnumJsonTemplate, GenericFormModel, GenericResponseTemplateModel, GenericServiceResultTemplate, IState, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContacTypeModel } from '../account/account-type-module';
import { AppToastService } from '../toast/app-toast.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  submitted = false;
  constructor(private modalService: NgbModal,
    private fb: UntypedFormBuilder,    
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public commonOpsService: CommonOpsService,
    public toastService: AppToastService,
    private router: Router,
    private route: ActivatedRoute) { }
    inputForm: TForm<ContacTypeModel> = this.fb.group({
    firstName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    lastName: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    email: ['', [Validators.required, Validators.pattern('[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}')]],
    message: ['',[Validators.required]]
    }) as TForm<ContacTypeModel>;
    get formControls() { return this.inputForm.controls; }
  ngOnInit(): void {    
  }

  // onSubmit() {
    
  //   this.submitted = true;
  //       if (this.inputForm.valid) {            
  //         this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "CommonApi", "ContactForm").pipe(takeUntil(this.ngUnsubscribe))
  //           .subscribe((data: GenericServiceResultTemplate) => {
  //             this.inputForm.reset();      
  //       this.inputForm.controls.firstName.setErrors(null);
  //       this.inputForm.controls.lastName.setErrors(null);
  //       this.inputForm.controls.email.setErrors(null);
  //       this.inputForm.controls.message.setErrors(null);
  //       this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
  //           });
           
  //       }
  //   }
  onSubmit() {
        if (!this.inputForm.valid) {
          this.submitted = true;
          return;      
        }
            this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "CommonApi", "ContactForm").pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: GenericServiceResultTemplate) => {
              this.inputForm.reset();  
              Swal.fire({
                title: 'We have Recieved Your Request',
                text: 'Your request has been submitted via email. Please check your inbox for updates',
                icon: 'success', // You can change this to 'success', 'error', 'info', etc.
                confirmButtonText: 'CLOSE'
                //showCloseButton: true
              });            
              //this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle");
            });               
      }      
}
