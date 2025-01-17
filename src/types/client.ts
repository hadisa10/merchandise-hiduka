import * as Realm from 'realm-web';

// export interface IClient {
//     _id: string;
//     creator_id: string;
//     name: string;
//     active: boolean;
//     client_icon: string;
//     client_plan: number;
//     createdAt: Date;
//     updatedAt: Date;
// }

interface IUser {
  _id: Realm.BSON.ObjectId;
  name: string;
  email: string;
  avatarUrl?: string; // Optional because it's not listed in the "required" array
}

interface IClientUser {
  _id?: Realm.BSON.ObjectId;
  name?: string;
  email: string;
  verified: boolean;
  dateAdded: Date;
  avatarUrl?: string; // Optional because it's not listed in the "required" array
}

export interface IClient {
  // __typename?: string,
  _id: Realm.BSON.ObjectId;
  active: boolean;
  creator: IUser;
  users: string[];
  name: string;
  createdAt: Date;
  updatedAt: Date;
  type: 'admin' | 'agency' | 'single-client' | 'nested-client';
  parent: Realm.BSON.ObjectId;
  children: Array<Realm.BSON.ObjectId>;
  client_icon: string;
  client_plan: string;
}

export interface IUpdatedClient {
  // __typename?: string,
  _id: Realm.BSON.ObjectId;
  active: boolean;
  creator: IUser;
  users: string[];
  name: string;
  createdAt: Date;
  updatedAt: Date;
  children: Array<Realm.BSON.ObjectId>;
  type: 'admin' | 'agency' | 'single-client' | 'nested-client';
  parent: Realm.BSON.ObjectId;
  client_icon: string;
  client_plan: string;
  nestedClients: IUpdatedClient[];
}

export interface IGetClientsResponse {
  nestedClients: Array<IClient>;
  clients: Array<IUpdatedClient>;
}
export interface IDraftClient {
  _id: Realm.BSON.ObjectId;
  name: string;
  users: IClientUser[];
  creator: IUser;
  active: boolean;
  client_icon: string;
  client_plan: string;
}

export interface IClientChange {
  fullDocument: IClient;
}

export interface IGraphqlResponse {
  clients: IClient[];
}
export interface IGraphqlClientResponse {
  client: IClient;
}
export interface IClientActions {
  saveClient: (draftClient: IDraftClient) => Promise<void>;
  toggleClientStatus: (client: IClient) => Promise<void>;
  deleteClient: (client: IClient) => Promise<void>;
  getClient: (id: string) => Promise<IClient>;
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

export enum ERole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  CLIENT = 'client',
  PROJECT_MANAGER = 'project-manager',
  TEAM_LEAD = 'team-lead',
  AGENT = 'agent',
}
