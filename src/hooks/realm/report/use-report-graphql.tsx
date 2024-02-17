import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";
import { IGraphqlReportResponse, IReportChange, IReportHook } from "src/types/report";
import { IReport } from "src/types/realm/realm-types";

const { dataSourceName } = atlasConfig;


export function useReports(lazy: boolean = true): IReportHook {
  const graphql = useCustomApolloClient();
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    if (lazy) {
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
      graphql.query<IGraphqlReportResponse>({ query })
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

  const saveReport = async (draftReport: IReport) => {
    // draftReport.creator_id = realmApp.currentUser?.id as string;
    const dt = new Date();
    const cpReport: Omit<IReport, "_id"> = {
      ...draftReport,
      createdAt: dt,
      updatedAt: dt
    }
    try {
      await graphql.mutate({
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
  const updateReport = async (report: IReport) => {
    await graphql.mutate({
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
    updateReport
    // toggleReportstatus,
    // deleteReport,
  };
}
