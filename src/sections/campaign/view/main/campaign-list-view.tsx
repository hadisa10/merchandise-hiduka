"use client"

import React, { useMemo } from "react";

import {
    Button
} from "@mui/material";

import { paths } from "src/routes/paths";
import { RouterLink } from "src/routes/components";

import { getRolePath } from "src/utils/helpers";

import Iconify from "src/components/iconify";
import { useRealmApp } from "src/components/realm";
import CustomBreadcrumbs from "src/components/custom-breadcrumbs";

import CampaignListDataGrid from "../../list/campaigns/campaign-list-data-grid";

export default function CampaignList() {
    const { currentUser } = useRealmApp();

    const role = useMemo(() => currentUser?.customData?.role as unknown as string, [currentUser?.customData?.role])
  
    const rolePath = getRolePath(role);
    return (
        <>
            <CustomBreadcrumbs
                heading="List"
                links={[
                    { name: 'Dashboard', href: paths.dashboard.root },
                    {
                        name: 'Campaign',
                        // @ts-expect-error expected
                        href: rolePath.campaign.root,
                    },
                    { name: 'List' },
                ]}
                action={
                    <Button
                        component={RouterLink}
                        // @ts-expect-error expected
                        href={rolePath.campaign.new}
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
            <CampaignListDataGrid />
        </>
    );
}
