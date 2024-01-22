'use client';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
    _analyticTasks,
    _analyticPosts,
    _analyticTraffic,
    _analyticOrderTimeline,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import DashboardAdminView from '../dashboard-admin-view';
import DashboardClientView from '../dashboard-client-view';
import DashboardLeadView from '../dashboard-lead-view';


// ----------------------------------------------------------------------

export default function DashboardView() {
    const settings = useSettingsContext();
    // const renderDashboard = (role: "admin" | "client" | "lead") => {
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
    // }
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
            {/* { renderDashboard("client") } */}
        </Container>
    );
}
