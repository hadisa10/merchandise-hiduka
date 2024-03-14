"use client"

import { isEmpty, isString } from "lodash";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState, useEffect, useCallback } from "react";

import Grid from "@mui/material/Unstable_Grid2/Grid2";
import {
    Card,
    Stack, useTheme, ButtonBase
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";

import { fDateTime } from "src/utils/format-time";
import { formatFilterAndRemoveFields } from "src/utils/helpers";

import { useRealmApp } from "src/components/realm";
import { SystemIcon } from "src/components/iconify";
import { DataGridFlexible } from "src/components/data-grid";
import { LoadingScreen } from "src/components/loading-screen";
import { IGenericColumn } from "src/components/data-grid/data-grid-flexible";

import AnalyticsWidgetSummary from "src/sections/overview/analytics/analytics-widget-summary";

import { IUser, ICampaignUser } from "src/types/user_realm";
import { ICampaign, ICampaignKPIMetricsResponse } from "src/types/realm/realm-types";

import AssignProductDialog from "./assign-product-dialog";

interface IUserActivityDataGridProps {
    campaign: ICampaign;
    handleOpenCheckInRouteView?: (user: IUser) => void;
}

export default function UserActivityDataGrid({ campaign, handleOpenCheckInRouteView }: IUserActivityDataGridProps) {
    // const { loading, clients } = useClients(false);

    const theme = useTheme();

    const loadingCampaignUsers = useBoolean()

    const openAssign = useBoolean();

    const realmApp = useRealmApp();

    const [campaignUsers, setCampaignUsers] = useState<ICampaignUser[]>([])

    const [campaignKPIMetrics, setCampaignKPIMetrics] = useState<ICampaignKPIMetricsResponse | null>(null)


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
        if (isString(campaignId) && !isEmpty(campaignId)) {
            loadingCampaignUsers.onTrue()
            setCampaignUsersError(null)
            realmApp.currentUser?.functions.getCampaignUsers(campaignId.toString())
                .then(res => {
                    setCampaignUsersError(null)
                    console.log(res, "RESPONSE")
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
    }, [campaignId])


    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId)) {
            campaignKPIMetricsLoading.onTrue()
            setCampaignUsersError(null)
            realmApp.currentUser?.functions.getCampaignKPIMetrics(campaignId.toString())
                .then((res: ICampaignKPIMetricsResponse) => {
                    setCampaignUsersError(null)
                    console.log(res, "RESPONSE")
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
    }, [campaignId])

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

    console.log(cleanedUsers, "CLEANED USERS")
    const totalLiveUsers = useMemo(() => cleanedUsers.filter(x => x.isCheckedIn).length, [cleanedUsers])

    console.log(campaignKPIMetrics, "CAMPAIGN KPI METRICS")

    return (
        <Stack rowGap={2}>
            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
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
                <Grid xs={12} sm={6} md={3}>
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
                <Grid xs={12} sm={6} md={3}>
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


                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        sx={{ width: "100%" }}
                        component={ButtonBase}
                        onClick={() => console.log("TOTAL REACH")}
                        title="Total Customers Reached"
                        total={campaignKPIMetrics?.totalFilledReports?.totalReports ?? 0}
                        color="success"
                        icon={<SystemIcon type="reach" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
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
                                action: (selectedData: ICampaignUser[]) => console.log(selectedData, "USERS TO ASSIGN PRODUCTS")
                            },
                            delete: {
                                label: "Delete",
                                color: "error",
                                icon: "solar:trash-bin-trash-bold", // Assuming the icon is specified as a string identifier for Iconify
                                action: (selectedData: ICampaignUser[]) => console.log(selectedData, "IDS FOR DELETION")
                            }
                        }}
                    />
                )}
            </Card>
            {
                selectedCampaignUsers && <AssignProductDialog
                    open={openAssign.value}
                    onClose={openAssign.onFalse}
                    campaignId={campaignId}
                    users={selectedCampaignUsers}
                    handleAssignNewProduct={() => console.log("ASSIGN")}
                />
            }
        </Stack>
    );
}
