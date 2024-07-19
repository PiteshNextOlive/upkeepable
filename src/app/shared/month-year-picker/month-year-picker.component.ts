import { Component, forwardRef, HostBinding, Input,OnInit,ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {NgbDropdown} from '@ng-bootstrap/ng-bootstrap';

interface Idata {
  month: number;
  year: number;
}

@Component({
  selector: 'app-month-year-picker',
  templateUrl: './month-year-picker.component.html',
  styleUrls: ['./month-year-picker.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MonthYearPickerComponent),
      multi: true
    }
  ]
})
export class MonthYearPickerComponent implements ControlValueAccessor {

  data: Idata;
  dataTxt: string;
  separator: string;
  monthFirst: boolean;
  place: number;

  isyear:boolean=false;
  isDisableBack:boolean=false;
  incr:number=0;
  

  months: string[] = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  // Allow the input to be disabled, and when it is make it somewhat transparent.
  @Input() disabled = false;
  @Input() mask = "mm-yyyy";
  @Input() allMonths = false;

  @ViewChild('calendarPanel') calendar: NgbDropdown; 

  constructor() {
    this.separator = this.mask.replace(/m|y|M/gi, "");
    this.monthFirst = this.mask.indexOf('y') > 0;
    this.place = this.mask.indexOf(this.separator);
  }

  change(value: string) {
    value=this.separator==" "?value.replace(/\.|-|\//," "):
          this.separator=="/"?value.replace(/\.|-| /,"/"):
          this.separator=="-"?value.replace(/\.| |\//,"-"):
          value.replace(/.| |\/ /,"-");

    let lastchar = value.substr(value.length - 1);
    if (lastchar == this.separator && value.length <= this.place) {
      if (this.monthFirst) {
        value = "0" + value;
      }
    }
    if (value.length > this.place && value.indexOf(this.separator) < 0) {
      value = value.substr(0, value.length - 1) + this.separator + lastchar;
    }
    this.dataTxt = value;
    let items = value.split(this.separator);
    if (items.length == 2) {
      let year = this.monthFirst ? items[1] : items[0];
      let month = this.monthFirst ? items[0] : items[1];
      let imonth = this.months.indexOf(month);
      if ((imonth) < 0)
        imonth = parseInt(month);
      else
        imonth = imonth + 1;

      let iyear = parseInt(year);
      if (iyear < 100)
        iyear = iyear + 2000;
      this.data = {
        year: iyear,
        month: imonth
      }
      this.incr=this.getIncr(this.data.year);
    }
    this.writeValue(this.data);

  }
  selectYearMonth($event,index:number)
  {
    if (this.isyear)
    {
      $event.stopPropagation();
      this.data.year=index+this.incr;
      this.dataTxt=this.formatData(this.data);
      this.isyear=false;
      this.incr=this.getIncr(this.data.year);
    }
    else{
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    if((((index+1) < (currentMonth+1))&& currentYear==this.data.year)|| currentYear>this.data.year){
      if(this.allMonths){
        this.data.month=index+1;
      this.dataTxt=this.formatData(this.data);
      }
      return;
    }else{
    this.data.month=index+1;
    this.dataTxt=this.formatData(this.data);
    }
   
    }
  }
  showYear($event:any,show:boolean)
  {
    $event.stopPropagation();
    this.isyear=!this.isyear;
  }
  addYear($event:any,incr:number)
  {
    $event.stopPropagation(); 
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    let year=this.isyear?this.data.year+10*incr:this.data.year+incr;
    if(year < currentYear)
    {
      if(this.allMonths){
        this.isDisableBack =false;
        this.data.year=year;
        this.data.month=1;
        this.incr=this.getIncr(year);
      this.dataTxt=this.formatData(this.data);
      }else{
        this.isDisableBack =true;
      return;

      }
      
    }else{
      this.isDisableBack =false;
      this.data.year=year;
      if(year==currentYear){
        this.data.month=currentMonth+1;
      }else{
        this.data.month=1;
      }
    this.incr=this.getIncr(year);
    this.dataTxt=this.formatData(this.data);
    }
  }
  onChange = (data: Idata) => {
    this.data = data;
    this.dataTxt = this.monthFirst ? "" + data.month + this.separator + data.year :
      "" + data.year + this.separator + data.month;
      this.incr=this.getIncr(this.data.year);
  };

  getIncr(year:number):number
  {
   // console.log("*",(year-year%10)-1);
    return (year-year%10)-1;
  }
  formatData(data:Idata):string
  {
    let monthTxt=data.month<10? "0"+data.month:"" + data.month;
    return  this.monthFirst ?  monthTxt+ this.separator + data.year :
    "" + data.year + this.separator + monthTxt

  }
  // Function to call when the input is touched (when a star is clicked).
  onTouched = () => { };

  writeValue(data: Idata): void {
    this.data = data;
    this.onChange(this.data)
  }

  // Allows Angular to register a function to call when the model (rating) changes.
  // Save the function as a property to call later here.
  registerOnChange(fn: (data: Idata) => void): void {
    this.onChange = fn;
  }

  // Allows Angular to register a function to call when the input has been touched.
  // Save the function as a property to call later here.
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  // Allows Angular to disable the input.
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
