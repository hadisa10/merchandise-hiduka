import * as Realm from "realm-web";

import { CustomFile } from "src/components/upload";

export interface IUserResponse {
    users: IUser[];
}

export type IStatus = "pending" | "active" | "rejected" | "banned"
export type IRole = "lead" | "client" | "admin" | "user" | "brand_ambassador" | "merchant"


export interface IUser {
    _id: string;
    email: string;
    isPublic: boolean;
    displayName: string;
    firstname: string;
    lastname: string;
    city: string | null;
    state: string | null;
    about: string | null;
    country: string | null;
    address: string | null;
    zipCode: string | null;
    role: IRole;
    phoneNumber: string | null;
    photoURL: CustomFile | string | null;
    isVerified: boolean;
    isRegistered: boolean;
    company: string;
    status: IStatus;
    createdAt: Date;
    updatedAt: Date;
}
export interface ICampaignUser extends IUser {
    isCheckedIn: boolean;
    checkInCount: number;
    totalSessionCount: number;
}

export interface IDraftUser {
    _id: Realm.BSON.ObjectId;
    email: string;
    isPublic: boolean;
    displayName: string;
    city: string | null;
    state: string | null;
    about: string | null;
    country: string | null;
    address: string | null;
    zipCode: string | null;
    role?: string;
    phoneNumber: string | null;
    photoURL: CustomFile | string | null;
    isVerified: boolean;
    company: string;
    status: IStatus;
    active: boolean;
}


export interface IUserChange {
    fullDocument: IUser;
}

export interface IGraphqlResponse {
    users: IUser[];
}
export interface IUserActions {
    saveUser: (draftUser: IDraftUser) => Promise<void>;
    deleteUser: (user: IUser) => Promise<void>;
    registerUser: (user: Omit<IUser, "_id" | "createdAt" | "active" | "updatedAt">) => Promise<void>;

}

export interface IUserHook extends IUserActions {
    loading: boolean;
    users: IUser[];
}

export interface IDraftUsersHook extends IDraftUserActions {
    draftUsers: IDraftUser[];

}
export interface IDraftUserActions {
    createDraftUser: () => void;
    setDraftUserName: (draft: IDraftUser, name: string) => void;
    deleteDraftUser: (draft: IDraftUser) => void;
}

export interface IUserItem {
    user: IUser;
    userActions: IUserActions;
}

export interface IDraftUserItem {
    draftUser: IDraftUser;
    userActions: IUserActions;
    draftUserActions: IDraftUserActions;
}