"use client"

import React from "react";

import {
    Container
} from "@mui/material";

import { useSettingsContext } from "src/components/settings";

import CampaignList from "./main/campaign-list-view";

export default function CampaignListView() {
    const settings = useSettingsContext();

    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <CampaignList />
        </Container>
    );
}
