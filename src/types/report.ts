import { IReport } from "./realm/realm-types";

export interface IReportChange {
    fullDocument: IReport;
}

export interface IGraphqlReportResponse {
    reports: IReport[];
}
export interface IReportActions {
    saveReport: (draftReport: IReport) => Promise<void>;
    updateReport: (report: IReport) => Promise<void>;
    // toggleReportStatus: (Report: IReport) => Promise<void>;
    // deleteReport: (Report: IReport) => Promise<void>;
}

export interface IReportHook extends IReportActions {
    loading: boolean;
    reports: IReport[];
}

export interface IDraftReportHook extends IDraftReportActions {
    draftReports: IReport[];

}
export interface IDraftReportActions {
    createDraftReport: () => void;
    setDraftReportName: (draft: IReport, summary: string) => void;
}

export interface IReportItem {
    report: IReport;
    reportActions: IReportActions;
}

export interface IDraftReportItem {
    draftReport: IReport;
    reportActions: IReportActions;
    draftReportActions: IDraftReportActions;
}


// ====================================
export type IReportTableFilterValue = string | string[];

export type IReportTableFilters = {
    type: string[];
};