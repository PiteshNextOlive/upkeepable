import { AbstractControl, UntypedFormArray, UntypedFormGroup } from "@angular/forms";

export type GenericResponseTemplateModel<T> = {
  responseDataModel: T;
  hasError: boolean,
  errorDesc: string
};
export type FormControls<T> = {
  [key in keyof T]: T[key] extends TForm<any> | UntypedFormArray // If control value has type of TForm (nested form) or FormArray
  ? T[key] // Use type that we define in our FormModel
  : Omit<AbstractControl, 'value'> & { value: T[key] } // Or use custom AbstractControl with typed value
};

export type TForm<T> = UntypedFormGroup & {
  controls: FormControls<T>;
};

export type GenericFormModel<T> = {
  formModel: T;
  enumListTemplateLists: EnumListTemplate[];
};

export type EnumListTemplate = {
  selectListTypeCode: string;
  enumJsonTemplateItems: EnumJsonTemplate[]
};

export type EnumJsonTemplate = {
  value: number;
  code: string;
  description: string;
  isEnabled: boolean
}
export type GenericServiceResultTemplate = {
  customeValidationResult: CustomeValidationResult;
  hasException: boolean;
  exceptions:any;
}
export type CustomeValidationResult = {
  isValid: boolean;
  customeValidationErrorList: any[];
  validationErrorMessages: string;
}

export interface IDataTableParamsViewModel{
  searchCode: string,
  pageNo: number,
  pageSize: number,
  sortColumn: string,
  searchColumn: string,
  sortColumn1: string,
  sortOrder: string,
  userId: number,
  filterArray: string,
  boolFlag1: number,
  month:number,
  year: number,
  tabValue: number
};

export interface IDataTableParamsViewModel1{
  searchCode: string,
  pageNo: number,
  pageSize: number,
  sortColumn: string,
  searchColumn: string,
  sortColumn1: string,
  sortOrder: string,
  isload:number,
  userId: number,
  filterArray: string,
  boolFlag1: number,
  month:number,
  year: number,
  tabValue: number
};


export interface IState{
  stateId: number,
  stateTitle: string,
  stateCode: string
};

export interface INotification{
  notificationId: number,
  notificationTitle: string,
  notificationType: number,
  notificationStatusType: number,
  createdOn: Date,
  createdOnFormatted: string
};

export interface ISponsorRegResponseViewModel{
  isSuccefullyCreated: boolean,
  message: string,
  userConfirmationUrl: string,
  hasException: boolean,
  isDuplicateEmail: boolean,
  id: number
  profileImage: string
}

export interface ISponsorRegisterViewModel{
  isNotficationOn: number,
  userRefId: number,
  FirstName: string,
  LastName: string,
  Email : string,
  Phone : string,
  IsActive: boolean,
  isDeleted: boolean,
  isEmailConfirmed: boolean, 
  ZipCode: string,
  CityName: string,
  StateCode: string,
  Address:string
  Passsword:string,
  ConfirmPasssword:string,
  userUniqueIdentityString: string,
};
