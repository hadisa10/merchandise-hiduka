import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import { IDashboardMetrics } from "src/types/realm/realm-types";
import { IDashboardMetricHook, IGraphqlDashboardMetricResponse } from "src/types/dashboard";

import { useCustomApolloClient } from "../use-apollo-client";


export function useDashboard(lazy: boolean = true): IDashboardMetricHook {
  const graphql = useCustomApolloClient();
  const [dashboardMetrics, setDashboardMetrics] = useState<IDashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lazy) {
      const query = gql`
      query FetchDashboardMetrics {
        DashboardMetrics{
          totalCampaigns
          campaignsByType{
            type
            count
          }
          totalCheckInsToday
          averageCheckInDuration
          
          
        }
      }
    `;
      graphql.query<IGraphqlDashboardMetricResponse>({ query }).then(({ data }) => {
        console.log(data, 'DATA')
        setDashboardMetrics(data.DashboardMetrics);
        setLoading(false);
      }).catch(e => console.error(e, 'ERROR'))
      .finally(() => setLoading(false))
    }
  }, [graphql, lazy]);

  return {
    loading,
    dashboardMetrics
  };
}
