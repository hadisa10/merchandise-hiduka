'use client';

import { isNumber } from 'lodash';

import Grid from '@mui/material/Unstable_Grid2';

import { getRelevantTimeInfo } from 'src/utils/helpers';

import { SystemIcon } from 'src/components/iconify';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import AnalyticsConversionRates from 'src/sections/overview/analytics/analytics-conversion-rates';
import AnalyticsTopUserCheckins from 'src/sections/overview/analytics/analytics-top-user-checkins';

import { IAdminDashboardData } from 'src/types/realm/realm-types';

export function AdminDashboardCampaignMetrics({ dashboarCampaigndMetrics }: { dashboarCampaigndMetrics: IAdminDashboardData; }) {
  return <Grid container spacing={3}>
    <Grid xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Total Clients"
        total={dashboarCampaigndMetrics.totalClients ?? 0}
        icon={<SystemIcon type="client" width={45} sx={{ color: 'success.main' }} />} // Example icon for engagement
      />
    </Grid>

    <Grid xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Total Campaigns"
        total={dashboarCampaigndMetrics.totalCampaigns ?? 0}
        color="info"
        icon={<SystemIcon type="campaign" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
      />
    </Grid>

    <Grid xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Total Checkins Today"
        total={dashboarCampaigndMetrics.totalCheckInsToday}
        color="warning"
        icon={<SystemIcon type="checkin" width={45} sx={{ color: 'primary.main' }} />} // Example icon for engagement
      />
    </Grid>

    <Grid xs={12} sm={6} md={3}>
      <AnalyticsWidgetSummary
        title="Average checkin duration"
        total={isNumber(dashboarCampaigndMetrics.averageCheckInDuration) ? getRelevantTimeInfo(dashboarCampaigndMetrics.averageCheckInDuration) : 0}
        color="error"
        icon={<SystemIcon type="checkin" width={45} sx={{ color: 'error.main' }} />} // Example icon for engagement
      />
    </Grid>

    <Grid xs={12} md={6} lg={8}>
      <AnalyticsConversionRates
        title="Top 10 Active Campaigns"
        subheader="Number of checkins"
        chart={{
          series: dashboarCampaigndMetrics.totalCheckInsPerCampaign.map(x => ({ label: x.campaignTitle, value: x.totalCheckIns })),
        }} />
    </Grid>

    <Grid xs={12} md={6} lg={4}>
      <AnalyticsTopUserCheckins
        list={dashboarCampaigndMetrics.topUsersByCheckIns}
        title='Top 5 High Activity user' />
    </Grid>

    {/* <Grid xs={12} md={6} lg={8}>
              <AnalyticsWebsiteVisits
                title="Website Visits"
                subheader="(+43%) than last year"
                chart={{
                  labels: [
                    '01/01/2003',
                    '02/01/2003',
                    '03/01/2003',
                    '04/01/2003',
                    '05/01/2003',
                    '06/01/2003',
                    '07/01/2003',
                    '08/01/2003',
                    '09/01/2003',
                    '10/01/2003',
                    '11/01/2003',
                  ],
                  series: [
                    {
                      name: 'Team A',
                      type: 'column',
                      fill: 'solid',
                      data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30],
                    },
                    {
                      name: 'Team B',
                      type: 'area',
                      fill: 'gradient',
                      data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43],
                    },
                    {
                      name: 'Team C',
                      type: 'line',
                      fill: 'solid',
                      data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39],
                    },
                  ],
                }}
              />
            </Grid>
    
            <Grid xs={12} md={6} lg={4}>
              <AnalyticsCurrentVisits
                title="Current Visits"
                chart={{
                  series: [
                    { label: 'America', value: 4344 },
                    { label: 'Asia', value: 5435 },
                    { label: 'Europe', value: 1443 },
                    { label: 'Africa', value: 4443 },
                  ],
                }}
              />
            </Grid>
    
            
    
            <Grid xs={12} md={6} lg={8}>
              <AnalyticsNews title="News" list={_analyticPosts} />
            </Grid>
    
            <Grid xs={12} md={6} lg={4}>
              <AnalyticsOrderTimeline title="Order Timeline" list={_analyticOrderTimeline} />
            </Grid>
    
            <Grid xs={12} md={6} lg={4}>
              <AnalyticsTrafficBySite title="Traffic by Site" list={_analyticTraffic} />
            </Grid>
    
            <Grid xs={12} md={6} lg={8}>
              <AnalyticsTasks title="Tasks" list={_analyticTasks} />
            </Grid> */}
  </Grid>;
}
