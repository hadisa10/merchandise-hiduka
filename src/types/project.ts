import * as Realm from "realm-web";


export interface IProject {
    _id: string;
    creator_id: string;
    client_id: string;
    campaigns: string;
    reports: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IDraftProject {
    _id: Realm.BSON.ObjectId;
    creator_id: string;
    client_id: string;
    campaigns: string;
    reports: number;
    createdAt: Date;
    updatedAt: Date;
}


export interface IProjectChange {
    fullDocument: IProject;
}

export interface IGraphqlResponse {
    projects: IProject[];
}
export interface IProjectActions {
    saveProject: (draftProject: IDraftProject) => Promise<void>;
    toggleProjectStatus: (project: IProject) => Promise<void>;
    deleteProject: (project: IProject) => Promise<void>;
}

export interface IProjectHook extends IProjectActions {
    loading: boolean;
    projects: IProject[];
}

export interface IDraftProjectHook extends IDraftProjectActions {
    draftProjects: IDraftProject[];

}
export interface IDraftProjectActions {
    createDraftProject: () => void;
    setDraftProjectName: (draft: IDraftProject, name: string) => void;
    deleteDraftProject: (draft: IDraftProject) => void;
}

export interface IProjectItem {
    project: IProject;
    projectActions: IProjectActions;
}

export interface IDraftProjectItem {
    draftProject: IDraftProject;
    projectActions: IProjectActions;
    draftProjectActions: IDraftProjectActions;
}