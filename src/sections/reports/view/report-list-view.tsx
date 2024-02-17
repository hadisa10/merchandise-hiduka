"use client"

import React, { useMemo, useCallback, useState } from "react";

import {
    Container
} from "@mui/material";

import { useRealmApp } from "src/components/realm";
import { useSettingsContext } from "src/components/settings";

import { View403 } from "src/sections/error";

import { IRole } from "src/types/user_realm";
import AdminReportListView from "./admin/admin-report-list-view";

export default function ReportListView() {
    const settings = useSettingsContext();
    const realmApp = useRealmApp();

    const role = useMemo(() => realmApp.currentUser?.customData.role as unknown as IRole, [realmApp.currentUser?.customData.role])
    const renderReportList = useCallback(() => {
        switch (role) {
            case 'admin':
                return <AdminReportListView />;
            case 'client':
                return <>CLIENT REPORT</>;
            case 'lead':
                return <>LEAD REPORT</>;
            case 'merchant':
                return <>MERCHANT REPORT</>;
            case 'brand_ambassador':
                return <>BRAND AMABASSADOR REPORT</>;
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
            {renderReportList()}
        </Container>
    );
}
