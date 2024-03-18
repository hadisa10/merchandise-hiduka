'use client';


import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';

import { IProject } from 'src/types/realm/realm-types';

import ProjectTabsView from './c-projects-tabs-view';

// ----------------------------------------------------------------------

export default function ClientProjectsDetailsView({ id }: { id: string }) {
    const settings = useSettingsContext();

    const projectloading = useBoolean(true);

    const realmApp = useRealmApp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>();

    const [project, setProject] = useState<IProject | undefined>(undefined);


    const showProjectLoading = useShowLoader(projectloading.value, 300)

    useEffect(() => {
        projectloading.onTrue()
        setError(null);
        realmApp.currentUser?.functions.getSingleProject(id).then((prj: IProject) => {
            setProject(prj)
        })
            .catch(e => {
                console.error(e)
                setError(e);
                enqueueSnackbar("Failed to get project details", { variant: "error" })
            }
            )
            .finally(() => projectloading.onFalse())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {/* <CampaignNewEdit currentCampaign={campaign} /> */}
            {!showProjectLoading && <ProjectTabsView currentProject={project} loading={showProjectLoading}/>}
        </Container>
    );
}
