'use client';

import { enqueueSnackbar } from 'notistack';
import { memo, lazy, useState, Suspense, useEffect } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';

import { ICampaign, ISalesByRegion, ISalesAnalyticsResponse, ITimeFrameSalesDataResponse } from 'src/types/realm/realm-types';


const UserActivityView = lazy(() => import('src/sections/campaign/list/user-activity'));


// import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
// import AnalyticsWebsiteVisits from 'src/sections/overview/analytics/analytics-website-visits';
// import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
// import AnalyticsTrafficBySite from 'src/sections/overview/analytics/analytics-traffic-by-site';
// import AnalyticsTasks from 'src/sections/overview/analytics/analytics-tasks';

// ----------------------------------------------------------------------

// interface ChartData {
//     categories: string[];
//     series: {
//         name: string;
//         data: number[];
//     }[];
// }

// const TIME_LABELS = {
//     week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
//     month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//     year: ['2018', '2019', '2020', '2021', '2022'],
// };

function ClientCampaignActivityTracker({ campaign }: { campaign: ICampaign }) {
    // const settings = useSettingsContext();

    // const theme = useTheme();

    const realmApp = useRealmApp()

    const campaignloading = useBoolean()

    const regionalSalesloading = useBoolean()

    // const showCampaignLoader = useShowLoader((campaignloading.value), 300);

    // const showTimeSalesLoader = useShowLoader((timeSalesloading.value), 300);

    // const showRegionalSalesLoader = useShowLoader((regionalSalesloading.value), 300);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboarCampaignSalesMetrics, setDashboarCampaignSalesMetrics] = useState<ISalesAnalyticsResponse[] | null>(null);

    const [dashboardTimeSalesMetrics, setDashboardTimeSalesMetrics] = useState<ITimeFrameSalesDataResponse[] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboardSalesByRegionMetrics, setDashboardSalesByRegionMetrics] = useState<ISalesByRegion[] | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (campaign._id) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getCampaignSalesMetrics(campaign._id.toString()).then((data: ISalesAnalyticsResponse[]) => setDashboarCampaignSalesMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    useEffect(() => {
        if (campaign._id) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getSalesOfProductOverTime({ campaign_id: campaign._id.toString(), timeFrame: "week" }).then((data: ITimeFrameSalesDataResponse[]) => setDashboardTimeSalesMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    useEffect(() => {
        if (campaign._id) {
            regionalSalesloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getCampaignSalesByRegion(campaign._id.toString()).then((data: ISalesByRegion[]) => setDashboardSalesByRegionMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => regionalSalesloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    return (
        <>
            {/* {showCampaignLoader && <LoadingScreen />} */}
            <Suspense fallback={<LoadingScreen />}><UserActivityView campaign={campaign} /></Suspense>

            {/* {
                    !showCampaignLoader && dashboarCampaignSalesMetrics &&
                    <>
                        <Grid xs={12} md={6} lg={8}>
                            <AnalyticsConversionRates
                                title="Product Sales summary"
                                subheader="by quantity"
                                chart={{
                                    series: dashboarCampaignSalesMetrics.map(x => ({ label: x.productName, value: x.totalQuantity })).sort((a, b) => a.value - b.value)
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={6} lg={4}>
                            {showRegionalSalesLoader && <LoadingScreen />}
                            {
                                !showRegionalSalesLoader && dashboardSalesByRegionMetrics &&
                                <AnalyticsCurrentVisits
                                    title="Sales by Region"
                                    chart={{
                                        series: dashboardSalesByRegionMetrics.map(x => ({ label: x.regionName ?? "Default Region", value: x.totalSales })),
                                    }}
                                />
                            }
                        </Grid>
                        <Grid xs={12} md={6} lg={8}>
                            <AnalyticsConversionRates
                                title="Product Sales Revenue"
                                subheader="by revenue"
                                chart={{
                                    series: dashboarCampaignSalesMetrics.map(x => ({ label: x.productName, value: x.totalAmount })).sort((a, b) => a.value - b.value)
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={6} lg={4}>
                            {showRegionalSalesLoader && <LoadingScreen />}
                            {
                                !showRegionalSalesLoader && dashboardSalesByRegionMetrics &&
                                <AnalyticsCurrentVisits
                                    title="Revenue by Region"
                                    chart={{
                                        series: dashboardSalesByRegionMetrics.map(x => ({ label: x.regionName ?? "Default Region", value: x.totalRevenue })),
                                    }}
                                />
                            }
                        </Grid>
                        <Grid xs={12} md={6} lg={4}>
                            <AnalyticsCurrentVisits
                                title="Products Revenue per product"
                                chart={{
                                    series: dashboarCampaignSalesMetrics.map(x => ({ label: x.productName, value: x.totalAmount })),
                                }}
                            />
                        </Grid>
                        <Grid xs={12} md={6} lg={4}>
                            <AnalyticsCurrentVisits
                                title="Products Sale quantity by product"
                                chart={{
                                    series: dashboarCampaignSalesMetrics.map(x => ({ label: x.productName, value: x.totalQuantity })),
                                }}
                            />
                        </Grid>


                        <Grid xs={12} md={6} lg={8}>
                            {
                                dashboardTimeSalesMetrics &&
                                // <ChartColumnStacked
                                //     // series={[
                                //     //     { name: 'Product A', data: [44, 55, 41, 67, 22, 43] },
                                //     //     { name: 'Product B', data: [13, 23, 20, 8, 13, 27] },
                                //     //     { name: 'Product C', data: [11, 17, 15, 15, 21, 14] },
                                //     //     { name: 'Product D', data: [21, 7, 25, 13, 22, 8] },
                                //     // ]}
                                //     series={dashboardTimeSalesMetrics?.map(x => ({
                                //         name: x.productName,
                                //         data: [x.totalUnitsSold]
                                //     }))}
                                // />
                                <ClientCampaignTimeSales
                                    title="Unit Sold Time Series"
                                    chart={{
                                        labels: timeseries,
                                        colors: [
                                            theme.palette.primary.main,
                                            theme.palette.error.main,
                                            theme.palette.warning.main,
                                            theme.palette.text.disabled,
                                        ],
                                        series: [
                                            {
                                                type: 'Week',
                                                data: dashboardTimeSalesMetrics.map(x => ({name: x.productName, data: [x.totalUnitsSold]})),
                                            },
                                            // {
                                            //     type: 'Month',
                                            //     data: [
                                            //         {
                                            //             name: 'Images',
                                            //             data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                                            //         },
                                            //         {
                                            //             name: 'Media',
                                            //             data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                                            //         },
                                            //         {
                                            //             name: 'Documents',
                                            //             data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                                            //         },
                                            //         {
                                            //             name: 'Other',
                                            //             data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                                            //         },
                                            //     ],
                                            // },
                                            // {
                                            //     type: 'Year',
                                            //     data: [
                                            //         { name: 'Images', data: [10, 34, 13, 56, 77] },
                                            //         { name: 'Media', data: [10, 34, 13, 56, 77] },
                                            //         { name: 'Documents', data: [10, 34, 13, 56, 77] },
                                            //         { name: 'Other', data: [10, 34, 13, 56, 77] },
                                            //     ],
                                            // },
                                        ],
                                    }}
                                />
                            }

                        </Grid>

                    </>
                } */}
            {/* <Grid xs={12} sm={6} md={3}>
                    Total Engagements
                </Grid> */}
            {/* <Grid container spacing={3}>
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
            </Grid> */}
        </ >
    );
}


export default memo(ClientCampaignActivityTracker)