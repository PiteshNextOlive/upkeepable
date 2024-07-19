export interface IArticle {
  articleId: number,
  articleTitle: string,
  shortDescriptionText: string,
  descriptionText: string,
  imageFile: string,
  imageFileBase64: string,
  articleStausType: number,
  monthsCodes: string,
  createdOn: Date,
  lastModifiedOn: Date,
  articleLinks: IArticleLink[],
  optionalLinks: [],
  maxRows: number
  createdOnText: string
  optionalLinkText:string,
  maxViewEachMonth: number,
  homeOwnerAddressDetailType: number,
  monthStartJson: any,
  monthEndJson: any, 
  monthStart: string,
  monthEnd: string 
  endDate: Date,
  startDate: Date
  };

  export interface IArticleLink{
    articleLinkId: string,
    linkTitle: string,
    linkUrl: string,
    articleRefId: string,
    createdOn: Date,
    lastModifiedOn: Date
  };

  
export interface ICoupon{
  couponId: number,
  couponCode: any,
  couponValue: number,
  couponPeriod: number,
  couponStatus: boolean,
  couponUse: number,
  descriptionText: string,
  createdOn: Date,
  lastModifiedOn: Date,
  maxRows: number,
  startDate: string,
  couponExpires: string,
};
export interface ICouponExport{
  couponCode: any,
  couponValue: number,
  couponPeriod: number,
  couponStatus: boolean,
  couponUse: number,
  descriptionText: string
};