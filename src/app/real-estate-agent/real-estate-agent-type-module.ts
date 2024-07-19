import { IApplicationUser } from "../account/account-type-module"

export interface IRealEstateAgentMessage {
  realEstateAgentMessageId: number,
  month: number,
  year: number,
  subject: string,
  shortDescription: string,
  messageText: string,
  messageImage: string,
  userRefId: number,
  lastModifiedOn: Date,
  realEstateAgentMessageLinks: IRealEstateAgentMessageLinks[]
  applicationUser: IApplicationUser,
  optionalLinks:string[]
  selectedMonthCommaSeparated:string
  selectedYearCommaSeparated:string
  maxRows: number;
}
export interface IRealEstateAgentMessageLinks {
  realEstateAgentMessageLinkId: number,
  linkUrl: string,
  realEstateAgentMessageRefId: number
}

export interface IRealEstateAgentProfileViewModel{
  isNotficationOn: number,
  userRefId: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  userImage: string,
  userImageBase64: string,
  socialMedia_FacebookUrl: string,
  socialMedia_TweeterUrl: string,
  socialMedia_InstagramUrl: string,
  socialMedia_YoutubeUrl: string,
  isActive: boolean,
  isDeleted: boolean,
  isEmailConfirmed: boolean,
  userStatusType: number,
  isPoused: number,
  pausedMessage: string,
  zipCode: string,
  cityName: string,
  stateCode: string,
  address:string
};
export interface IRealEstateAgentViewModel{
  isNotficationOn: number,
  userRefId: number,
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  userImage: string,
  userImageBase64: string,
  realEstateAgentMessageInfo: IRealEstateAgentMessage,
  realEstateAgentMessageInfo1: IRealEstateAgentMessage,
  socialMedia_FacebookUrl: string,
  socialMedia_TweeterUrl: string,
  socialMedia_InstagramUrl: string,
  socialMedia_YoutubeUrl: string,
  isActive: boolean,
  isDeleted: boolean,
  isEmailConfirmed: boolean,
  userStatusType: number,
  isPoused: number,
  pausedMessage: string,
  zipCode: string,
  cityName: string,
  stateCode: string,
  address:string
};

export interface IRealEstateAgentRegistrationViewModel{
  firstName: string,
  lastName: string,
  phone: string,
  email: string,
  address: string,
  zipCode:  string,
  cityName:  string,
  stateCode: string,
};


export interface IRealEstateAgentWelcomeMessage{
  realEstateAgentWelcomeMessageId : number,
  messageText: string,
  lastModifiedOn: Date,
  userRefId: number
}
export interface IRealEstateAgentClientViewModel{
  userId: number,
  maxRows: number,
  name:string,
  homeOwnerAddressId:string,
  address: string,
  email: string
  lastModifiedDate: string,
  joinedOn: string
}

export interface IRealEstateUserViewModal{
  userId: string,
  name: string
}

export interface IReaViewModel{
  userId: number,
  maxRows: number,
  name:string,
  email: string
  lastModifiedDate: string,
  totalHOs: number,
  joinedOn: string,
  isEmailConfirmed: boolean,
  isActive: boolean,
  isDeleted: boolean
  userStatusType: boolean
}

export interface IReaNewUserResponseViewModel{
  isSuccefullyCreated: boolean,
  message: string,
  userConfirmationUrl: string,
  hasException: boolean,
  isDuplicateEmail: boolean,
  id: number
  profileImage: string
}

export interface IRealEstateAgentMessageViewModel{
  realEstateAgentMessageId: number,
  month: number,
  year: number,
  subject: string,
  shortDescription: string,
  maxRows: number
}

export interface IMessageMonthWiseFilter{
  monthStartJson: any
}