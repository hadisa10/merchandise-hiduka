"use client"

import { enqueueSnackbar } from "notistack";
import React, { useState, useEffect } from "react";

import {
    Button,
    Container
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { useBoolean } from "src/hooks/use-boolean";

import Iconify from "src/components/iconify";
import { useRealmApp } from "src/components/realm";
import { useClientContext } from "src/components/clients";
import { useSettingsContext } from "src/components/settings";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { ICampaign } from "src/types/realm/realm-types";

import ClientCampaignDataGrid from "./table/c-table-project";

export default function CampaignListView() {
    const settings = useSettingsContext();

    const campaignloading = useBoolean(true);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>()

    const realmApp = useRealmApp()

    const [campaigns, setCampaigns] = useState<ICampaign[] | null>(null)

    const { client } = useClientContext();


    useEffect(() => {
        if (client && client?._id) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getClientCampaigns({ client_id: client?._id.toString() }).then((data: ICampaign[]) => setCampaigns(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client])

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
                    { name: 'Dashboard', href: paths.v2.client.root },
                    {
                        name: 'Campaign',
                        href: paths.v2.client.campaign.root,
                    },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        href={paths.v2.client.campaign.new}
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                    >
                        New Campaign
                    </Button>
                }
                sx={{
                    mb: {
                        xs: 3,
                        md: 5,
                    },
                }}
            />
            <ClientCampaignDataGrid campaigns={campaigns} loading={campaignloading.value} />
        </Container>
    );
}
