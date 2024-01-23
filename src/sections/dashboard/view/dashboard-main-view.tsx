'use client';

// import { useCallback, useMemo } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';

import { ClientListView } from 'src/sections/client/view';

// import { useRealmApp } from 'src/components/realm';
// import DashboardAdminView from '../dashboard-admin-view';
// import DashboardClientView from '../dashboard-client-view';
// import DashboardLeadView from '../dashboard-lead-view';


// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();

    // const realmApp = useRealmApp();
    // const role = useMemo(() => realmApp.currentUser?.customData.role ?? "lead", [])
    // const renderDashboard = useCallback(() => {
    //     switch (role) {
    //         case 'admin':
    //             return <DashboardAdminView />;
    //         case 'client':
    //             return <DashboardClientView />;
    //         case 'lead':
    //             return <DashboardLeadView />;
    //         default:
    //             return <>No Roles</>
    //     }
    // }, [role])
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
            {/* {renderDashboard()} */}
            <ClientListView />
        </Container>
    );
}
