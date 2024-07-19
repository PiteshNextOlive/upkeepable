import { Component,HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  tabCode: number=1;
  constructor() { }

  ngOnInit(): void {
    let n=localStorage.getItem("tabCode");
    if(n!=null || n!=undefined){
      this.tabCode=Number(localStorage.getItem("tabCode"));
    }
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
   if(document.referrer.includes('Admin')&& document.referrer.includes('Dashboard')){
      window.location.href = document.referrer;
   }
  }

  setTabCode(tabCode: number){
    this.tabCode = tabCode;
    localStorage.setItem("tabCode", this.tabCode.toString());
  }
}
