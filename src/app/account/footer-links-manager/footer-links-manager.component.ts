import { Component, OnInit } from '@angular/core';
import { IFooterLink } from 'src/app/footer-link/footer-link-type-module';
import { GenericResponseTemplateModel, TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserJwtDecodedInfo } from '../account-type-module';
import { AuthService } from 'src/app/auth.service';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-footer-links-manager',
  templateUrl: './footer-links-manager.component.html',
  styleUrls: ['./footer-links-manager.component.css']
})
export class FooterLinksManagerComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  footerLinks:IFooterLink[]=[];
  selectedFooterLinkId: number=0;
  userJwtDecodedInfo: UserJwtDecodedInfo;
  inputFormFooterLink: TForm<IFooterLink> = this.fb.group({
    footerLinkId: [0, Validators.required],
    linkTitle: ['', [Validators.required ,Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/), Validators.maxLength(20)]],
    linkUrl: ['', [Validators.required, Validators.pattern(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)]],
    footerLinkSourceType: [0, Validators.required],
    userRefId: [0, Validators.required],
    lastModifiedOn: [new Date(), Validators.required]
  }) as TForm<IFooterLink>;
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    public toastService: AppToastService,
    private modalService: NgbModal, 
    public authService: AuthService,
    private fb: UntypedFormBuilder,
    public commonOpsService: CommonOpsService) { }
  get formControls() { return this.inputFormFooterLink.controls; }
  submitted: boolean=false;
  ngOnInit(): void {
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.getAllFooterLinks();
  }
  getAllFooterLinks(){
    this.appHttpRequestHandlerService.httpGet({ id: this.userJwtDecodedInfo.UserId}, "FooterLink", "GetFooterLinksByUserRefId").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IFooterLink[]>) => {
      this.footerLinks = data.responseDataModel;     
    });
  }
  openRemoveFooterLink(content, selectedFooterLinkId) {
    this.selectedFooterLinkId = selectedFooterLinkId;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  onRemoveFooterLinkModalCancelClick() {
    this.modalService.dismissAll();
  }
  onAddEditFooterLinkModalCancelClick() {
    this.modalService.dismissAll();
  }
  onRemoveFooterLinkModalYesClick() {
    this.modalService.dismissAll();
    this.appHttpRequestHandlerService.httpPost({ id: this.selectedFooterLinkId }, "FooterLink", "DeleteFooterLinkById")
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data:any) => {
        this.toastService.show("","Footer Link deleted successfully.", 3000,"bg-success text-white","fa-check-circle");
        if(data.responseDataModel){
          this.footerLinks=this.footerLinks.filter(x=>x.footerLinkId!=this.selectedFooterLinkId);
        }
      },
      
      );
  }
  openAddEditFooterLinkModal(content, selectedFooterLinkId) {
    this.submitted=false;
    this.selectedFooterLinkId = selectedFooterLinkId;
    this.inputFormFooterLink.reset();
    if(this.selectedFooterLinkId>0){
      this.inputFormFooterLink.patchValue(this.footerLinks.filter(x=>x.footerLinkId==selectedFooterLinkId)[0]);
    }
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered:true }).result.then((result) => {}, (reason) => {});
  }
  onSubmitFooterLink(){
    this.submitted=true;
    this.inputFormFooterLink.controls.footerLinkId.patchValue(this.selectedFooterLinkId);
    this.inputFormFooterLink.controls.footerLinkSourceType.patchValue((this.userJwtDecodedInfo.RoleId == '1') ? 1 : 2 );
    this.inputFormFooterLink.controls.userRefId.patchValue(this.userJwtDecodedInfo.UserId);
    this.inputFormFooterLink.controls.lastModifiedOn.patchValue(new Date());
    if (this.inputFormFooterLink.valid) {
      var endpoint='AddNewFooterLink';
      if(this.selectedFooterLinkId>0){
        endpoint='EditFooterLink';
      }
      this.appHttpRequestHandlerService.httpPost(this.inputFormFooterLink.value, "FooterLink", endpoint).pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data: GenericResponseTemplateModel<number>) => {
          if (!data.hasError) {
            this.toastService.show("","Footer Link Submitted", 3000,"bg-success text-white","fa-check-circle");
            this.inputFormFooterLink.reset();
            this.modalService.dismissAll();
            this.getAllFooterLinks();
          }
      });
    }
  }
}
