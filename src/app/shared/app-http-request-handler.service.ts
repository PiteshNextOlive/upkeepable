import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AppHttpRequestHandlerService {
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  constructor(private httpClient: HttpClient, @Inject(Router) private router: Router) { }
  
  httpGet(params: any, apiController: string, apiAction: string): Observable<any>{
    //debugger;
    return this.httpClient.get(environment.defaultApiRoot + "api/" + apiController + "/" + apiAction, {params: params})
      .pipe(catchError(err=>this.errorHandler(err)));
  }

  httpPost(postData: any, apiController: string, apiAction: string): Observable<any>{
    // var formData = new FormData();
    // formData.append('requestData',postData);
     return this.httpClient.post(environment.defaultApiRoot + "api/"  + apiController + "/" + apiAction,postData,{
       headers: new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8'
       })})
      .pipe(catchError(err=>this.errorHandler(err)));
  }

  httpDelete(params: any, apiController: string, apiAction: string): Observable<any>{
    return this.httpClient.get(environment.defaultApiRoot + "api/" + apiController + "/" + apiAction, {params: params})
      .pipe(catchError(err=>this.errorHandler(err)));
  }

  errorHandler(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
        if(error.status==401 || error.status==403) {
          localStorage.removeItem("BearerToken");
          this.router.navigate(['/Account/Login']);
        }
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}
