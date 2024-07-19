import { Component, OnInit  } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { IFooterLink } from 'src/app/footer-link/footer-link-type-module';
import { GenericResponseTemplateModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { AppToastService } from '../../../toast/app-toast.service';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
@Component({
  selector: 'app-footer-links-step',
  templateUrl: './footer-links-step.component.html',
  styleUrls: ['./footer-links-step.component.css']
})
export class FooterLinksStepComponent implements OnInit {

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  public footerLinks: IFooterLink[] = [];
  selectedFooterLinkId: number = 0;
  private id: any;

  inputFormFooterLink: TForm<IFooterLink> = this.fb.group({
    footerLinkId: [0, Validators.required],
    linkTitle: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    linkUrl: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    footerLinkSourceType: [0, Validators.required],
    userRefId: [0, Validators.required],
    lastModifiedOn: [new Date(), Validators.required],
  }) as TForm<IFooterLink>;



  userJwtDecodedInfo: UserJwtDecodedInfo;
  get formControls() { return this.inputFormFooterLink.controls; }

  inputFormEditFooterLink: TForm<IFooterLink> = this.fb.group({
    footerLinkId: [0, Validators.required],
    linkTitle: ['', [Validators.required, Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    linkUrl: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    footerLinkSourceType: [0, Validators.required],
    userRefId: [0, Validators.required],
    lastModifiedOn: [new Date(), Validators.required],
  }) as TForm<IFooterLink>;
  get EditFormControls() { return this.inputFormEditFooterLink.controls; }
  submitted: boolean = false;
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public toastService: AppToastService,
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    public commonOpsService: CommonOpsService,
    private modalService: NgbModal) { }

  ngOnInit(): void {
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.getAllFooterLinks();
  }
  onSubmitFooterLink() {
    this.toastService.clear();
    this.submitted = true;
    this.inputFormFooterLink.controls.footerLinkId.patchValue(0);
    this.inputFormFooterLink.controls.footerLinkSourceType.patchValue(2);
    this.inputFormFooterLink.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
    this.inputFormFooterLink.controls.lastModifiedOn.patchValue(new Date());
    if (this.inputFormFooterLink.valid) {
      //this.submitted=false;
      this.appHttpRequestHandlerService.httpPost(this.inputFormFooterLink.value, "FooterLink", "AddNewFooterLink").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<number>) => {
          this.toastService.show("", "Footer Link Submitted", 3000, "bg-success text-white", "fa-check-circle");
          if (!data.hasError) {
            this.inputFormFooterLink.reset();
            this.getAllFooterLinks();
            this.submitted = false;
          }
        });

    }
  }



  onSubmitEditFooterLink(){
    this.toastService.clear();
    this.inputFormEditFooterLink.controls.footerLinkId.patchValue(this.selectedFooterLinkId);
    this.inputFormEditFooterLink.controls.footerLinkSourceType.patchValue(2);
    this.inputFormEditFooterLink.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
    this.inputFormEditFooterLink.controls.lastModifiedOn.patchValue(new Date());
    if (this.inputFormEditFooterLink.valid) {
      this.appHttpRequestHandlerService.httpPost(this.inputFormEditFooterLink.value, "FooterLink", "EditFooterLink").pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<number>) => {
    this.toastService.show("","Footer Link Submitted", 3000,"bg-success text-white","fa-check-circle");
          if (!data.hasError) {
            this.inputFormEditFooterLink.reset();
            this.modalService.dismissAll();
            this.getAllFooterLinks();
          }
      });
      this.submitted=false;

    }
  }
  getAllFooterLinks() {
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId }, "FooterLink", "GetFooterLinksByUserRefId").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(async (data: GenericResponseTemplateModel<IFooterLink[]>) => {
        this.footerLinks = data.responseDataModel;
      });
  }


  openRemoveFooterLink(content, selectedFooterLinkId) {
    this.selectedFooterLinkId = selectedFooterLinkId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => { }, (reason) => { });
  }
  onRemoveFooterLinkModalCancelClick() {
    this.modalService.dismissAll();
  }
  onRemoveFooterLinkModalYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost({ id: this.selectedFooterLinkId }, "FooterLink", "DeleteFooterLinkById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: any) => {
        this.toastService.show("", "Footer Link deleted successfully.", 3000, "bg-success text-white", "fa-check-circle");
        if (data.responseDataModel) {
          this.footerLinks = this.footerLinks.filter(x => x.footerLinkId != this.selectedFooterLinkId);
        }
      });
  }

  openAddEditFooterLinkModal(content, selectedFooterLinkId) {
    this.selectedFooterLinkId = selectedFooterLinkId;
    this.inputFormEditFooterLink.reset();
    if (this.selectedFooterLinkId > 0) {
      this.inputFormEditFooterLink.patchValue(this.footerLinks.filter(x => x.footerLinkId == selectedFooterLinkId)[0]);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true }).result.then((result) => { }, (reason) => { });
  }
  onAddEditFooterLinkModalCancelClick() {
    this.modalService.dismissAll();
  }
}
