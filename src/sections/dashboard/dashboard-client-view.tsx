'use client';

import Grid from '@mui/material/Unstable_Grid2';

import {
    _analyticTasks,
    _analyticPosts,
    _analyticTraffic,
    _analyticOrderTimeline,
} from 'src/_mock';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import Iconify from 'src/components/iconify';
import AnalyticsConversionRates from 'src/sections/overview/analytics/analytics-conversion-rates';
import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
import EcommerceYearlySales from '../overview/e-commerce/ecommerce-yearly-sales';


// ----------------------------------------------------------------------

export default function DashboardClientView() {
    return (
        <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Total Customer Reached"
                    total={100}
                    icon={<Iconify width={48} icon="icon-park:agreement" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Active Campaigns"
                    total={10}
                    color="info"
                    icon={<Iconify width={64} icon="material-symbols-light:campaign-rounded" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Products Sold"
                    total={200}
                    color="warning"
                    icon={<Iconify width={64} icon="heroicons:users-16-solid" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Net Income"
                    total={100000}
                    color="error"
                    icon={<Iconify width={48} icon="icon-park:agreement" />}
                />
            </Grid>
            <Grid xs={12} md={6} lg={8}>
                <AnalyticsConversionRates
                    title="Revenue per product"
                    subheader="(+43%) than last year"
                    chart={{
                        series: [
                            { label: 'Product 1', value: 400 },
                            { label: 'Product 2', value: 430 },
                            { label: 'Product 3', value: 448 },
                            { label: 'Product 4', value: 448 },
                            { label: 'Product 5', value: 448 },
                            { label: 'Product 6', value: 448 }

                        ],
                    }}
                />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
                <AnalyticsCurrentVisits
                    title="Revenue by Region"
                    chart={{
                        series: [
                            { label: 'Nairobi', value: 4344 },
                            { label: 'Mombasa', value: 5435 },
                            { label: 'Kisumu', value: 1443 },
                            { label: 'Nakuru', value: 1443 },
                            { label: 'Kilifi', value: 1443 },
                        ],
                    }}
                />
            </Grid>
            <Grid xs={12} md={6} lg={8}>
                <EcommerceYearlySales
                    title="Yearly Sales"
                    subheader="(+25%) than last year"
                    chart={{
                        categories: [
                            'Jan',
                            'Feb',
                            'Mar',
                            'Apr',
                            'May',
                            'Jun',
                            'Jul',
                            'Aug',
                            'Sep',
                            'Oct',
                            'Nov',
                            'Dec',
                        ],
                        series: [
                            {
                                year: '2023',
                                data: [
                                    {
                                        name: 'Total Income',
                                        data: [10, 41, 35, 51, 49, 62, 69, 91, 148, 35, 51, 49],
                                    },
                                    {
                                        name: 'Total Expenses',
                                        data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 13, 56, 77],
                                    },
                                ],
                            },
                            {
                                year: '2024',
                                data: [
                                    {
                                        name: 'Total Income',
                                        data: [51, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    },
                                    {
                                        name: 'Total Expenses',
                                        data: [20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                                    },
                                ],
                            },
                        ],
                    }}
                />
            </Grid>
        </Grid>
    );
}
