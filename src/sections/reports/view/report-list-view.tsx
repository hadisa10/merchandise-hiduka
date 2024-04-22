"use client"

import React from "react";

import {
    Container
} from "@mui/material";

import { useSettingsContext } from "src/components/settings";

import AdminReportListView from "./main/admin-report-list-view";

export default function ReportListView() {
    const settings = useSettingsContext();
    // const realmApp = useRealmApp();

    // const role = useMemo(() => realmApp.currentUser?.customData.role as unknown as IRole, [realmApp.currentUser?.customData.role])
    // const renderReportList = useCallback(() => {
    //     switch (role) {
    //         case 'admin':
    //             return <AdminReportListView />;
    //         case 'client':
    //             return <>CLIENT REPORT</>;
    //         case 'lead':
    //             return <>LEAD REPORT</>;
    //         case 'merchant':
    //             return <>MERCHANT REPORT</>;
    //         case 'brand_ambassador':
    //             return <>BRAND AMABASSADOR REPORT</>;
    //         default:
    //             return <View403 />
    //     }
    // }, [role])
    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            {/* {renderReportList()} */}
            <AdminReportListView />
        </Container>
    );
}
