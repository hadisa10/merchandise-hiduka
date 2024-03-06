import { ICampaignUser } from "./user_realm";
import { IUserRouteProductItem } from "./user-routes";
import { ICheckin, ICampaign } from "./realm/realm-types";

export interface ICampaignChange {
    fullDocument: ICampaign;
}

export interface IGraphqlResponse {
    UserCampaigns: ICampaign[];
}

export interface IGraphqlCampaignUserResponse {
    CampaignUsers: ICampaignUser[];
}

export interface IGraphqlCheckinResponse {
    UserCampaignCheckins: ICheckin[];
}


export interface ICampaignActions {
    saveCampaign: (draftCampaign: ICampaign) => Promise<void>;
    updateCampaign: (campaign: ICampaign) => Promise<void>;
    getCampaignUsers: (id: string) => Promise<ICampaignUser[]>;
    getCampaignUserCheckins: (campaignId: string, startDate: string, endDate: string, userId?: string) => Promise<ICheckin[]>
    // toggleCampaignStatus: (campaign: ICampaign) => Promise<void>;
    // deleteCampaign: (campaign: ICampaign) => Promise<void>;
}

export interface ICampaignHook extends ICampaignActions {
    loading: boolean;
    campaigns: ICampaign[];
}

export interface IDraftCampaignHook extends IDraftCampaignActions {
    draftCampaigns: ICampaign[];

}
export interface IDraftCampaignActions {
    createDraftCampaign: () => void;
    setDraftCampaigntName: (draft: ICampaign, summary: string) => void;
}

export interface ICampaignItem {
    campaign: ICampaign;
    campaignActions: ICampaignActions;
}

export interface IDraftCampaignItem {
    draftCampaign: ICampaign;
    campaignActions: ICampaignActions;
    draftCampaignActions: IDraftCampaignActions;
}

// ============================================

export type ICampaignTableFilterValue = string | string[];

export type ICampaignTableFilters = {
  type: string[];
};

export type CountryData = {
    lnglat: number[];
    address: string;
    phoneNumber: string;
    products: IUserRouteProductItem[]
};