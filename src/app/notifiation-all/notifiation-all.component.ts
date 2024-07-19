import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { GenericResponseTemplateModel, INotification } from '../generic-type-module';
import { AppHttpRequestHandlerService } from '../shared/app-http-request-handler.service';
import { SharingDataService } from '../services/sharing-data/sharing-data.service';

@Component({
  selector: 'app-notifiation-all',
  templateUrl: './notifiation-all.component.html',
  styleUrls: ['./notifiation-all.component.css']
})
export class NotifiationAllComponent implements OnInit {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  notifications: INotification[]=[];
  constructor(private appHttpRequestHandlerService: AppHttpRequestHandlerService, 
    public authService: AuthService,
    private router: Router,
    private sharingdataService: SharingDataService
    ) { }

  ngOnInit(): void {
    this.getAllUnreadNotifications(this.authService.getUserJwtDecodedInfo().UserId);
  }
  getAllUnreadNotifications(userId){
    this.appHttpRequestHandlerService.httpGet({ id: userId }, "NotificationManager", "GetAllNotifications")
    .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: GenericResponseTemplateModel<INotification[]>) => {
       this.notifications = data.responseDataModel;
      });
  }
  goToHomePage() {
    this.sharingdataService.setHrSharingData(true);
    localStorage.setItem("name", "true");
    this.router.navigate(['/HomeAddress/Dashboard']);
  }
}
