export interface IHomeVariableMainCategory{
    homeVariableMainCategoryId: number,
    homeOwnerAddressDetailType: number,
    title: string,
    iconName: string,
    lastModifiedOn: Date,
    homeVariableSubCategories: IHomeVariableSubCategory[]
};

export interface IHomeVariableSubCategory{
    homeVariableSubCategoryId: number,
    title: string,
    iconName: string,
    lastModifiedOn: Date,
    homeVariableMainCategoryRefId: number,
    homeVariableSubCategoryListItems: IHomeVariableSubCategoryListItem[],
    homeVariableSubCategoryRangeItems: IHomeVariableSubCategoryRangeItem[],
    isHiddenInRecommendationCreate: boolean
};

export interface IHomeVariableSubCategoryListItem {
    homeVariableSubCategoryListItemId: number,
    title: string,
    isDeleted: boolean,
    lastModifiedOn: Date,
    homeVariableSubCategoryRefId: number,
};

export interface IHomeVariableSubCategoryRangeItem {
    homeVariableSubCategoryRangeItemId: number,
    minRange: number,
    maxRange: number,
    isDeleted: boolean,
    lastModifiedOn: Date,
    homeVariableSubCategoryRefId: number
};
export interface IHomeVariableSubCategoryRangeItem {
    homeVariableSubCategoryRangeItemId: number,
    minRange: number,
    maxRange: number,
    isDeleted: boolean,
    lastModifiedOn: Date,
    homeVariableSubCategoryRefId: number
};

export interface IListAndRangeItemViewModel{
    homeVariableSubCategoryListItems: IHomeVariableSubCategoryListItem[]
    homeVariableSubCategoryRangeItems: IHomeVariableSubCategoryRangeItem[]
};

