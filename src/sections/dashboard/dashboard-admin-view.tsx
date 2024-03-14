'use client';


import Grid from '@mui/material/Unstable_Grid2';

import { useShowLoader } from 'src/hooks/realm';
import { useDashboard } from 'src/hooks/realm/dashboard/use-dashboard-graphql';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
import AnalyticsConversionRates from 'src/sections/overview/analytics/analytics-conversion-rates';


// ----------------------------------------------------------------------

export default function DashboardAdminView() {

    const { dashboardMetrics, loading } = useDashboard(false);

    const showLoader = useShowLoader(loading, 300);

    console.log(dashboardMetrics, 'DASHBOARD METRICS')

    return (
        <Grid container spacing={3}>
            {showLoader && <LoadingScreen />}
            {
                !showLoader && dashboardMetrics &&
                <>
                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Total Campaigns"
                            total={dashboardMetrics.totalCampaigns}
                            icon={<Iconify width={48} icon="icon-park:agreement" />}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Average Checkin duration"
                            total={dashboardMetrics.averageCheckInDuration}
                            color="info"
                            icon={<Iconify width={64} icon="material-symbols-light:campaign-rounded" />}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Today Checkins"
                            total={dashboardMetrics.totalCheckInsToday}
                            color="warning"
                            icon={<Iconify width={64} icon="heroicons:users-16-solid" />}
                        />
                    </Grid>

                    <Grid xs={12} sm={6} md={3}>
                        <AnalyticsWidgetSummary
                            title="Net Income"
                            total={1000000}
                            color="error"
                            icon={<Iconify width={48} icon="icon-park:agreement" />}
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={8}>
                        <AnalyticsConversionRates
                            title="Revenue per Client"
                            subheader="(+43%) than last year"
                            chart={{
                                series: [
                                    { label: 'Bidco', value: 100 },
                                    { label: 'Blue band', value: 230 },
                                    { label: 'Wrigleys', value: 448 },
                                    { label: 'Company A', value: 470 },
                                    { label: 'Company B', value: 540 },
                                    { label: 'Company C', value: 580 },
                                    { label: 'Company D', value: 690 },
                                    { label: 'Company E', value: 1000 },
                                    { label: 'Company F', value: 1500 }
                                ],
                            }}
                        />
                    </Grid>
                    <Grid xs={12} md={6} lg={4}>
                        <AnalyticsCurrentVisits
                            title="Revenue by Region"
                            chart={{
                                series: [
                                    { label: 'Kenya', value: 4344 },
                                    { label: 'Uganda', value: 5435 },
                                    { label: 'Ethiopia', value: 1443 },
                                ],
                            }}
                        />
                    </Grid>
                </>
            }
        </Grid>
    );
}
