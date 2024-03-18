"use client"

import React, { useMemo, useCallback } from "react";

import {
    Card,
    Button,
    Container
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from "src/routes/components";

import { useClients, useShowLoader } from "src/hooks/realm";

import { fDateTime } from "src/utils/format-time";
import { formatFilterAndRemoveFields } from "src/utils/helpers";

import Iconify from "src/components/iconify";
import { DataGridFlexible } from "src/components/data-grid";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";
import { IGenericColumn } from "src/components/data-grid/data-grid-flexible";

import { IClient } from "src/types/client";

export default function ClientListView() {
    const settings = useSettingsContext();

    const { loading, clients } = useClients(false);

    const showLoader = useShowLoader(loading, 200);

    const router = useRouter();

    // const handleDeleteRows = useCallback(() => {
    // const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id.toString()));

    // enqueueSnackbar('Delete success!');

    // setTableData(deleteRows);
    // }, [enqueueSnackbar, selectedRowIds, tableData]);

    const handleDeleteRows = useCallback((id: string) => {
        console.log(`${id} DELETED`)
    }, [])

    const handleEditRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.client.edit(id));
        },
        [router]
    );

    const handleViewRow = useCallback(
        (id: string) => {
            router.push(paths.dashboard.client.edit(id));
        },
        [router]
    );

    const columns: IGenericColumn<IClient>[] = useMemo(() => {
        const cols: Omit<IGenericColumn<IClient>, "order">[] = [
            {
                field: "_id",
                label: "id",
                type: "string"
            },
            {
                field: "name",
                label: "Name",
                type: "main",
                minWidth: 250

            },
            {
                field: "active",
                label: "Active",
                type: "boolean",
                minWidth: 80
            },
            {
                field: "client_plan",
                label: "Client plan",
                type: "select",
                minWidth: 100,
                valueOptions: [
                    {
                        value: "basic",
                        label: "Basic",
                        color: "default"
                    },
                    {
                        value: "starter",
                        label: "Starter",
                        color: "info"
                    },
                    {
                        value: "premium",
                        label: "Premium",
                        color: "success"
                    }
                ]
            },
            {
                field: "client_icon",
                label: "Client Icon",
                type: "image"
            },
            {
                field: "creator",
                label: "Creator",
                type: "string"
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
                    // view: handleViewRow,
                    // edit: handleEditRow,
                    // delete: handleDeleteRows,
                    view: {
                        label: 'View',
                        icon: 'solar:eye-bold',
                        action: handleViewRow,
                    },
                    edit: {
                        label: 'Edit',
                        icon: 'solar:pen-bold',
                        action: handleEditRow,
                    },
                    delete: {
                        label: 'Delete',
                        icon: 'solar:trash-bin-trash-bold',
                        action: handleDeleteRows,
                    },
                }
            }


        ]
        return cols.map((c, i) => ({ ...c, order: i + 1 }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const cleanedClients = useMemo(() => {
        if (!Array.isArray(clients)) return []
        const filtered = formatFilterAndRemoveFields(
            clients,
            // @ts-expect-error expected
            ["__typename", "users"],
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
        const t = filtered.map(f => ({ ...f, creator: f.creator.name }))
        return t
    }, [clients])


    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    {
                        name: 'Client',
                        href: paths.dashboard.client.root,
                    },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.dashboard.client.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        New Client
                    </Button>
                }
                sx={{
                    mb: {
                        xs: 3,
                        md: 5,
                    },
                }}
            />

            <Card
                sx={{
                    height: { xs: 800, md: 600 },
                    flexGrow: { md: 1 },
                    display: { md: 'flex' },
                    flexDirection: { md: 'column' },
                }}
            >
                {loading && showLoader ? (
                    <LoadingScreen />
                ) : (
                    // @ts-expect-error expected
                    <DataGridFlexible data={cleanedClients} getRowIdFn={(row) => row._id.toString()} columns={columns} hideColumn={{ _id: false }} title="Clients-Table" />
                )}
            </Card>
        </Container>
    );
}
