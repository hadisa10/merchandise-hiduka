"use client"

import { useSearchParams } from 'next/navigation'
import React, { lazy, Suspense, useState, useCallback } from "react";

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

import Iconify from 'src/components/iconify';
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";

import { IUser } from "src/types/user_realm";
import { IProductItem } from 'src/types/product';
import { ICampaign } from "src/types/realm/realm-types";

const CFormCampaignDetails = lazy(() => import("./forms/ad-form-campaign-details"));
const CFormCampaignProducts = lazy(() => import("./forms/ad-form-campaign-products"));
const CFormCampaignRegions = lazy(() => import("./forms/ad-form-campaign-regions"));
const CFormCampaignTeams = lazy(() => import("./forms/ad-form-campaign-teams"));


export const CAMPAING_DETAILS_TABS = [
    { value: 'details', label: 'Details' },
    { value: 'products', label: 'Products' },
    { value: 'regions', label: 'Region' },
    { value: 'teams', label: 'Teams' }
];

export default function CampaignTabsView({ currentCampaign, users, products, loading }: { currentCampaign?: ICampaign, users?: IUser[], loading?: boolean, products?: IProductItem[] }) {
    const settings = useSettingsContext();

    const router = useRouter();

    const searchParams = useSearchParams();

    const searchTabValue = searchParams.get('tab')

    const [currentTab, setCurrentTab] = useState(searchTabValue ?? 'details');

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
        const tabParams = new URLSearchParams({
            tab: newValue,
        }).toString();

        const href = currentCampaign ? `${paths.v2.client.campaign.edit(currentCampaign._id.toString())}?${tabParams}` : `${paths.v2.client.campaign.new}?${tabParams}`;
        router.push(href);
    }, [currentCampaign, router]);

    const renderTabs = (
        <Tabs
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
                mb: { xs: 1, md: 2 },
            }}
        >
            {CAMPAING_DETAILS_TABS.map((tab) => (
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
                <IconButton color="error" onClick={() => router.replace(paths.v2.client.campaign.list)}>
                    <Iconify icon="ep:back" />
                </IconButton>
                <Typography textTransform="uppercase" color="text.secondary">{currentCampaign?.title ?? "New Campaign"}</Typography>
            </Stack>

            {renderTabs}
            {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><CFormCampaignDetails currentCampaign={currentCampaign} users={users} loading={loading} /></Suspense>}
            {currentTab === 'products' && <Suspense fallback={<LoadingScreen />}><CFormCampaignProducts products={products} loading={loading} /></Suspense>}
            {currentTab === 'regions' && <Suspense fallback={<LoadingScreen />}><CFormCampaignRegions  /></Suspense>}
            {currentTab === 'teams' && <Suspense fallback={<LoadingScreen />}><CFormCampaignTeams campaign={currentCampaign} users={users} loading={loading} /></Suspense>}

        </Container>
    );
}
