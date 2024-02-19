'use client';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
    _analyticTasks,
    _analyticPosts,
    _analyticTraffic,
    _analyticOrderTimeline,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AnalyticsNews from '../../analytics-news';
import AnalyticsTasks from '../../analytics-tasks';
import AnalyticsCurrentVisits from '../../analytics-current-visits';
import AnalyticsOrderTimeline from '../../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../../analytics-website-visits';
import AnalyticsWidgetSummary from '../../analytics-widget-summary';
import AnalyticsTrafficBySite from '../../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../../analytics-current-subject';
import AnalyticsConversionRates from '../../analytics-conversion-rates';
import { IReport } from 'src/types/realm/realm-types';
import { useMemo } from 'react';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function CampaignEngagmentView({ reports }: { reports: IReport[] }) {
    const settings = useSettingsContext();
    const reportsColl = useMemo(() => reports.reduce((acc, r) => { return acc + r.responses }, 0), [reports])
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Total Engagements"
                        total={reportsColl}
                        icon={<Iconify width={45} icon="mdi:handshake" style={{ color: '#757ce8' }} />} // Example icon for engagement
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="New Users Reached"
                        total={reportsColl}
                        color="info"
                        icon={<Iconify width={45} icon="mdi:account-multiple-plus" style={{ color: '#00acc1' }} />} // Example icon for new users
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Engagement Rate"
                        total={reportsColl}
                        color="warning"
                        icon={<Iconify width={45} icon="mdi:percent" style={{ color: '#ffa726' }} />} // Example icon for rates
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title="Top Performing Campaigns"
                        total={reportsColl}
                        color="error"
                        icon={<Iconify width={45} icon="mdi:star-circle" style={{ color: '#e53935' }} />} // Example icon for top performance
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsWebsiteVisits
                        title="Visits with High Engagement"
                        subheader=""
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
                        title="Top Engagement Subjects"
                        chart={{
                            series: [
                                { label: 'Nairobi', value: 2 },
                                { label: 'Kisumu', value: 3 },
                                { label: 'Nakuru', value: 5 },
                                { label: 'Mombasa', value: 8 },
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsTrafficBySite title="Sources of Engaged Traffic" list={[
                          {
                            value: 'facebook',
                            label: 'FaceBook',
                            total: 5,
                            icon: 'eva:facebook-fill',
                          },
                          {
                            value: 'google',
                            label: 'Google',
                            total: 0,
                            icon: 'eva:google-fill',
                          },
                          {
                            value: 'linkedin',
                            label: 'Linkedin',
                            total: 0,
                            icon: 'eva:linkedin-fill',
                          },
                          {
                            value: 'twitter',
                            label: 'Twitter',
                            total: 0,
                            icon: 'eva:twitter-fill',
                          },
                    ]} />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsTasks title="Engagement Optimization Tasks" list={[{ id: "1", name: "Visiting high traffic arears" }]} />
                </Grid>
            </Grid>
        </Container>
    );
}
