import { IDashboardMetrics } from "./realm/realm-types";

export interface IDashboardMetricChange {
    fullDocument: IDashboardMetrics;
}

export interface IGraphqlDashboardMetricResponse {
    DashboardMetrics: IDashboardMetrics;
}

export interface IDashboardMetricHook {
    loading: boolean;
    dashboardMetrics: IDashboardMetrics | null;
}