import { Component, OnInit } from '@angular/core';
import { HttpLoaderService } from '../http-loader.service';
@Component({
  selector: 'app-http-loader',
  templateUrl: './http-loader.component.html',
  styleUrls: ['./http-loader.component.css']
})
export class HttpLoaderComponent implements OnInit {
  loading: boolean | undefined;
  isApiCompleted: any;
  constructor(private httpLoaderService: HttpLoaderService) {
    
    this.httpLoaderService.isLoading.subscribe((v) => {
      //debugger;
      this.loading = v;
    });

    this.httpLoaderService.showDialogBox.subscribe((v) => {
      this.isApiCompleted = v;
      //showDislog:false, isError:false, errorMsg:''
    });

   }

  ngOnInit(): void {
  }
  public hideApiMessageDialog(){
    localStorage.removeItem("BearerToken");
    this.isApiCompleted.showDislog = false;
  }
}
