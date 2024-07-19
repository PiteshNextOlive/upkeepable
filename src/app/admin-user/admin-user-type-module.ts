import { IApplicationUser } from "../account/account-type-module"

// export interface IRealEstateAgentMessage {
//   realEstateAgentMessageId: number,
//   month: number,
//   year: number,
//   subject: string,
//   shortDescription: string,
//   messageText: string,
//   messageImage: string,
//   userRefId: number,
//   lastModifiedOn: Date,
//   realEstateAgentMessageLinks: IRealEstateAgentMessageLinks[]
//   applicationUser: IApplicationUser,
//   optionalLinks:string[]
//   selectedMonthCommaSeparated:string
//   selectedYearCommaSeparated:string
//   maxRows: number;
// }

export type State = { id: number; name: string };

export class DropDownContent {
    value: number;
    text: string;
    selected: boolean
  }


  export interface IAdminProfileViewModel{
    userRefId: number,
    firstName: string,
    lastName: string,
    email: string,
    currPassword: string,
    newPassword: string,
    confirmPassword: string
  };