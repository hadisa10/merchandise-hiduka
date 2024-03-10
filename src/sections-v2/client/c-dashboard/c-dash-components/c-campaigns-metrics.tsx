'use client';

import { isNumber } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { memo, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { getRelevantTimeInfo } from 'src/utils/helpers';

import { useRealmApp } from 'src/components/realm';
import { SystemIcon } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import AnalyticsTopUserCheckins from 'src/sections/overview/analytics/analytics-top-user-checkins';
import AnalyticsAvarageFilledReport from 'src/sections/overview/analytics/analytics-avg-filled-report';
import AnalyticsConversionRates, { IChartSeries } from 'src/sections/overview/analytics/analytics-conversion-rates';

import { IAdminDashboardData, IAdminDashboardReportSummary } from 'src/types/realm/realm-types';

function AdminDashboardCampaignMetrics() {

  const realmApp = useRealmApp()

  const campaignloading = useBoolean(true)

  const reportsloading = useBoolean(true)

  const showCampaignLoader = useShowLoader((campaignloading.value || reportsloading.value), 300);

  const [dashboarCampaignMetrics, setDashboarCampaignMetrics] = useState<IAdminDashboardData | null>(null);

  const [dashboarReportsMetrics, setDashboarReportsMetrics] = useState<IAdminDashboardReportSummary | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    campaignloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getDashboardMetrics().then((data: IAdminDashboardData) => setDashboarCampaignMetrics(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
      }
      )
      .finally(() => campaignloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    campaignloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getReportDashboardMetrics().then((data: IAdminDashboardReportSummary) => setDashboarReportsMetrics(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
      }
      )
      .finally(() => campaignloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onCampaignReportRankHandler = useCallback((value: IChartSeries) => {
    console.log(value, "ACTIVE CAMPAIGN BY RANK CLICKED")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboarReportsMetrics?.reportsByCampaign])

  const onCampaignActiveCampaignRankHandler = useCallback((value: IChartSeries) => {
    console.log(value, "ACTIVE CAMPAIGN CLICKED")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboarReportsMetrics?.reportsByCampaign])


  return (
    <>
      {showCampaignLoader && <LoadingScreen />}

      {
        !showCampaignLoader &&
        dashboarCampaignMetrics &&
        dashboarReportsMetrics &&
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Clients"
              total={dashboarCampaignMetrics.totalClients ?? 0}
              icon={<SystemIcon type="client" width={45} sx={{ color: 'success.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Campaigns"
              total={dashboarCampaignMetrics.totalCampaigns ?? 0}
              color="info"
              icon={<SystemIcon type="campaign" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Checkins Today"
              total={dashboarCampaignMetrics.totalCheckInsToday}
              color="warning"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'primary.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Avarage checkin duration"
              total={isNumber(dashboarCampaignMetrics.averageCheckInDuration) ? getRelevantTimeInfo(dashboarCampaignMetrics.averageCheckInDuration) : 0}
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
                series: dashboarCampaignMetrics.totalCheckInsPerCampaign.map(x => ({ _id: x.campaignId.toString(), label: x.campaignTitle, value: x.totalCheckIns })),
              }} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AnalyticsTopUserCheckins
              list={dashboarCampaignMetrics.topUsersByCheckIns}
              title='Rank by Checkin Activity' />
          </Grid>


          <Grid xs={12} md={6} lg={8}>
            <AnalyticsConversionRates
              title="Rank Campaign by Number of reports"
              subheader="Number of reports"
              onClickHandler={onCampaignReportRankHandler}
              chart={{
                series: dashboarReportsMetrics.reportsByCampaign.map(x => ({ _id: x.campaignId.toString(), label: x.campaignName, value: x.totalReports })),
              }} />
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            <AnalyticsAvarageFilledReport
              list={dashboarReportsMetrics.avgAnswersPerDayPerReport}
              title='Rank By Daily Average Report Activity' />
          </Grid>
        </Grid>
      }
    </>
  );
}


export default memo(AdminDashboardCampaignMetrics)