import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { ReplyToEmailModal } from '../account-type-module';
import { TForm } from 'src/app/generic-type-module';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';


@Component({
  selector: 'app-reply-to-email',
  templateUrl: './reply-to-email.component.html',
  styleUrls: ['./reply-to-email.component.css']
})
export class ReplyToEmailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  queryParamValue: string;

  constructor(
    private route: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
  ) { }


  EmailReplyForm: TForm<ReplyToEmailModal> = this.fb.group({
    Subject: ['', Validators.required],
    Message: ['', Validators.required],
    To:['', Validators.required]
  }) as TForm<ReplyToEmailModal>;

 

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.queryParamValue = params['email'];
    });
  }

  onSubmit(): void {
    this.EmailReplyForm.patchValue({
      To: this.queryParamValue,
  });
    this.appHttpRequestHandlerService.httpPost(this.EmailReplyForm.value, "RealEstateAgent", "SendReplyToEmail").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: string) => {
      this.EmailReplyForm.reset();
    
    });

  }



}
