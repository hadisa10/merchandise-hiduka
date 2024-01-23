"use client"

import React from "react";

import {
    List,
    Card,
    Button,
    Container,
    Typography
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useClients, useShowLoader, useDraftClients } from "src/hooks/realm";

import { getTodoId } from "src/utils/realm";

import Iconify from "src/components/iconify";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { ClientTableRow } from "../client-table-row";
import { ClientNewEditForm } from "../client-new-edit-form";

export default function ClientListView() {
    const settings = useSettingsContext();

    const { loading, clients, ...clientActions } = useClients();
    const { draftClients, ...draftClientActions } = useDraftClients();
    const showLoader = useShowLoader(loading, 200);
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
                    height: { xs: 800, md: 2 },
                    flexGrow: { md: 1 },
                    display: { md: 'flex' },
                    flexDirection: { md: 'column' },
                }}
            >
                {loading && showLoader ? (
                    <LoadingScreen />
                ) : (
                    <div className="todo-items-container">
                        <Typography component="p" variant="h5">
                            Clients
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<Iconify icon="mingcute:add-line" />}
                            onClick={() => draftClientActions.createDraftClient()}
                        >
                            Add Client
                        </Button>
                        <List style={{ width: "100%" }}>
                            {clients?.map((client) => (
                                <ClientTableRow
                                    key={getTodoId(client)}
                                    client={client}
                                    clientActions={clientActions}
                                />
                            ))}
                            {draftClients.map((draft) => (
                                <ClientNewEditForm
                                    key={getTodoId(draft)}
                                    draftClient={draft}
                                    clientActions={clientActions}
                                    draftClientActions={draftClientActions}
                                />
                            ))}
                        </List>
                    </div>
                )}
            </Card>
        </Container>
    );
}
