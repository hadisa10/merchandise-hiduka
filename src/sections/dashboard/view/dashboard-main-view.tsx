'use client';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';



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
