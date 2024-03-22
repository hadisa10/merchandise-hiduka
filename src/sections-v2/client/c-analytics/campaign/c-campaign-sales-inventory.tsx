'use client';

import * as Yup from 'yup';
import { isObject } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { startOfDay, differenceInDays } from 'date-fns';
import { memo, useMemo, useState, useEffect } from 'react';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import { Stack, Button, styled, useTheme, ButtonBase } from '@mui/material';
import { MobileDateTimePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { fTimestamp, formatDifference } from 'src/utils/format-time';

import { useRealmApp } from 'src/components/realm';
import { SystemIcon } from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';

import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import AnalyticsConversionRates from 'src/sections/overview/analytics/analytics-conversion-rates';

import { ICampaign, ISalesByRegion, ISalesAnalyticsResponse, ITimeFrameSalesDataResponse } from 'src/types/realm/realm-types';

import ClientCampaignTimeSales from './c-campaign-time-sales-activity';

// import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
// import AnalyticsWebsiteVisits from 'src/sections/overview/analytics/analytics-website-visits';
// import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
// import AnalyticsTrafficBySite from 'src/sections/overview/analytics/analytics-traffic-by-site';
// import AnalyticsTasks from 'src/sections/overview/analytics/analytics-tasks';

// ----------------------------------------------------------------------


const TIME_LABELS = {
    week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    year: ['2018', '2019', '2020', '2021', '2022'],
};


export const StyledLabel = styled('span')(({ theme }) => ({
    ...theme.typography.caption,
    width: "max-content",
    flexShrink: 0,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightSemiBold,
}));

function ClientCampaignSalesInventoryView({ campaign }: { campaign: ICampaign }) {
    const settings = useSettingsContext();

    const theme = useTheme();

    const realmApp = useRealmApp()

    const campaignloading = useBoolean()

    const regionalSalesloading = useBoolean()

    const timeSalesloading = useBoolean()

    const showCampaignLoader = useShowLoader((campaignloading.value), 300);

    const showTimeSalesLoader = useShowLoader((timeSalesloading.value), 300);

    const showRegionalSalesLoader = useShowLoader((regionalSalesloading.value), 300);

    const [dashboarCampaignSalesMetrics, setDashboarCampaignSalesMetrics] = useState<ISalesAnalyticsResponse[] | null>(null);

    const [dashboardTimeSalesMetrics, setDashboardTimeSalesMetrics] = useState<ITimeFrameSalesDataResponse[] | null>(null);

    const [dashboardSalesByRegionMetrics, setDashboardSalesByRegionMetrics] = useState<ISalesByRegion[] | null>(null);

    const [startDate, setStartDate] = useState<Date>(campaign?.startDate ? new Date(campaign.startDate) : startOfDay(new Date()));
    const [endDate, setEndDate] = useState<Date>(new Date);

    const mdUp = useResponsive('up', 'md');


    const NewCurrectSchema = Yup.object().shape({
        startDate: Yup.date()
            .transform((value, originalValue) => {
                // Check if the originalValue is a number (Unix timestamp in milliseconds)
                if (typeof originalValue === 'number') {
                    return new Date(originalValue);
                }
                // For string input, attempt to parse it as a date
                if (typeof originalValue === 'string') {
                    return new Date(originalValue);
                }
                return value;
            })
            .required('Start date is required')
            .typeError('Start date must be a valid date, date-time string, or Unix timestamp'),
        endDate: Yup.date()
            .transform((value, originalValue) => {
                // Check if the originalValue is a number (Unix timestamp in milliseconds)
                if (typeof originalValue === 'number') {
                    return new Date(originalValue);
                }
                // For string input, attempt to parse it as a date
                if (typeof originalValue === 'string') {
                    return new Date(originalValue);
                }
                return value;
            })
            .required('End date is required')
            .typeError('End date must be a valid date, date-time string, or Unix timestamp')
            .test(
                'date-after-start',
                'End date must be after start date',
                (value, { parent }) => {
                    const { startDate } = parent;
                    // Ensure both startDate and endDate are valid Date objects before comparing
                    return startDate && value && new Date(startDate) < new Date(value);
                }
            ),
    })

    const defaultValues = useMemo(
        () => ({
            startDate: startOfDay(campaign.startDate),
            endDate: new Date()
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewCurrectSchema),
        defaultValues,
        mode: "all"
    });

    const {
        reset,
        setValue,
        watch,
        control,
        handleSubmit,
        getFieldState,
        formState: { isSubmitting, errors },
    } = methods;

    const { error: startDateError } = getFieldState("startDate")
    const { error: endDateError } = getFieldState("endDate")


    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (campaign._id && startDate && endDate) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getCampaignSalesMetrics(campaign._id.toString(), startDate, endDate).then((data: ISalesAnalyticsResponse[]) => setDashboarCampaignSalesMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id, startDate, endDate])

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

    const timeseries = useMemo(() => {
        const t = Array.from(new Set(dashboardTimeSalesMetrics?.map(x => x.date)))
        return {
            week: t
        }
    }, [dashboardTimeSalesMetrics])
    const changedStartDate = watch("startDate")

    const changedEndDate = watch("endDate")

    const onSubmit = handleSubmit(async (data) => {
        if (data.startDate && data.endDate) {
            setStartDate(data.startDate)
            setEndDate(data.endDate)
        } else {
            console.log(data, "SNAPSHOT")
        }
    })

    const days = useMemo(() => differenceInDays(endDate, startDate), [startDate, endDate])

    const renderDateDetails = (
        <>
            {!mdUp &&
                <Stack>
                    <Stack>
                        <Controller
                            name="startDate"
                            control={control}
                            render={({ field }) => <MobileDateTimePicker
                                {...field}
                                value={new Date(field.value as Date)}
                                onChange={(newValue) => {
                                    if (newValue) {
                                        field.onChange(fTimestamp(newValue));
                                    }
                                }}
                                label="Start date"
                                format="dd/MM/yyyy hh:mm a"
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: isObject(startDateError),
                                        helperText: isObject(startDateError) && startDateError.message,
                                    },
                                }}
                            />}
                        />
                        <StyledLabel>{changedStartDate ? formatDifference(new Date(changedStartDate)) : formatDifference(new Date())}</StyledLabel>
                    </Stack>
                    <Stack>
                        <Controller
                            name="endDate"
                            control={control}
                            render={({ field }) => (
                                <MobileDateTimePicker
                                    {...field}
                                    value={new Date(field.value as Date)}
                                    onChange={(newValue) => {
                                        if (newValue) {
                                            field.onChange(fTimestamp(newValue));
                                        }
                                    }}
                                    label="End date"
                                    format="dd/MM/yyyy"
                                    slotProps={{
                                        textField: {
                                            fullWidth: true,
                                            error: isObject(endDateError),
                                            helperText: isObject(endDateError) && endDateError.message,
                                        },
                                    }}
                                />
                            )}
                        />
                        <StyledLabel>{changedEndDate ? formatDifference(new Date(changedEndDate)) : formatDifference(new Date())}</StyledLabel>
                    </Stack>
                </Stack>
            }
            {mdUp &&
                <Stack direction="row" spacing={2}>
                        <Stack>
                            <Controller
                                name="startDate"
                                control={control}
                                render={({ field }) => (
                                    <DesktopDateTimePicker
                                        {...field}
                                        value={new Date(field.value as Date)}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                field.onChange(fTimestamp(newValue));
                                            }
                                        }}
                                        label="Start date"
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: isObject(startDateError),
                                                helperText: isObject(startDateError) && startDateError.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <StyledLabel>{changedStartDate ? formatDifference(new Date(changedStartDate)) : formatDifference(new Date())}</StyledLabel>
                        </Stack>

                        <Stack>
                            <Controller
                                name="endDate"
                                control={control}
                                render={({ field }) => (
                                    <DesktopDateTimePicker
                                        {...field}
                                        value={new Date(field.value as Date)}
                                        onChange={(newValue) => {
                                            if (newValue) {
                                                field.onChange(fTimestamp(newValue));
                                            }
                                        }}
                                        label="End date"
                                        format="dd/MM/yyyy"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                error: isObject(endDateError),
                                                helperText: isObject(endDateError) && endDateError.message,
                                            },
                                        }}
                                    />
                                )}
                            />
                            <StyledLabel>{changedEndDate ? formatDifference(new Date(changedEndDate)) : formatDifference(new Date())}</StyledLabel>
                        </Stack>
                    </Stack>
            }
        </>
    )
    const totalUnitsSold = useMemo(() => dashboarCampaignSalesMetrics ? dashboarCampaignSalesMetrics.reduce((accumulator, item) => accumulator + item.totalQuantity, 0) : 0, [dashboarCampaignSalesMetrics])
    const totalAverageUnitsSold = useMemo(() => totalUnitsSold > 0 && days > 0 ? totalUnitsSold / days : totalUnitsSold, [totalUnitsSold, days])
    const topSelling = useMemo(() => dashboarCampaignSalesMetrics ? dashboarCampaignSalesMetrics?.sort((a,b) => b.totalQuantity - a.totalQuantity)[0] : null, [dashboarCampaignSalesMetrics])
    
    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Container maxWidth={settings.themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    {showCampaignLoader && <LoadingScreen />}
                    {
                        !showCampaignLoader && dashboarCampaignSalesMetrics &&
                        <>
                            <Grid xs={12} display="flex" justifyContent="space-evenly" >
                                <Stack>
                                    {renderDateDetails}
                                </Stack>
                                <Stack direction="row" spacing={1} height="max-content" justifyContent="space-between">
                                    <Button color="error" onClick={() => {
                                        setValue("endDate", new Date())
                                        setValue("startDate", startOfDay(new Date()))

                                    }} variant="soft" >
                                        Clear
                                    </Button>
                                    <LoadingButton type="submit" loading={isSubmitting} color="success" variant="contained">
                                        Get Snapshot
                                    </LoadingButton>
                                </Stack>
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <AnalyticsWidgetSummary
                                    sx={{ width: "100%" }}
                                    component={ButtonBase}
                                    onClick={() => console.log("TOTAL SALES")}
                                    title="Total Units Sold"
                                    total={totalUnitsSold}
                                    color="error"
                                    icon={<SystemIcon type="sale" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                                />
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <AnalyticsWidgetSummary
                                    sx={{ width: "100%" }}
                                    component={ButtonBase}
                                    onClick={() => console.log("Average daily Sales")}
                                    title="Average daily Sales"
                                    total={totalAverageUnitsSold}
                                    color="warning"
                                    icon={<SystemIcon type="average" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                                />
                            </Grid>
                            <Grid xs={12} sm={6} md={4}>
                                <AnalyticsWidgetSummary
                                    sx={{ width: "100%" }}
                                    component={ButtonBase}
                                    onClick={() => console.log("Top Selling Product")}
                                    title={`Top Selling Product: ${topSelling?.productName ?? "N/A"}`}
                                    total={topSelling?.totalQuantity ?? 0}
                                    color="info"
                                    icon={<SystemIcon type="marketAnalysis" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                                />
                            </Grid>
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
                                                    data: dashboardTimeSalesMetrics.map(x => ({ name: x.productName, data: [x.totalUnitsSold] })),
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
                    }
                    {/* <Grid xs={12} sm={6} md={3}>
                    Total Engagements
                </Grid> */}

                </Grid>
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
            </Container >
        </FormProvider>
    );
}


export default memo(ClientCampaignSalesInventoryView)