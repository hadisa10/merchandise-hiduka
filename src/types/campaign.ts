import * as Realm from "realm-web";


export interface IClient {
    _id: string;
    owner_id: string;
    name: string;
    active: boolean;
    client_icon: string;
    client_plan: number;
    createdAt: Date;
    updatedAt: Date;

}

export interface IDraftClient {
    _id: Realm.BSON.ObjectId;
    name: string;
    owner_id: string;
    active: boolean;
    client_icon: string;
    client_plan: number;
}


export interface IClientChange {
    fullDocument: IClient;
}

export interface IGraphqlResponse {
    clients: IClient[];
}
export interface IClientActions {
    saveClient: (draftClient: IDraftClient) => Promise<void>;
    toggleClientStatus: (client: IClient) => Promise<void>;
    deleteClient: (client: IClient) => Promise<void>;
}

export interface IClientHook extends IClientActions {
    loading: boolean;
    clients: IClient[];
}

export interface IDraftClientsHook extends IDraftClientActions {
    draftClients: IDraftClient[];

}
export interface IDraftClientActions {
    createDraftClient: () => void;
    setDraftClientName: (draft: IDraftClient, summary: string) => void;
    deleteDraftClient: (draft: IDraftClient) => void;
}

export interface IClientItem {
    client: IClient;
    clientActions: IClientActions;
}

export interface IDraftClientItem {
    draftClient: IDraftClient;
    clientActions: IClientActions;
    draftClientActions: IDraftClientActions;
}