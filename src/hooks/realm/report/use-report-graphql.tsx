import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  createObjectId,
  addValueAtIndex,
  convertObjectId,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { IReport } from "src/types/realm/realm-types";
import { IReportHook, IReportChange, IGraphqlReportResponse, IGraphqlReportsResponse, IGraphqlFilledReportsResponse } from "src/types/report";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useReports(lazy: boolean = true): IReportHook {
  const graphql = useCustomApolloClient();
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  console.log(errors, 'ERRORS')

  useEffect(() => {
    if (!lazy) {
      const query = gql`
        query FetchUserReports {
          reports {
            _id
            title
            template_id
            responses
            client_id
            project_id
            campaign_id
            campaign_title
            category{
              _id
              title
            }
            questions {
              _id
              text
              order
              input_type
              placeholder
              initialValue
              options
              unique
              updatedAt
              dependencies {
                questionId
                triggerValue
                operator
              }
              validation {
                required
                minLength
                maxLength
                minValue
                maxValue
                regex {
                  matches
                  message
                }
                fileTypes
              }
            }
            createdAt
            updatedAt
          }
        }
      `;
      graphql.query<IGraphqlReportsResponse>({ query })
        .then(({ data }) => {
          setReports(data.reports);
          setLoading(false);
        })
        .catch((err) => {
          setErrors(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }

  }, [graphql, lazy]);

  const reportHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "reports",
  });

  useWatch(reportHidukaCollection, {
    onInsert: (change: IReportChange) => {
      setReports((oldReport) => {
        if (loading) {
          return oldReport;
        }
        const idx = getClientIndex(oldReport, change.fullDocument) ?? oldReport.length;
        return idx === oldReport.length
          ? addValueAtIndex(oldReport, idx, change.fullDocument)
          : oldReport;
      });
    },
    onUpdate: (change: IReportChange) => {
      setReports((oldReport) => {
        if (loading) {
          return oldReport;
        }
        const idx = getClientIndex(oldReport, change.fullDocument);
        if (!idx) {
          return oldReport;
        }
        return updateValueAtIndex(oldReport, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IReportChange) => {
      setReports((oldReport) => {
        if (loading) {
          return oldReport;
        }
        const idx = getClientIndex(oldReport, change.fullDocument);
        if (!idx) {
          return oldReport;
        }
        return replaceValueAtIndex(oldReport, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setReports((oldReport) => {
        if (loading) {
          return oldReport;
        }
        if (!change.documentKey) {
          return oldReport;
        }
        const idx = getClientIndex(oldReport, { _id: change.documentKey._id });
        if (!idx) {
          return oldReport;
        }
        return idx >= 0 ? removeValueAtIndex(oldReport, idx) : oldReport;
      });
    },
  });

  const saveReport = async (draftReport: IReport): Promise<BSON.ObjectId> => {
    // draftReport.creator_id = realmApp.currentUser?.id as string;
    const dt = new Date();
    const cpReport: Omit<IReport, "_id"> = {
      ...draftReport,
      createdAt: dt,
      updatedAt: dt
    }
    try {
      const resp = await graphql.mutate<{ _id: string }>({
        mutation: gql`
            mutation SaveReport($report: ReportInsertInput!) {
              insertOneReport(data: $report) {
                _id
                title
              }
            }
          `,
        variables: { report: cpReport },
      });
      return resp.data?._id ? convertObjectId(resp.data._id) : createObjectId();

    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a Report multiple times (i.e. an existing Report has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
      throw err;
    }
  };

  const updateReport = async (report: IReport): Promise<BSON.ObjectId> => {
    try {
      const resp = await graphql.mutate<{ _id: string }>({
        mutation: gql`
          mutation UpdateProduct($id: ObjectId!, $ReportUpdateInput: ReportUpdateInput!) {
            updateOneReport(query: { _id: $id }, set: $ReportUpdateInput) {
              _id
            }
          }
        `,
        variables: {
          id: report._id,
          ReportUpdateInput: { ...report }
        },
      });
      return resp.data?._id ? convertObjectId(resp.data._id) : createObjectId();

    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a Report multiple times (i.e. an existing Report has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
      throw err;
    }
  };
  // const updateReport = async (report: IReport) => {
  //   await graphql.mutate({
  //     mutation: gql`
  //       mutation UpdateProduct($id: ObjectId!, $ReportUpdateInput: ReportUpdateInput!) {
  //         updateOneReport(query: { _id: $id }, set: $ReportUpdateInput) {
  //           _id
  //         }
  //       }
  //     `,
  //     variables: {
  //       id: report._id,
  //       ReportUpdateInput: { ...report }
  //     },
  //   });
  // };

  const getReport = async (id: string) => {
    try {
      const resp = await graphql.query<IGraphqlReportResponse>({
        query: gql`
          query FetchReport($id: ObjectId!) {
            report(query: { _id: $id }) {
                _id
                title
                template_id
                responses
                client_id
                project_id
                campaign_id
                campaign_title
                category{
                  _id
                  title
                }
                questions {
                  _id
                  text
                  order
                  input_type
                  placeholder
                  initialValue
                  options
                  unique
                  updatedAt
                  dependencies {
                    questionId
                    triggerValue
                    operator
                  }
                  validation {
                    required
                    minLength
                    maxLength
                    minValue
                    maxValue
                    regex {
                      matches
                      message
                    }
                    fileTypes
                  }
                }
                createdAt
                updatedAt
              }
          }
        `,
        variables: {
          id
        },
      });
      console.log(resp, 'RESP')
      return resp.data.report;
    } catch (error) {
      console.log(error, "REPORT FETCH ERROR")
      throw new Error("Failed to get report")
    }
  };

  const getReportAnswers = async (id: string) => {
    try {
      const resp = await graphql.query<IGraphqlFilledReportsResponse>({
        query: gql`
          query FetchAnswersReport($id: ObjectId!) {
            filledReports(query: { report_id: $id }) {
                _id
                answers {
                  question_text
                  answer
                  question_id
                  type
                }
                campaign_id
                createdAt
                report_id
                session_id
                updatedAt
                user_id
              }
          }
        `,
        variables: {
          id
        },
      });
      return resp.data.filledReports;
    } catch (error) {
      console.log(error, "REPORT FETCH ERROR")
      throw new Error("Failed to get report")
    }
  };

  const getCampaignReport = async (id: string) => {
    try {
      const resp = await graphql.query<IGraphqlReportsResponse>({
        query: gql`
          query FetchReport($id: ObjectId!) {
            reports(query: { campaign_id: $id }) {
                _id
                title
                template_id
                responses
                client_id
                project_id
                campaign_id
                campaign_title
                category{
                  _id
                  title
                }
                questions {
                  _id
                  text
                  order
                  input_type
                  placeholder
                  initialValue
                  options
                  unique
                  updatedAt
                  dependencies {
                    questionId
                    triggerValue
                    operator
                  }
                  validation {
                    required
                    minLength
                    maxLength
                    minValue
                    maxValue
                    regex {
                      matches
                      message
                    }
                    fileTypes
                  }
                }
                createdAt
                updatedAt
              }
          }
        `,
        variables: {
          id
        },
      });
      console.log(resp, 'RESP')
      return resp.data.reports;
    } catch (error) {
      console.log(error, "REPORT FETCH ERROR")
      throw new Error("Failed to get report")
    }
  };

  // const toggleReportstatus = async (Report: IReport) => {
  //   await graphql.mutate({
  //     mutation: gql`
  //       mutation ToggleReportstatus($ReportId: ObjectId!) {
  //         updateManyReports(query: { _id: $ReportId }, set: { active: ${!Report.active}, updatedAt: "${new Date().toISOString()}" }) {
  //           matchedCount
  //           modifiedCount
  //         }
  //       }
  //     `,
  //     variables: { ReportId: Report._id },
  //   });
  // };

  // const deleteReport = async (Report: IReport) => {
  //   await graphql.mutate({
  //     mutation: gql`
  //       mutation DeleteReport($ReportId: ObjectId!) {
  //         deleteOneReport(query: { _id: $ReportId }) {
  //           _id
  //         }
  //       }
  //     `,
  //     variables: { ReportId: Report._id },
  //   });
  // };

  return {
    loading,
    reports,
    saveReport,
    updateReport,
    getReport,
    getCampaignReport,
    getReportAnswers
    // toggleReportstatus,
    // deleteReport,
  };
}
