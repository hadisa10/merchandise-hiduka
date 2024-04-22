"use client"

import * as Yup from 'yup';
import { enqueueSnackbar } from "notistack";
import { isEmpty, isObject, isString } from "lodash";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useMemo, useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { MobileDateTimePicker, DesktopDateTimePicker } from "@mui/x-date-pickers";
import {
    Card,
    Stack, Button, styled, useTheme, ButtonBase
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { formatFilterAndRemoveFields } from "src/utils/helpers";
import { fDateTime, fTimestamp, formatDifference } from "src/utils/format-time";

import { useRealmApp } from "src/components/realm";
import { SystemIcon } from "src/components/iconify";
import { DataGridFlexible } from "src/components/data-grid";
import { LoadingScreen } from "src/components/loading-screen";
import FormProvider from "src/components/hook-form/form-provider";
import { IGenericColumn } from "src/components/data-grid/data-grid-flexible";

import AnalyticsWidgetSummary from "src/sections/overview/analytics/analytics-widget-summary";

import { IUser, ICampaignUser } from "src/types/user_realm";
import { ICampaign, ICampaignKPIMetricsResponse } from "src/types/realm/realm-types";

import AssignProductDialog from "./assign-product-dialog";

interface IUserActivityDataGridProps {
    campaign: ICampaign;
    handleOpenCheckInRouteView?: (user: IUser) => void;
}

// ----------------------------------------------------------------------

export const StyledLabel = styled('span')(({ theme }) => ({
    ...theme.typography.caption,
    width: "max-content",
    flexShrink: 0,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightSemiBold,
}));

export default function UserActivityDataGrid({ campaign, handleOpenCheckInRouteView }: IUserActivityDataGridProps) {
    // const { loading, clients } = useClients(false);

    const theme = useTheme();

    const loadingCampaignUsers = useBoolean()

    const openAssign = useBoolean();

    const realmApp = useRealmApp();

    const mdUp = useResponsive('up', 'md');

    const [campaignUsers, setCampaignUsers] = useState<ICampaignUser[]>([])

    const [campaignKPIMetrics, setCampaignKPIMetrics] = useState<ICampaignKPIMetricsResponse | null>(null)

    const [snapshotDateTime, setSnapShotDateTime] = useState<Date>(new Date);


    const NewCurrectSchema = Yup.object().shape({
        snapshotDateTime: Yup.date()
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
    })

    const defaultValues = useMemo(
        () => ({
            snapshotDateTime: new Date()
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewCurrectSchema),
        defaultValues,
        mode: "all"
    });

    const {
        setValue,
        watch,
        control,
        handleSubmit,
        getFieldState,
        formState: { isSubmitting },
    } = methods;

    const { error: startDateError } = getFieldState("snapshotDateTime")

    const [selectedCampaignUsers, setSelectedCampaignUsers] = useState<ICampaignUser[] | null>(null)

    const userActivitySummary = useBoolean();

    const showActivityLoader = useShowLoader((userActivitySummary.value), 300);

    const campaignKPIMetricsLoading = useBoolean();

    const showCampaignKPIMetricsLoader = useShowLoader((campaignKPIMetricsLoading.value), 300);

    // eslint-disable-next-line
    const [campaignUsersError, setCampaignUsersError] = useState(null)

    const showLoader = useShowLoader(loadingCampaignUsers.value, 500);

    const campaignId = useMemo(() => campaign._id.toString(), [campaign._id])


    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId) && snapshotDateTime) {
            loadingCampaignUsers.onTrue()
            setCampaignUsersError(null)
            realmApp.currentUser?.functions.getCampaignUsers(campaignId.toString(), snapshotDateTime.toISOString())
                .then((res: ICampaignUser[]) => {
                    setCampaignUsersError(null)
                    setCampaignUsers(res)
                }
                )
                .catch(e => {
                    enqueueSnackbar("Failed to fetch campaign products", { variant: "error" })
                    setCampaignUsers(e.message)
                    console.error(e, "REPORT FETCH")
                })
                .finally(() => {
                    loadingCampaignUsers.onFalse()
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId, snapshotDateTime])


    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId) && snapshotDateTime) {
            campaignKPIMetricsLoading.onTrue()
            setCampaignUsersError(null)
            realmApp.currentUser?.functions.getCampaignKPIMetrics(campaignId.toString(), snapshotDateTime.toISOString())
                .then((res: ICampaignKPIMetricsResponse) => {
                    setCampaignUsersError(null)
                    setCampaignKPIMetrics(res)
                }
                )
                .catch(e => {
                    enqueueSnackbar("Failed to fetch campaign products", { variant: "error" })
                    setCampaignUsers(e.message)
                    console.error(e, "REPORT FETCH")
                })
                .finally(() => {
                    campaignKPIMetricsLoading.onFalse()
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId, snapshotDateTime])

    // const handleDeleteRows = useCallback((id: string) => {
    //     const user = campaignUsers.find(campaignUser => campaignUser._id.toString() === id.toString());
    //     if (user && handleOpenCheckInRouteView) {
    //         handleOpenCheckInRouteView(user);
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [campaignUsers])


    const handleAssignProductsToUser = useCallback((ids: string[]) => {
        const sUsers = campaignUsers.filter(campaignUser => ids.some(x => x.toString() === campaignUser._id.toString()));
        if (sUsers) {
            setSelectedCampaignUsers(sUsers);
            openAssign.onTrue()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers])

    const handleBulkAssignProducts = useCallback((cmpUsers: ICampaignUser[]) => {
        if (cmpUsers) {
            setSelectedCampaignUsers(cmpUsers);
            openAssign.onTrue()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers])

    const handleEditRow = useCallback(
        (id: string) => {
            const user = campaignUsers.find(campaignUser => campaignUser._id.toString() === id.toString());
            if (user && handleOpenCheckInRouteView) {
                handleOpenCheckInRouteView(user);
            }

        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [campaignUsers]
    );

    const changedSnapshot = watch("snapshotDateTime")

    const columns: IGenericColumn<ICampaignUser>[] = useMemo(() => {
        const cols: Omit<IGenericColumn<ICampaignUser>, "order">[] = [
            {
                field: "_id",
                label: "id",
                type: "string"
            },
            {
                field: "displayName",
                label: "Name",
                type: "main",
                minWidth: 300

            },
            {
                field: "isCheckedIn",
                label: "Live",
                type: "boolean",
                minWidth: 120
            },
            {
                field: "phoneNumber",
                label: "Phone Number",
                type: "string",
                minWidth: 150
            },
            {
                field: "totalHoursWorked",
                label: "Total Hours Worked",
                type: "number",
                minWidth: 120
            },
            {
                field: "totalEarnings",
                label: "Total Earnings",
                type: "number",
                minWidth: 120
            },
            {
                field: "checkInCount",
                label: "No. of days",
                type: "number",
                minWidth: 120
            },
            {
                field: "totalSessionCount",
                label: "No. of Sessions",
                type: "number",
                minWidth: 120
            },
            {
                field: "lastActivity",
                label: "Latest Activity",
                type: "string",
                minWidth: 200
            },
            {
                field: "actions",
                label: "Actions",
                type: "actions",
                action: {
                    edit: {
                        label: 'Check Activity',
                        icon: 'material-symbols:eye-tracking-outline-rounded',
                        color: theme.palette.primary.main,
                        action: handleEditRow,
                    },
                    assignProduct: {
                        label: 'Assign Product',
                        color: theme.palette.info.main,
                        icon: 'fluent-mdl2:product-variant',
                        action: (id: string) => handleAssignProductsToUser([id]),
                    },
                }
            }


        ]
        return cols.map((c, i) => ({ ...c, order: i + 1 }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers])


    const cleanedUsers = useMemo(() => {
        if (!Array.isArray(campaignUsers)) return []
        const filtered = formatFilterAndRemoveFields(
            campaignUsers,
            // @ts-expect-error expected
            ["__typename"],
            [
                {
                    key: "updatedAt",
                    formatter: fDateTime,
                },
                {
                    key: "createdAt",
                    formatter: fDateTime,
                },
                {
                    key: "lastActivity",
                    formatter: fDateTime
                },
                // {
                //     key: "active",
                //     formatter: (v) => {
                //         if (isString(v)) {
                //             return v.toLowerCase() === "yes"
                //         }
                //         return false
                //     },
                // },

            ],
            undefined,
            ["name", "creator"]
        ) ?? []
        return filtered
    }, [campaignUsers])



    const totalLiveUsers = useMemo(() => cleanedUsers.filter(x => x.isCheckedIn).length, [cleanedUsers])

    const onSubmit = handleSubmit(async (data) => {
        if (data.snapshotDateTime) {
            setSnapShotDateTime(data.snapshotDateTime)
        } else {
            console.log(data, "SNAPSHOT")
        }
    })

    return (
        <>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack rowGap={2}>
                    <Grid container spacing={3}>
                        <Grid xs={12} display="flex" justifyContent="space-evenly" >
                            <Stack>
                                {!mdUp &&

                                    <Controller
                                        name="snapshotDateTime"
                                        control={control}
                                        render={({ field }) => <MobileDateTimePicker
                                            {...field}
                                            value={field.value ? new Date(field.value) : new Date()}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    field.onChange(fTimestamp(newValue));
                                                }
                                            }}
                                            label="Snapshot Date"
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
                                }
                                {mdUp &&

                                    <Controller
                                        name="snapshotDateTime"
                                        control={control}
                                        render={({ field }) => <DesktopDateTimePicker
                                            {...field}
                                            value={field.value ? new Date(field.value) : new Date()}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    field.onChange(fTimestamp(newValue));
                                                }
                                            }}
                                            label="Date"
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
                                }
                                <StyledLabel>{changedSnapshot ? formatDifference(new Date(changedSnapshot)) : formatDifference(new Date())}</StyledLabel>
                            </Stack>
                            <Stack direction="row" spacing={1} height="max-content" justifyContent="space-between">
                                <Button color="error" onClick={() => {
                                    setValue("snapshotDateTime", new Date())
                                }} variant="soft" >
                                    Clear
                                </Button>
                                <LoadingButton type="submit" loading={isSubmitting || showActivityLoader || showCampaignKPIMetricsLoader} color="success" variant="contained">
                                    Get Snapshot
                                </LoadingButton>
                            </Stack>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL LIVE USERS")}
                                title="Total Live Users"
                                total={totalLiveUsers ?? 0}
                                color="error"
                                icon={<SystemIcon type="live" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL REACH")}
                                title="Total Checkins Today"
                                total={campaignKPIMetrics?.totalUsersCheckedInToday ?? 0}
                                color="warning"
                                icon={<SystemIcon type="todayCheckin" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL USERS IN CAMPAIGN")}
                                title="Total Campaign Users"
                                total={campaignKPIMetrics?.totalUsersInCampaign ?? 0}
                                color="info"
                                icon={<SystemIcon type="users" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>


                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL REACH")}
                                title="Total Customers Reached"
                                total={campaignKPIMetrics?.totalFilledReports ?? 0}
                                color="success"
                                icon={<SystemIcon type="reach" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL REACH")}
                                title="Reached Today"
                                total={campaignKPIMetrics?.dailyStats.reports ?? 0}
                                color="success"
                                icon={<SystemIcon type="reach" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>

                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL REACH")}
                                title="Sold Today"
                                total={campaignKPIMetrics?.dailyStats.sales?.dailySales ?? 0}
                                color="success"
                                icon={<SystemIcon type="sale" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                        {/* <Grid xs={12} sm={6} md={2}>
                    <AnalyticsWidgetSummary
                        sx={{ width: "100%" }}
                        component={ButtonBase}
                        onClick={() => console.log("TOTAL SALES PER DAY")}
                        title="Average Sales per day"
                        total={campaignKPIMetrics?.dailyStats.sales?.dailySales ?? 0}
                        color="info"
                        icon={<SystemIcon type="average" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                    />
                </Grid>
                <Grid xs={12} sm={6} md={2}>
                    <AnalyticsWidgetSummary
                        sx={{ width: "100%" }}
                        component={ButtonBase}
                        onClick={() => console.log("TOTAL SALES PER DAY")}
                        title="Average Sales per day"
                        total={campaignKPIMetrics?.dailyStats.sales?.dailySales ?? 0}
                        color="info"
                        icon={<SystemIcon type="average" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                    />
                </Grid> */}
                    </Grid>
                    <Card
                        sx={{
                            height: { xs: 800, md: 600 },
                            flexGrow: { md: 1 },
                            display: { md: 'flex' },
                            flexDirection: { md: 'column' },
                        }}
                    >
                        {showLoader ? (
                            <LoadingScreen />
                        ) : cleanedUsers && (
                            <DataGridFlexible
                                data={cleanedUsers}
                                getRowIdFn={(row) => row._id.toString()}
                                columns={columns}
                                hideColumn={{ _id: false }}
                                title={`${campaign.title.split(" ").join("-")}-user-activity`}
                                customActions={{
                                    routes: {
                                        label: "Assign Routes",
                                        color: "info",
                                        icon: "eos-icons:route", // Assuming the icon is specified as a string identifier for Iconify
                                        action: (selectedData: ICampaignUser[]) => console.log(selectedData, "USERS TO ASSIGN ROUTES")
                                    },
                                    products: {
                                        label: "Assign Product",
                                        color: "info",
                                        icon: "fluent-mdl2:product-variant", // Assuming the icon is specified as a string identifier for Iconify
                                        action: handleBulkAssignProducts
                                    }
                                    // delete: {
                                    //     label: "Delete",
                                    //     color: "error",
                                    //     icon: "solar:trash-bin-trash-bold", // Assuming the icon is specified as a string identifier for Iconify
                                    //     action: (selectedData: ICampaignUser[]) => console.log(selectedData, "IDS FOR DELETION")
                                    // }
                                }}
                            />
                        )}
                    </Card>
                </Stack>
            </FormProvider>
            {
                selectedCampaignUsers && <AssignProductDialog
                    open={openAssign.value}
                    onClose={openAssign.onFalse}
                    campaignId={campaignId}
                    users={selectedCampaignUsers.map(x => ({ _id: x._id.toString(), name: `${x.firstname} ${x.lastname}` }))}
                    handleAssignNewProduct={() => console.log("ASSIGN")}
                />
            }
        </>
    );
}
