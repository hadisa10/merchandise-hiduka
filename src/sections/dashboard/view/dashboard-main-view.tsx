'use client';

import { useMemo, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';

import { View403 } from 'src/sections/error';

import { IRole } from 'src/types/user_realm';



// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();

    const realmApp = useRealmApp();

    
    const role = useMemo(() => realmApp.currentUser?.customData.role as unknown as IRole, [realmApp.currentUser?.customData.role])
    const renderDashboard = useCallback(() => {
        switch (role) {
            case 'admin':
                // return <DashboardAdminView />;
                return <>ADMINISTRATIVE VIEW</>;
            case 'client':
                // return <DashboardClientView />;
                return <>CLIENT VIEW</>;
            case 'lead':
                // return <DashboardLeadView />;
                return <>LEAD VIEW</>;
            case 'merchant':
                return <>MERCHANT VIEW</>;
                // return <DashboardMerchantView />;
            case 'brand_ambassador':
                return <>BRAND AMBASSADOR VIEW</>;
                // return <DashboardMerchantView />;
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
