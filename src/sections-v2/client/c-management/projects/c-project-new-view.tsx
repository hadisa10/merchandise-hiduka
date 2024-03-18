'use client';



import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Container from '@mui/material/Container';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { useSettingsContext } from 'src/components/settings';

import { IUser } from 'src/types/user_realm';

import CampaignTabsView from './c-projects-tabs-view';
import ProjectsTabsView from './c-projects-tabs-view';

// ----------------------------------------------------------------------

export default function ClientProjectNewView() {
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <ProjectsTabsView />
        </Container>
    );
}
