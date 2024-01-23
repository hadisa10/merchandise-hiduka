"use client"

import React from "react";

import {
    List,
    Button,
    Container,
    Typography
} from "@mui/material";

import { useClients , useShowLoader , useDraftClients } from "src/hooks/realm";

import { getTodoId } from "src/utils/realm";

import Iconify from "src/components/iconify";
import { useRealmApp } from "src/components/realm";
import { LoadingScreen } from "src/components/loading-screen";

import { ClientItem } from "./ClientItem";
import { DraftClientItem } from "./DraftClientItem";

export function ClientsPage() {
    const { loading, clients, ...clientActions } = useClients();
    const { draftClients, ...draftClientActions } = useDraftClients();
    const showLoader = useShowLoader(loading, 200);
    const realmApp = useRealmApp();
    console.log(realmApp.currentUser, 'CURRENT USER')

    return (
        <Container className="main-container" maxWidth="sm">
            {loading ? (
                showLoader ? (
                    <LoadingScreen />
                ) : null
            ) : (
                <div className="todo-items-container">
                    <Typography component="p" variant="h5">
                        {`You have ${clients?.length} Client${clients?.length === 1 ? "" : "s"
                            }`}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={() => draftClientActions.createDraftClient()}
                    >
                        Add To-Do
                    </Button>
                    <List style={{ width: "100%" }}>
                        {clients?.map((client) => (
                            <ClientItem
                                key={getTodoId(client)}
                                client={client}
                                clientActions={clientActions}
                            />
                        ))}
                        {draftClients.map((draft) => (
                            <DraftClientItem
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
