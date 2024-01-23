'use client';

import { useEffect } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useDraftTodos } from 'src/hooks/realm';
import { useTodos } from 'src/hooks/realm/use-todos-graphql';

import { useSettingsContext } from 'src/components/settings';

import { ClientsPage } from '../test-admin-admin-view';


// ----------------------------------------------------------------------

export default function DashboardView() {

    const { loading, todos, ...todoActions } = useTodos();

    const { draftTodos, ...draftTodoActions } = useDraftTodos();


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
    useEffect(() => {
        console.log(todos, 'TODOS')
    }, [loading])
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
            <ClientsPage />
        </Container>
    );
}
