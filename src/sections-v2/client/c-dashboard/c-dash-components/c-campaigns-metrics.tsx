'use client';

import { isNumber } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { memo, useState, useEffect, useCallback } from 'react';

import { ButtonBase } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { getRelevantTimeInfo } from 'src/utils/helpers';

import { useRealmApp } from 'src/components/realm';
import { SystemIcon } from 'src/components/iconify';
import { useClientContext } from 'src/components/clients';
import { LoadingScreen } from 'src/components/loading-screen';

import { IChartSeries } from 'src/sections/overview/analytics/analytics-conversion-rates';
import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';

import { IAdminDashboardData, IAdminDashboardReportSummary, IClientDashboardSummaryUpdated } from 'src/types/realm/realm-types';

function ClientDashboardCampaignMetrics() {

  const realmApp = useRealmApp()

  const campaignloading = useBoolean(true)

  const campaignUpdatedloading = useBoolean(true)

  const reportsloading = useBoolean(false)

  const { client } = useClientContext();

  const showCampaignLoader = useShowLoader((campaignloading.value || reportsloading.value || campaignUpdatedloading.value), 300);

  const [dashboardCampaignMetrics, setDashboarCampaignMetrics] = useState<IAdminDashboardData | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [dashboardReportsMetrics, setDashboardReportsMetrics] = useState<IAdminDashboardReportSummary | null>(null);
  const [dashboardMetricsUpdated, setDashboardMetricsUpdated] = useState<IClientDashboardSummaryUpdated | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);


  useEffect(() => {
    if (client?._id) {
      campaignloading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.getClientDashboardMetrics(client?._id.toString())
        .then((data: IAdminDashboardData) => setDashboarCampaignMetrics(data))
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
        }
        )
        .finally(() => campaignloading.onFalse())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?._id])

  useEffect(() => {
    if (client?._id) {
      campaignloading.onTrue();
      setError(null);
      realmApp.currentUser?.functions.getClientReportDashboardMetrics(client?._id.toString()).then((data: IAdminDashboardReportSummary) => setDashboardReportsMetrics(data))
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
        }
        )
        .finally(() => campaignloading.onFalse())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?._id])

  useEffect(() => {
    if (client?._id) {
      campaignUpdatedloading.onTrue();
      setError(null);
      console.log(client._id.toString(), "ID")
      realmApp.currentUser?.functions.getClientDashboardMetricsUpdated(client?._id.toString()).then((data: IClientDashboardSummaryUpdated) => setDashboardMetricsUpdated(data))
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get dashboard updated Metrics", { variant: "error" })
        }
        )
        .finally(() => campaignUpdatedloading.onFalse())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?._id])

  const onCampaignReportRankHandler = useCallback((value: IChartSeries) => {
    console.log(value, "ACTIVE CAMPAIGN BY RANK CLICKED")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCampaignActiveCampaignRankHandler = useCallback((value: IChartSeries) => {
    console.log(value, "ACTIVE CAMPAIGN CLICKED")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {showCampaignLoader && <LoadingScreen />}

      {!showCampaignLoader &&
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ width: "100%" }}
              component={ButtonBase}
              onClick={() => console.log("TOTAL PROJECTS")}
              title="Total Projects"
              total={dashboardMetricsUpdated?.totalProjects ?? 0}
              color="info"
              icon={<SystemIcon type="project" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ width: "100%" }}
              component={ButtonBase}
              onClick={() => console.log("TOTAL ACTIVE CAMPAIGNS")}
              title="Total Active Campaigns"
              total={dashboardMetricsUpdated?.totalActiveCampaigns ?? 0}
              color="success"
              icon={<SystemIcon type="campaign" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ width: "100%" }}
              component={ButtonBase}
              onClick={() => console.log("TOTAL ACTIVE USERS")}
              title="Total Active Users"
              total={dashboardMetricsUpdated?.totalVerifiedUsers ?? 0}
              color="success"
              icon={<SystemIcon type="users" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              sx={{ width: "100%" }}
              component={ButtonBase}
              onClick={() => console.log("TOTAL Average CHECKIN DURATION")}
              title="Average checkin duration"
              total={isNumber(dashboardCampaignMetrics?.averageCheckInDuration) ? getRelevantTimeInfo(dashboardCampaignMetrics?.averageCheckInDuration) : 0}
              color="error"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'error.main' }} />} // Example icon for engagement
            />
          </Grid>
        </Grid>
      }
      {/* {
        !showCampaignLoader &&
        dashboardCampaignMetrics &&
        dashboardReportsMetrics &&
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Campaigns"
              total={dashboardCampaignMetrics.totalCampaigns ?? 0}
              color="info"
              icon={<SystemIcon type="campaign" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Checkins Today"
              total={dashboardCampaignMetrics.totalCheckInsToday}
              color="warning"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'primary.main' }} />} // Example icon for engagement
            />
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Reports"
              total={dashboardReportsMetrics.totalReports ?? 0}
              color="error"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'error.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Average checkin duration"
              total={isNumber(dashboardCampaignMetrics.averageCheckInDuration) ? getRelevantTimeInfo(dashboardCampaignMetrics.averageCheckInDuration) : 0}
              color="error"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'error.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Top 10 Active Campaigns"
              subheader="Number of checkins"
              onClickHandler={onCampaignActiveCampaignRankHandler}
              chart={{
                series: dashboardCampaignMetrics.totalCheckInsPerCampaign.map(x => ({ _id: x.campaignId.toString(), label: x.campaignTitle, value: x.totalCheckIns })),
              }} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AnalyticsTopUserCheckins
              list={dashboardCampaignMetrics.topUsersByCheckIns}
              title='Rank by Checkin Activity' />
          </Grid>


          <Grid xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Rank Campaign by Number of reports"
              subheader="Number of reports"
              onClickHandler={onCampaignReportRankHandler}
              chart={{
                series: dashboardReportsMetrics.reportsByCampaign.map(x => ({ _id: x.campaignId.toString(), label: x.campaignName, value: x.totalReports })),
              }} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AnalyticsAverageFilledReport
              list={dashboardReportsMetrics.avgAnswersPerDayPerReport}
              title='Rank By Daily Average Report Activity' />
          </Grid>
        </Grid>
      } */}
    </>
  );
}


export default memo(ClientDashboardCampaignMetrics)