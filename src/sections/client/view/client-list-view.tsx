"use client"

import React, { useMemo } from "react";

import {
    Card,
    Button,
    Container
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useClients, useShowLoader } from "src/hooks/realm";

import { fDateTime } from "src/utils/format-time";
import { formatFilterAndRemoveFields } from "src/utils/helpers";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import DataGridFlexible from "src/sections/_examples/mui/data-grid-view/data-grid-flexible";


export default function ClientListView() {
    const settings = useSettingsContext();

    const { loading, clients } = useClients(false);
    const showLoader = useShowLoader(loading, 200);

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
                }
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
                    <DataGridFlexible data={cleanedClients} />
                    // <List style={{ width: "100%" }}>
                    //     {clients?.map((client) => (
                    //         <ClientTableRow
                    //             key={getTodoId(client)}
                    //             client={client}
                    //             clientActions={clientActions}
                    //         />
                    //     ))}
                    // </List>
                )}
            </Card>
        </Container>
    );
}
