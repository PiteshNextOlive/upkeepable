import { Data } from "@angular/router"
import { IApplicationUser } from "../account/account-type-module"
import { IArticle } from "../article/recommendation/article-type-module"
import { IFooterLink } from "../footer-link/footer-link-type-module"
import { IRealEstateAgentMessage } from "../real-estate-agent/real-estate-agent-type-module"

export interface IHomeAddressGeneralDetail {
  homeAddressGeneralDetailId: number,
  homeType: number,
  homeAge_Year: number,
  homeAge_Month: number,
  homeTotalArea_SqFt: number,
  floorsCount: number,
  homeSidingType: number,
  isGarage: number,
  garageSize: number,
  lastModifiedOn: Date,
  floorTypesArray: [],
  homeOwnerAddressAttributeRefId: number
};


export interface IHomeAddressHeatingDetail {
  homeAddressHeatingDetailId: number,
  dontHaveHeatingDetail: number,
   thermostatTemperature: number,
  // heatingSystemType: number,
  // age_Year: number,
  // age_Month: number,

  heatingDetailParms: IHomeAddressHeatingDetailParms[],

  // heatingSystemUsageFrequencyType: number,
  // areaTypeArray: []
  lastModifiedOn: Date,
  homeOwnerAddressAttributeRefId: number
};

export interface IHomeAddressHeatingDetailParms {
  heatingSystemType: number,
  thermostatTemperature: number,
  age_Year: number,
  age_Month: number,
};


export interface IHomeAddressCoolingDetail {

  homeAddressCoolingDetailId: number,
  thermostatTemperature: number,
  // coolingSystemType: number
  // age_Year: number,
  // age_Month: number,
  // coolingSystemUsageFrequencyType: number,
  // areaTypeArray: []

  dontHaveDetail: number,
  coolingDetailParms: IHomeAddressCoolingDetailParms[],
  lastModifiedOn: Date,
  homeOwnerAddressAttributeRefId: number
};

export interface IHomeAddressCoolingDetailParms {
  coolingSystemUsageFrequencyType: number,
  coolingSystemType: number,
  age_Year: number,
  age_Month: number,
  thermostatTemperature: number
};

export interface IHomeAddressWaterTreatmentDetail {
  homeAddressWaterTreatmentDetailId: number,
  waterTreatmentHeatingType: number,
  heatingTemperature: number,
  isHeatingTemperatureKnown: number,
  waterTreatmentFilterType: number,
  filterAge: number,
  isFilterAgeKnown: number,
  waterTreatmentSoftenerType: number,
  areaTypeArray: []
  lastModifiedOn: Date,
  homeOwnerAddressAttributeRefId: number
};

export interface IHomeAddressOutsideDetail {
  homeAddressOutsideDetailId: number,
  hasLawn: any,
  grassType: any,
  hasFense: any,
  fenseType: any,
  hasSpinklers: any,
  hasTrees: any,
  treeType: any,
  hasShrubs: any,
  shrubsType: any,
  hasPool: any,
  poolType: any,
  hasHotTub: any,
  hotTubType: any,
  lastModifiedOn: Date,
  homeOwnerAddressAttributeRefId: number
};

export interface IHomeAddressApplianceDetail {
  homeAddressApplianceDetailId: number,
  hasSmartLight: any,
  hasWashingMachine: any,
  washingMachineType: any,
  hasDryer: any,
  dryerType: any,
  hasRangeHood: any,
  rangeHoodType: any,
  hasDishwasher: any,
  dishwasherType: any,
  hasOven: any,
  ovenType: any,
  hasStove: any,
  stoveType: any,
  hasMicrowave: any,
  microwaveTypeEnum: any,
  lastModifiedOn: Date,
  homeOwnerAddressAttributeRefId: number,
  smartLightTypeArray: []
};

export interface IHomeOwnerAddressAttribute {
  homeOwnerAddressAttributeId: number,
  homeOwnerAddressDetailType: number,
  homeOwnerAddressDetailStatusType: number,
  createdOn: Date,
  lastModifiedOn: Date,
  homeOwnerAddressRefId: number,
  homeOwnerAddress: IHomeOwnerAddress,

  homeAddressGeneralDetails: IHomeAddressGeneralDetail[],
  homeAddressHeatingDetails: IHomeAddressHeatingDetail[],
  homeAddressCoolingDetails: IHomeAddressCoolingDetail[],
  homeAddressWaterTreatmentDetails: IHomeAddressWaterTreatmentDetail[],
  homeAddressOutsideDetails: IHomeAddressOutsideDetail[],
  homeAddressApplianceDetails: IHomeAddressApplianceDetail[]
};

export interface IHomeOwnerAddress {
  homeOwnerAddressId: number,
  address: string,
  zipCode: string,
  isNotficationOn: number,
  homeProfileImage: string,
  userRefId: number,
  cityName: string,
  applicationUser: IApplicationUser
};


export interface IHomeOwnerProfileViewModel{
  homeOwnerAddressId: number,
  address: string,
  zipCode: string,
  homeType: number,
  isNotficationOn: number,
  homeProfileImage: string,
  homeProfileImageBase64: string,
  userRefId: number,
  cityName: string,
  stateCode: string,
  firstName: string,
  lastName: string,
  email: string,
  userImage: string,
  userImageBase64: string,
  realEstateAgentUserRefId: number,
  reaUser: any,
  isShareable:boolean
};
export interface IHomeOwnerPauseViewModel{
  userId: number,
  pauseMessage: string,
};

export interface INewEntry{
  homeOwnerEntryId: number,
  title: string,
  descriptionText: string,
  imageFile: string[],
  imageFileBase64: string,
  rememberMeType: number,
  rememberMe: number,
  createdOn: Date,
  startOn: Date,
  lastModifiedOn: Date,
  homeOwnerAddressRefId: number,
  startedOn: string,
  nextOn: Date,
  nextOnReminder: string,
  nextOnReminder2: string,
  nextOnReminder1: number,
  homeOwnerEntryImages: IHomeOwnerEntryImagesViewModel[],
  recommendationRefId:number
};
export interface IHomeOwnerEntryImagesViewModel{
  imageFileBase64: string, 
}

export interface IRecommendation{
  recommendationId: number,
  recommendationTitle: string,
  descriptionText: string,
  imageFile: string,
  imageFileBase64: string,
  iconFile: string,
  recommendationStausType: number,
  recommendationCategoryType: number,
  createdOn: Date,
  lastModifiedOn: Date,
  homeAddressRecommendationId: number,
  homeAddressRecommendationStausType: number,
  recommendationLinks:IRecommendationLink[]
  maxRows: number,
  joinedOn: string,

  optionalLinks: [],
  optionalLinkText: string,
  recommendationFrequencyType: number,
  startDate: Date,
  lastSentOn: Date,
  startDateJson: string,
  membershipPlanType: number

  variables: string,

  homeAge:number,
  homeAgeMax:number,

  homeArea:number,
  homeAreaMax:number,
  
  floorsCount:number,
  floorsCountMax:number,

  isGarage: number
  selectedSubCateListIds:[],

  heatSourceAge: number,
  heatSourceAgeMax: number,

  coolingTemprature: number,
  coolingTempratureMax: number,

  heatingTemprature: number,
  heatingTempratureMax: number,


  coolingSourceAge: number,
  coolingSourceAgeMax: number,

  waterTeat_FilterAge: number,
  waterTeat_FilterAgeMax: number,

  waterTeat_Temprature: number,
  waterTeat_TempratureMax: number,

  waterTeat_IsSoftener: number,

  homeOutside_IsLawn: number,
  homeOutside_IsFence: number,
  homeOutside_IsSprinklers: number,
  homeOutside_IsTree: number,
  homeOutside_IsShrubs: number,
  homeOutside_IsPool: number,
  homeOutside_IsHotTub: number

  homeAppliance_IsSmartLight: number,
  homeAppliance_IsWashingMachine: number,
  homeAppliance_IsDryer: number,
  homeAppliance_IsRangeHood: number,
  homeAppliance_IsDishwasher: number,
  homeAppliance_IsOven: number,
  homeAppliance_IsStove: number,
  homeAppliance_IsMicrowave: number,
  homeRecommendationNotes:IHomeAddressRecommendationNoteDetailViewModel
};


// homeAge_Month: number,
//   homeAge_Year: number,
//   homeTotalArea_SqFt: number,
//   floorsCount: number,
//   isGarage: number,

//   heat_Month: number,
//   heat_Year: number
export interface IRecommendationLink{
  rcommendationLinkId: number,
  linkTitle: string,
  linkUrl: string
};

export interface IHomeAddressIndexPageAdditionalInfoViewModel{
  homeProfileImageBase64: string,
  fullAddress:string,
  homeOwnerName: string,
  homeOwnerFullName: string,
  homeAddressRecommendationDetailList:IHomeAddressRecommendationDetailViewModel[],
  articles: IArticle[],
  footerLinks: IFooterLink[],
  realEstateAgentMessageInfo: IRealEstateAgentMessage,
  realEstateAgentProfileImageBase64: string,
  realEstateAgentMessageImageBase64: string,
  userStatusType: string
};

export interface IHomeAddressRecommendationDetailViewModel{
  recomendationForYear: number,
  recomendationForMonth: number,
  recomendationForMonthName: string,
  recommendationRefId: number,
  totalRecommendations: number,
  isFirst: boolean,
  isLast : boolean,
  recommendations: IRecommendation[]
};

export interface IHomeAddressRecommendationNoteDetailViewModel{
  descriptionText: string,
  homeOwnerEntryId: number,
  recommendationNotesId: number,
  recommendationRefId: number,
  startOn:string,
  homeOwnerEntryImages: IHomeOwnerEntryImagesViewModel[]
};

export interface IHomeOwnerNewUserResponseViewModel{
  isSuccefullyCreated: boolean, 
  message: string,
  userConfirmationUrl: string,
  hasException: boolean,
  isDuplicateEmail: boolean,
  id: number
  homeProfileImage: string,
  homeOwnerAddressId: number
};

export interface IHomeOwnerViewModel{
  userId: number,
  maxRows: number,
  name:string,
  homeOwnerAddressId:string,
  address: string,
  email: string
  lastModifiedDate: string,
  joinedOn: string,
  reaName: string,
  isEmailConfirmed: boolean,
  isActive: boolean,
  isDeleted: boolean
  userStatusType: boolean
}
export interface IPriceEntry{
  Price_amount: number
}