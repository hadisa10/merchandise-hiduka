import { BSON } from "realm-web";
import { FieldErrors } from "react-hook-form";

import { IReport, IReportQuestions } from "./realm/realm-types";

export interface IReportChange {
    fullDocument: IReport;
}

export interface IGraphqlReportsResponse {
    reports: IReport[];
}

export interface IGraphqlReportResponse {
    report: IReport;
}
export interface IReportActions {
    saveReport: (draftReport: IReport) => Promise<BSON.ObjectId>;
    updateReport: (report: IReport) => Promise<BSON.ObjectId>;
    getReport: (id: string) => Promise<IReport>;
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

// Extend the union type to include 'range' and 'url'
export type ActualInputType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'file' | 'password' | 'range' | 'url';

export type QuestionError = FieldErrors<IReportQuestions>;

