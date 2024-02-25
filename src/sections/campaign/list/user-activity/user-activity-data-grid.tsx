"use client"

import { isEmpty, isString } from "lodash";
import { enqueueSnackbar } from "notistack";
import React, { useMemo, useState, useEffect, useCallback } from "react";

import {
    Card
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";
import { useCampaigns } from "src/hooks/realm/campaign/use-campaign-graphql";

import { fDateTime } from "src/utils/format-time";
import { formatFilterAndRemoveFields } from "src/utils/helpers";

import { DataGridFlexible } from "src/components/data-grid";
import { LoadingScreen } from "src/components/loading-screen";
import { IGenericColumn } from "src/components/data-grid/data-grid-flexible";

import { IUser, ICampaignUser } from "src/types/user_realm";

interface IUserActivityDataGridProps {
    campaignId: string;
    handleOpenCheckInRouteView?: (user: IUser) => void;
}

export default function UserActivityDataGrid({ campaignId, handleOpenCheckInRouteView }: IUserActivityDataGridProps) {
    // const { loading, clients } = useClients(false);

    const { getCampaignUsers } = useCampaigns(true);

    const loadingCampaignUsers = useBoolean()

    const [campaignUsers, setCampaignUsers] = useState<ICampaignUser[]>([])

    // eslint-disable-next-line
    const [campaignUsersError, setCampaignUsersError] = useState(null)

    const showLoader = useShowLoader(loadingCampaignUsers.value, 500);

    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId)) {
            loadingCampaignUsers.onTrue()
            setCampaignUsersError(null)
            getCampaignUsers(campaignId.toString())
                .then(res => {
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
    }, [campaignId])

    const handleDeleteRows = useCallback((id: string) => {
        const user = campaignUsers.find(campaignUser => campaignUser._id.toString() === id.toString());
        if (user && handleOpenCheckInRouteView ) {
             handleOpenCheckInRouteView(user);
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

    const handleViewRow = useCallback(
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
                label: "Checked In",
                type: "boolean",
                minWidth: 120
            },

            {
                field: "checkInCount",
                label: "No. of Checkins",
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
                field: "createdAt",
                label: "Created At",
                type: "date"
            },
            {
                field: "updatedAt",
                label: "Updated At",
                type: "date"
            },
            {
                field: "actions",
                label: "Actions",
                type: "actions",
                action: {
                    view: handleViewRow,
                    edit: handleEditRow,
                    delete: handleDeleteRows,
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

    return (


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
                <DataGridFlexible data={cleanedUsers} getRowIdFn={(row) => row._id.toString()} columns={columns} hideColumn={{ _id: false }} />
            )}
        </Card>
    );
}
