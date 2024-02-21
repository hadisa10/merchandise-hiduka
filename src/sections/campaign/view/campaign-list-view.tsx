"use client"

import React, { useMemo, useCallback } from "react";

import {
    Container
} from "@mui/material";

import { useRealmApp } from "src/components/realm";
import { useSettingsContext } from "src/components/settings";

import { View403 } from "src/sections/error";

import { IRole } from "src/types/user_realm";

import CampaignLeadListView from "./main/lead-campaign-list-view";
import CampaignAdminListView from "./main/admin-campaign-list-view";
import CampaignClientListView from "./main/client-campaign-list-view";
import CampaignMerchantListView from "./main/merchant-campaign-list-view";

export default function CampaignListView() {
    const settings = useSettingsContext();
    const realmApp = useRealmApp();

    const role = useMemo(() => realmApp.currentUser?.customData.role as unknown as IRole, [realmApp.currentUser?.customData.role])
    const renderCampaignList = useCallback(() => {
        switch (role) {
            case 'admin':
                return <CampaignAdminListView />;
            case 'client':
                return <CampaignClientListView />;
            case 'lead':
                return <CampaignLeadListView />;
            case 'merchant':
                return <CampaignMerchantListView />;
            case 'brand_ambassador':
                return <CampaignMerchantListView />;
            default:
                return <View403 />
        }
    }, [role])
    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {renderCampaignList()}
        </Container>
    );
}
