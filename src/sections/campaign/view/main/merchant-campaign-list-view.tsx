"use client"

import React from "react";

import {
    List,
    Card
} from "@mui/material";

import { paths } from "src/routes/paths";

import { useShowLoader } from "src/hooks/realm";
import { useCampaigns } from "src/hooks/realm/campaign/use-campaign-graphql";

import { getTodoId } from "src/utils/realm";

import { LoadingScreen } from "src/components/loading-screen";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import { CampaignTableRow } from "../../campaign-table-row";

export default function CampaignMerchantListView() {
    const { loading, campaigns, ...campaignActions } = useCampaigns();
    const showLoader = useShowLoader(loading, 200);

    return (
        <>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    {
                        name: 'Campaign',
                        href: paths.dashboard.campaign.root,
                    },
                    { name: 'List' },
                ]}
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
                    <List style={{ width: "100%" }}>
                        {campaigns?.map((campaign) => (
                            <CampaignTableRow
                                key={getTodoId(campaign)}
                                campaign={campaign}
                                campaignActions={campaignActions}
                            />
                        ))}
                    </List>
                )}
            </Card>
        </>
    );
}
