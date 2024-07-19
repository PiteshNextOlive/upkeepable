import { Component, OnInit } from '@angular/core';
import { CommonOpsService } from 'src/app/shared/common-ops-service';
import { trigger, transition, query, style, animate, group } from '@angular/animations';
import { AppHttpRequestHandlerService } from 'src/app/shared/app-http-request-handler.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericResponseTemplateModel } from 'src/app/generic-type-module';
import { IHomeOwnerAddressAttribute } from '../home-owner-address-type-module';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserJwtDecodedInfo } from 'src/app/account/account-type-module';
import { AuthService } from 'src/app/auth.service';
import { AccountService } from 'src/app/account/account.service';
import { IHomeVariableMainCategory } from 'src/app/admin-user/home-variable-manager/home-variable-type-module';
//import { MessageService } from 'src/app/message.service';

const left = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(-100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(100%)' }))], {
      optional: true,
    }),
  ]),
];

const right = [
  query(':enter, :leave', style({ position: 'absolute', width: '100%' }), { optional: true }),
  group([
    query(':enter', [style({ transform: 'translateX(100%)' }), animate('.3s ease-out', style({ transform: 'translateX(0%)' }))], {
      optional: true,
    }),
    query(':leave', [style({ transform: 'translateX(0%)' }), animate('.3s ease-out', style({ transform: 'translateX(-100%)' }))], {
      optional: true,
    }),
  ]),
];

@Component({
  selector: 'app-manage-home-address-detail',
  templateUrl: './manage-home-address-detail.component.html',
  styleUrls: ['./manage-home-address-detail.component.css'],
  animations: [
    trigger('animImageSlider', [
      transition(':increment', right),
      transition(':decrement', left),
    ]),
  ]
})
export class ManageHomeAddressDetailComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  homeOwnerAddressAttributes: IHomeOwnerAddressAttribute[]
  counter: number = 1;
  maxSteps: number = 6;
  homeOwnerAddressId: number = 0;
  specificStepNum: number = 0;
  previousClosestStep: number = 0;
  nextClosestStep: number = 0;
  mainCategories:IHomeVariableMainCategory[]=[];
  userJwtDecodedInfo: UserJwtDecodedInfo;
  constructor(public commonOpsService: CommonOpsService,
    private appHttpRequestHandlerService: AppHttpRequestHandlerService,
    private router: Router,
    private route: ActivatedRoute,
    public authService: AuthService,
    private accountService: AccountService
    // private messageService: MessageService
    ) { }
  ngOnInit(): void {
    this.userJwtDecodedInfo = this.authService.getUserJwtDecodedInfo();
    this.route.queryParams
      .subscribe(params => {
       // console.log("param",params);
        if(params.info!=undefined && params.info>0){
          this.homeOwnerAddressId = params.info;
        }
        else{
          this.homeOwnerAddressId= this.userJwtDecodedInfo.HomeOwnerAddressId;
        }
        //console.log(this.homeOwnerAddressId)
       // console.log(this.userJwtDecodedInfo)
        // this.messageService.setHomeOwnerAddressId(this.homeOwnerAddressId);
        this.appHttpRequestHandlerService.httpGet({ homeOwnerAddressId: this.homeOwnerAddressId }, "HomeOwnerAddress", "GetAllCofigureHomeAddressAttributes").pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: GenericResponseTemplateModel<IHomeOwnerAddressAttribute[]>) => {
            this.homeOwnerAddressAttributes = data.responseDataModel;
           // console.log(this.homeOwnerAddressAttributes)
            let firstIndexOfPendingStep = this.homeOwnerAddressAttributes.findIndex(x => x.homeOwnerAddressDetailStatusType == 0);
            //console.log("first_step",firstIndexOfPendingStep);
            if (params.code != undefined) {
              this.counter = params.code;
              this.specificStepNum = this.counter;
             // console.log("count",this.specificStepNum);
            }
            else {
              if (!this.homeOwnerAddressAttributes.find(x => x.homeOwnerAddressDetailStatusType == 0)) {
                this.counter = 100;
              }
              else {
                this.counter = this.homeOwnerAddressAttributes.findIndex(x => x.homeOwnerAddressDetailStatusType == 0) + 1;
                this.getNextPreviousClosestStep(this.counter);
              }
            }
          });
      });
      this.getAllMainCategories();
  }
  getAllMainCategories(){
    this.appHttpRequestHandlerService.httpGet({ id: 0 }, "HomeVariableManager", "GetAllMainCategories").pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((data: GenericResponseTemplateModel<IHomeVariableMainCategory[]>) => {
      this.mainCategories=data?.responseDataModel;
     // console.log(this.mainCategories)
    });
  }
  getNextPreviousClosestStep(currStep: number) {
    this.nextClosestStep = this.homeOwnerAddressAttributes.findIndex(x => x.homeOwnerAddressDetailStatusType == 0 && x.homeOwnerAddressDetailType > currStep);
    if (this.nextClosestStep != -1) {
      this.nextClosestStep += 1;
    }
    var prevPendingSteps = this.homeOwnerAddressAttributes.filter(x => x.homeOwnerAddressDetailStatusType == 0 && x.homeOwnerAddressDetailType < currStep)
    if (prevPendingSteps.length == 0) {
      this.previousClosestStep = -1;
    }
    else {
      this.previousClosestStep = prevPendingSteps[prevPendingSteps.length - 1].homeOwnerAddressDetailType;
    }
    // console.log('currStep ', currStep);
    // console.log('PrevIndex ', this.previousClosestStep);
    // console.log('nextClosestStep ', this.nextClosestStep);
  }

  onNext() {
    if (this.homeOwnerAddressAttributes.find(x => x.homeOwnerAddressDetailStatusType == 0) == undefined) {
      this.counter = 100;
    }
    else {
      let nextIndexOfPendingStep = this.homeOwnerAddressAttributes.findIndex(x => x.homeOwnerAddressDetailStatusType == 0 && x.homeOwnerAddressDetailType > this.counter);
      if (nextIndexOfPendingStep == -1) {
        nextIndexOfPendingStep = this.homeOwnerAddressAttributes.findIndex(x => x.homeOwnerAddressDetailStatusType == 0 && x.homeOwnerAddressDetailType > 0);
        this.counter = nextIndexOfPendingStep + 1;
      }
      else {
        this.counter = nextIndexOfPendingStep + 1;
      }
      this.getNextPreviousClosestStep(this.counter);
    }
  }

  onPrevious() {
    this.counter = this.previousClosestStep;
    this.getNextPreviousClosestStep(this.counter);
  }
  onMoveToNextFormEvent(infoFromChild: any) {
    if (this.specificStepNum > 0) {
      this.router.navigate(['HomeAddress/Details'], { queryParams: { info: this.homeOwnerAddressId, code: this.specificStepNum } });
    }
    this.homeOwnerAddressAttributes[this.counter - 1].homeOwnerAddressDetailStatusType = 1;
    this.onNext();
  }
  oncloseFormEventEvent() {
    //if (this.accountService.getUserJwtDecodedInfo().RoleName == 'HOME_OWNER_USER') {
      if (this.specificStepNum > 0) {
        this.router.navigate(['HomeAddress/Details'], { queryParams: { info: this.homeOwnerAddressId, code: this.specificStepNum } });
      }
      else {
        this.router.navigate(['HomeAddress/Details'], { queryParams: { info: this.homeOwnerAddressId } });
      }
    // }
    // else if(this.accountService.getUserJwtDecodedInfo().RoleName == 'REAL_ESTATE_USER'){
    //   this.router.navigate(['RealEstateAgent/Dashboard']);
    // }
  }
  onClickUpkeep() {
    if(this.userJwtDecodedInfo?.RoleName=='HOME_OWNER_USER'){
      this.router.navigate(['/HomeAddress/Dashboard']);
    }
    else if(this.userJwtDecodedInfo?.RoleName=='REAL_ESTATE_USER'){
      this.router.navigate(['/RealEstateAgent/Dashboard']);
    }
    else if(this.userJwtDecodedInfo?.RoleName=='ADMIN_USER'){
      this.router.navigate(['/Admin/Dashboard']);
    }
    // this.router.navigate(['/HomeAddress/Dashboard'], { queryParams: { info: this.homeOwnerAddressId } });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
