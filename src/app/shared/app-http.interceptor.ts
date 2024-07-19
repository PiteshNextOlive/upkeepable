import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpLoaderService } from './http-loader.service';
//import Swal from 'sweetalert2';
import {AccountService} from '../account/account.service';
import { AppToastService } from '../toast/app-toast.service';
@Injectable()
export class AppHttpInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];
  isCompleted: boolean = true;

  constructor(private loaderService: HttpLoaderService, private accountService: AccountService, public toastService: AppToastService) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    if (i >= 0) {
      this.requests.splice(i, 1);
    }
    //debugger;
    if(this.requests.length === 0)
    {
      this.loaderService.isLoading.next(false);
    }
    else{
      this.loaderService.isLoading.next(this.requests.length > 0);
    }
    //  if(req.url != "https://stage.upkeepable.com:4455/api/HomeOwnerAddress/AddNewHomeOwnerEntry")
    // var loaderStatus = localStorage.getItem("loaderStatus");
    // if(loaderStatus != "0"){
    // this.loaderService.isLoading.next(this.requests.length > 0);
    // } else {
    //   this.loaderService.isLoading.next(false);
    // }
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let currentUser = this.accountService.getJwtToken();
        if (currentUser) {
          req = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser}`
                }
            });
        }
        //debugger;
    this.requests.push(req);
   // if(req.url === "https://app.upkeepable.com:4455/api/NotificationManager/GetAllUnreadNotifications")
    //if(req.url === "https://stage.upkeepable.com:4455/api/NotificationManager/GetAllUnreadNotifications")
   //{
     // this.requests.pop();
     // this.loaderService.isLoading.next(false);
    //}
    //if(req.url === "https://app.upkeepable.com:4455/api/CommonApi/getImageBlob")
    if(req.url === "https://stage.upkeepable.com:4455/api/CommonApi/getImageBlob")
    {
      this.requests.pop();
      this.loaderService.isLoading.next(false);
    }
   //if(req.url === "https://app.upkeepable.com:4455/api/HomeOwnerAddress/AddNewHomeOwnerEntry")
    if(req.url === "https://stage.upkeepable.com:4455/api/HomeOwnerAddress/AddNewHomeOwnerEntry")
    {
      this.requests.pop();
      this.loaderService.isLoading.next(false);
    }
   // if(req.url !== "https://app.upkeepable.com:4455/api/NotificationManager/GetAllUnreadNotifications" && req.url != "https://app.upkeepable.com:4455/api/CommonApi/getImageBlob" && req.url !== "https://app.upkeepable.com:4455/api/HomeOwnerAddress/AddNewHomeOwnerEntry")
    if(req.url !== "https://stage.upkeepable.com:4455/api/CommonApi/getImageBlob" && req.url !== "https://stage.upkeepable.com:4455/api/HomeOwnerAddress/AddNewHomeOwnerEntry")
    {
      this.loaderService.isLoading.next(true);
    }
    // if(req.url != "https://app.upkeepable.com:4455/api/CommonApi/getImageBlob")
    // {
    //   this.loaderService.isLoading.next(true);
    // }
    // var loaderStatus = localStorage.getItem("loaderStatus");
    // if(loaderStatus != "0"){
    // this.loaderService.isLoading.next(true);
    // } 
    // else {
    //   this.loaderService.isLoading.next(false);
    // }

    // if(req.method=="GET"){
    //   this.loaderService.showDialogBox.next(true);
    // }
    return Observable.create((observer: { next: (arg0: HttpResponse<any>) => void; error: (arg0: any) => void; complete: () => void; }) => {
      const subscription = next.handle(req)
        .subscribe((
          event: any) => {
            if(event.body?.responseDataModel?.isCompleted == false){
              this.isCompleted = false;
            }
            if (event instanceof HttpResponse) {
              //debugger;
              this.removeRequest(req);
              // if(req.method=="POST"){
              //   this.loaderService.showDialogBox.next(true);
              // }
              observer.next(event);
            }
          },
          err => {
            //alert('error' + err);
            this.removeRequest(req);
            //this.loaderService.showDialogBox.next({showDislog:true, isError:true, errorMsg:err?.error });
            // Swal.fire({  
            //   icon: 'error',  
            //   title: 'Oops...',  
            //   text: 'Something went wrong!',  
            //   //footer: '<a href>Why do I have this issue?</a>'  
            // });
            this.toastService.show("","Something went wrong...!", 3000,"bg-danger text-white","fa-exclamation-triangle");   
            observer.error(err);
          },
          () => {
            this.removeRequest(req);
            if(req.method=="POST"){
              //this.loaderService.showDialogBox.next({showDislog:true, isError:false, errorMsg:'err'});
              // Swal.fire({  
              //   //position: 'top-end',  
              //   icon: 'success',  
              //   title: 'Done',  
              //   showConfirmButton: true,  
              //   timer: 1500  
              // });
              if(!this.isCompleted){
                this.isCompleted = !this.isCompleted;
                return;
              }
              if(!req.url.includes('login')){
               // this.toastService.show("","Submitted", 3000,"bg-success text-white","fa-check-circle"); 
              }
            }
            observer.complete();
          });
      // remove request from queue when cancelled
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}