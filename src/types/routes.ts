import { IRoute } from "./realm/realm-types";

export interface IRouteChange {
    fullDocument: IRoute;
}

export interface IGraphqlRoutesResponse {
    routes: IRoute[];
}
export interface IGraphqlSearchRoutesResponse {
    SearchRoutes: IRoute[];
}

export interface IRouteActions {
    saveRoute: (draftRoute: IRoute) => Promise<void>;
    searchRoute: (searchQuery: string) => Promise<IRoute[]>
}

export interface IRouteHook extends IRouteActions {
    loading: boolean;
    routes: IRoute[];
}

export interface IDraftRouteHook extends IDraftRouteActions {
    draftRoutes: IRoute[];

}
export interface IDraftRouteActions {
    createRouteRoute: () => void;
    setDraftRouteName: (draft: IRoute, summary: string) => void;
}

export interface IRouteItem {
    route: IRoute;
    routeActions: IRouteActions;
}

export interface IDraftRouteItem {
    draftRoute: IRoute;
    routeActions: IRouteActions;
    draftRouteActions: IDraftRouteActions;
}