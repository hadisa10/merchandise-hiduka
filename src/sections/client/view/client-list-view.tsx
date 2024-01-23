"use client"

import React from "react";

import {
    List,
    Button,
    Container,
    Typography
} from "@mui/material";

import { useClients, useShowLoader, useDraftClients } from "src/hooks/realm";

import { getTodoId } from "src/utils/realm";

import Iconify from "src/components/iconify";
import { LoadingScreen } from "src/components/loading-screen";

import { ClientTableRow } from "../client-table-row";
import { ClientNewEditForm } from "../client-new-edit-form";

export default function ClientListView() {
    const { loading, clients, ...clientActions } = useClients();
    const { draftClients, ...draftClientActions } = useDraftClients();
    const showLoader = useShowLoader(loading, 200);
    return (
        <Container className="main-container" maxWidth="sm">
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
        </Container>
    );
}
