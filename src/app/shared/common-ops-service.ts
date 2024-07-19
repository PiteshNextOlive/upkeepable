import { Injectable } from '@angular/core';  
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
//import * as CryptoJS from 'crypto-js';  
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { EnumJsonTemplate, EnumListTemplate } from '../generic-type-module';
@Injectable()  
export class CommonOpsService {  
 
    public isForceFullyClosed: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    
    public RestrictNumericValuesOnly(e: any, maxSizeAllowed: number ) {
        let input;
        if(e.target.value.length==maxSizeAllowed){
            return false;
        }
        if (e.metaKey || e.ctrlKey) {
            return true;
        }
        if (e.which === 32) {
            return false;
        }
        if (e.which === 0) {
            return true;
        }
        if (e.which < 33) {
            return true;
        }
        input = String.fromCharCode(e.which);
        return !!/[\d\s]/.test(input);
    }
    
    // public encodeQueryParamsInBase64(model: any):string{
    //     return CryptoJS.AES.encrypt(JSON.stringify(model), environment.queryParmsPrivateEncryptionKey).toString();  
    // }

    // public decodeQueryParamsFromBase64ToModel(encodedText: string, callback): Observable<any>{
    //     return callback(JSON.parse(CryptoJS.AES.decrypt(encodedText, environment.queryParmsPrivateEncryptionKey).toString(CryptoJS.enc.Utf8)));
    // }
    errorHandler(error: any) {
        return throwError(
          'Something bad happened; please try again later.');
      }

    getEnumItemsByEnumName(enumListTemplateLists: EnumListTemplate[], selectListTypeCode: string): EnumJsonTemplate[]{
        var enumListTemplate = enumListTemplateLists.filter(object => {
            return object['selectListTypeCode'] == selectListTypeCode;
            });
            if(enumListTemplate!=undefined && enumListTemplate.length>0){
              return enumListTemplate[0].enumJsonTemplateItems;
            } 

        var emptyEnumListTemplate: EnumJsonTemplate[] =[];
          return emptyEnumListTemplate;
    }
    prepareCommaSeparatedCheckBoxValues(event:any, itemArray:any):[]{
        if(itemArray==null){
            itemArray=[];
        }
        if(event.target.checked){
            itemArray.push(event.target.value)
        }
        else{
            itemArray = itemArray.filter((item: number)=> item != event.target.value);
        }
        return itemArray;
    }

    markCheckboxChecked(value:number, itemArray:any):boolean{
        if(itemArray!=null){
            return itemArray.some(function(el){ return (el).toString() === (value).toString()});
        }
        return false;
    }

    public trimFormControlOnFocusOut(e: any, fb: UntypedFormGroup, formControlName: string) {
        fb.controls[formControlName].patchValue(e.target.value.replace(/ {2,}/g, ' ').trim());
    }
    public trimOnFocusOut(e: any) {
      //  console.log(e.target.value)
        e.target.value= e.target.value.trim();
    }



}  
