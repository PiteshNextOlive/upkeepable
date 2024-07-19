export interface ISetPassword {
  userUniqueIdentityString: string,
  password: string,
  repeatPassword: string,
  dateString: string,
};
export interface IDirectLoginViewModel {
  userUniqueIdentityString: string,
};
export interface IResetPassword {
  userId: number,
  oldPassword: string,
  password: string,
  repeatPassword: string,
};


export interface ReplyToEmailModal {
  To: string;
  Subject: string;
  Message: any;
};

export interface LoginTypeModel {
  userName: string;
  password: string;
  recaptcha: any;
  forgetType: string;
};

export interface UserJwtDecodedInfoNotification{
  IsNotiUserId:string,
  UserId:string
}

export interface UserJwtDecodedInfo {
  UserId: string,
  EmailId: string,
  IsAgree:string,
  RoleId: string,
  RoleName: string,
  RoleDescription: string,
  FullName: string,
  Phone: string,
  UserImage: string,
  HomeOwnerAddressId:number,
  aud: string,
  exp: string,
  iss: string
}

export interface IApplicationUser
{
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    phone:string,
    isEmailConfirmed: boolean,
    password: string,
    userImage: string,
    isActive: string,
    isDeleted: string,
    userUniqueIdentityString: string,
    applicationUserSocialNetworkLinks: IApplicationUserSocialNetworkLink[]
}

export interface IResetPasswordResponseViewModel{
  isCompleted: boolean,
  messageText:string
}


export interface IApplicationUserSocialNetworkLink{
        applicationUserSocialNetworkLinkId: number,
        applicationUserRefId: number,
        socialNetworkLinkType: number,
        websiteLink: string,
        websiteLogoImageUrl: string
    }
    export interface ContacTypeModel {
      firstName: string;
      lastName: string;
      email: string;
      message: string;
    };
    