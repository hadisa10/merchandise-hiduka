'use client';

import { useMemo, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';

import DashboardLeadView from '../dashboard-lead-view';
import DashboardAdminView from '../dashboard-admin-view';
import DashboardClientView from '../dashboard-client-view';


// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();

    const realmApp = useRealmApp();
    const role = useMemo(() => realmApp.currentUser?.customData.role ?? "lead", [realmApp.currentUser?.customData.role])
    const renderDashboard = useCallback(() => {
        switch (role) {
            case 'admin':
                return <DashboardAdminView />;
            case 'client':
                return <DashboardClientView />;
            case 'lead':
                return <DashboardLeadView />;
            default:
                return <>No Roles</>
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
