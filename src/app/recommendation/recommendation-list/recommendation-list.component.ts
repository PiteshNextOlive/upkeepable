import { Component, OnInit } from '@angular/core';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GenericResponseTemplateModel } from 'src/app/generic-type-module';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { IRecommendation } from 'src/app/home-owner-address/home-owner-address-type-module';
@Component({
  selector: 'app-recommendation-list',
  templateUrl: './recommendation-list.component.html',
  styleUrls: ['./recommendation-list.component.css']
})
export class RecommendationListComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  closeResult = '';
  recomendations: IRecommendation[]=[];
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, private modalService: NgbModal) { }
  ngOnInit(): void {
    this.appHttpRequestHandlerService.httpGet({ }, "Recommendation", "GetAllRecommendations").pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<IRecommendation[]>) => { 
       // console.log(data.responseDataModel); this.recomendations = data.responseDataModel
      });
  }
  open(content:any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title', centered:true}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
}
