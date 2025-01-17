import { BSON } from "realm-web";
import { FieldErrors } from "react-hook-form";

import { IReport, IFilledReport, IReportQuestion, IQuestionDependency, IReportQuestionValidation } from "./realm/realm-types";

export interface IReportChange {
    fullDocument: IReport;
}

export interface IGraphqlReportsResponse {
    reports: IReport[];
}

export interface IGraphqlReportResponse {
    report: IReport;
}

export interface IGraphqlFilledReportsResponse {
    GetFilledReports: IFilledReport[];
}
export interface IReportActions {
    saveReport: (draftReport: IReport) => Promise<BSON.ObjectId>;
    updateReport: (report: IReport) => Promise<BSON.ObjectId>;
    getReport: (id: string) => Promise<IReport>;
    getReportAnswers: (id: string) => Promise<IFilledReport[]>;
    getCampaignReport: (id: string) => Promise<IReport[]>;

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
export type ActualInputType = 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'email' | 'file' | 'range' | 'geopoint' | 'image' | 'url';

export type QuestionError = FieldErrors<IReportQuestion>;

export interface IReportQuestionActions {
    handleAddValidation: (questionIndex: number, newValidation: Partial<IReportQuestionValidation>) => void;
    handleChangeInputType: (questionIndex: number, newInputType: ActualInputType) => void;
    handleAddDependency: (questionIndex: number, newDependency: IQuestionDependency) => void;
    handleChangeQuestionText: (questionIndex: number, text: string) => void;
    handleChangeQuestionRequired: (questionIndex: number) => void;
    handleChangeQuestionMaxValue: (questionIndex: number, text: number) => void;
    handleChangeQuestionMinValue: (questionIndex: number, text: number) => void;
    handleChangeQuestionRegexMatches: (questionIndex: number, text: string) => void;
    handleChangeQuestionRegexMessage: (questionIndex: number, text: string) => void;
    handleChangeQuestionMaxLength: (questionIndex: number, text: number) => void;
    handleChangeQuestionMinLength: (questionIndex: number, text: number) => void;
    handleChangeQuestionUnique: (questionIndex: number) => void;
    handleChangeAddQuestionProducts: (questionIndex: number, products: string[]) => void;
    handleRemoveQuestion: (index: number) => void;
    handleRemoveValidation: (questionIndex: number, validationKey: keyof IReportQuestionValidation) => void;
    // You can add more actions here as needed
}