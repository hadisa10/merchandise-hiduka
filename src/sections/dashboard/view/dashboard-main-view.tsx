'use client';

import { useMemo, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';

import { View403 } from 'src/sections/error';

import { IRole } from 'src/types/user_realm';

import DashboardLeadView from '../dashboard-lead-view';
import DashboardAdminView from '../dashboard-admin-view';
import DashboardClientView from '../dashboard-client-view';
import DashboardMerchantView from '../dashboard-merchant-view';


// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();

    const realmApp = useRealmApp();
    const role = useMemo(() => realmApp.currentUser?.customData.role as unknown as IRole, [realmApp.currentUser?.customData.role])
    const renderDashboard = useCallback(() => {
        switch (role) {
            case 'admin':
                return <DashboardAdminView />;
            case 'client':
                return <DashboardClientView />;
            case 'lead':
                return <DashboardLeadView />;
            case 'merchant':
                return <DashboardMerchantView />;
            case 'brand_ambassador':
                return <DashboardMerchantView />;
            default:
                return <View403 />
        }
    }, [role])
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Typography
                variant="h4"
                sx={{
                    mb: { xs: 3, md: 5 },
                }}
            >
                Hi, Welcome back 👋
            </Typography>
            {renderDashboard()}
        </Container>
    );
}
