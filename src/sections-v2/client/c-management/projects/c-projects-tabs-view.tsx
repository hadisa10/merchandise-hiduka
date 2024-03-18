"use client"

import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation'
import React, { useState, Suspense, useEffect, useCallback } from "react";

import {
    Tab,
    Tabs,
    Stack,
    Container,
    Typography,
    IconButton
} from "@mui/material";

import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { ERole } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";

import { IUser } from "src/types/user_realm";
import { IProject } from "src/types/realm/realm-types";

import CFormProjectDetails from './forms/c-form-project-details';


export const PROJECT_DETAILS_TABS = [
    { value: 'details', label: 'Details' },
    { value: 'campaigns', label: 'Campaign' },

];

export default function ProjectsTabsView({ currentProject }: { currentProject?: IProject }) {
    const settings = useSettingsContext();

    const router = useRouter();

    const searchParams = useSearchParams();

    const searchTabValue = searchParams.get('tab')

    const [currentTab, setCurrentTab] = useState(searchTabValue ?? 'details');

    const { client } = useClientContext()

    const usersloading = useBoolean(true)

    const [users, setUsers] = useState<IUser[]>([])

    const realmApp = useRealmApp();
    
    useEffect(() => {
        if (client?._id) {
            usersloading.onTrue()
            realmApp.currentUser?.functions.getClientUsers(client?._id.toString()).then((usrs: IUser[]) => {
                setUsers(usrs.map(x => ({ ...x, _id: x._id.toString() })).filter(z => z.role === ERole.PROJECT_MANAGER ));
            })
                .catch(e => {
                    console.error(e)
                    enqueueSnackbar("Failed to get campaign details", { variant: "error" })
                }
                )
                .finally(() => usersloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client?._id])

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        console.log("CHANGE TAB")
        setCurrentTab(newValue);
        const tabParams = new URLSearchParams({
            tab: newValue,
        }).toString();

        const href = currentProject ? `${paths.v2.client.project.edit(currentProject._id.toString())}?${tabParams}` : `${paths.v2.client.project.new}?${tabParams}`;
        router.push(href);
    }, [currentProject, router]);

    const renderTabs = (
        <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
                mb: { xs: 1, md: 2 },
            }}
        >
            {PROJECT_DETAILS_TABS.map((tab) => (
                <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                // icon={
                //     tabErrors(tab.value)?.length > 1 ?
                //         <Label variant="soft" color='error'>{tabErrors(tab.value)?.length}</Label>
                //         :
                //         ''
                // }
                />
            ))}
        </Tabs>
    );


    return (
        <Container
            maxWidth={settings.themeStretch ? false : 'lg'}
            sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <Stack direction="row" spacing={3} alignItems="center">
                <IconButton color="error" onClick={() => router.replace(paths.v2.client.project.list)}>
                    <Iconify icon="ep:back" />
                </IconButton>
                <Typography textTransform="uppercase" color="text.secondary">{currentProject?.title ?? "New Campaign"}</Typography>
            </Stack>

            {renderTabs}
            {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><CFormProjectDetails currentProject={currentProject} loading={usersloading.value} users={users} /></Suspense>}
            {/* {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><CFormCampaignDetails currentCampaign={currentCampaign} users={users} loading={loading} /></Suspense>}
            {currentTab === 'products' && <Suspense fallback={<LoadingScreen />}><CFormCampaignProducts products={products} loading={loading} /></Suspense>}
            {currentTab === 'regions' && <Suspense fallback={<LoadingScreen />}><CFormCampaignRegions  /></Suspense>}
            {currentTab === 'teams' && <Suspense fallback={<LoadingScreen />}><CFormCampaignTeams campaign={currentCampaign} users={users} loading={loading} /></Suspense>} */}

        </Container>
    );
}
