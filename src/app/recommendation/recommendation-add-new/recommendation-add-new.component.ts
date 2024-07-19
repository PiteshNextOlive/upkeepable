import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { TForm } from 'src/app/generic-type-module';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { IRecommendation } from 'src/app/home-owner-address/home-owner-address-type-module';
import { AppToastService } from '../../toast/app-toast.service';
@Component({
  selector: 'app-recommendation-add-new',
  templateUrl: './recommendation-add-new.component.html',
  styleUrls: ['./recommendation-add-new.component.css']
})
export class RecommendationAddNewComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private fb: UntypedFormBuilder,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    public toastService: AppToastService) { }

    inputForm: TForm<IRecommendation> = this.fb.group({
      recommendationId: [0, Validators.required],
      descriptionText: ['', [Validators.required, Validators.maxLength(500)]],
      imageFile:['abc', [Validators.required, Validators.maxLength(200)]],
      recommendationStausType: [1, Validators.required],
      createdOn: ["2022-10-10T10:00:00", Validators.required],
      lastModifiedOn:["2022-10-10T10:00:00",Validators.required]
  }) as TForm<IRecommendation>;


  ngOnInit(): void {
  }
  onSubmit(){
    this.appHttpRequestHandlerService.httpPost(this.inputForm.value, "Recommendation", "AddNewRecommendation").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: number) => {
      this.toastService.show("","Recommendation Submitted", 3000,"bg-success text-white","fa-check-circle");
     // console.log(data)
    });

  }

}
