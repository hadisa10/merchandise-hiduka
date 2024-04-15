'use client';


import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import CampaignTabsView from 'src/sections-v2/client/c-management/campaign/c-campaign-tabs-view';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { IUser } from 'src/types/user_realm';
import { IProductItem } from 'src/types/product';
import { ICampaign } from 'src/types/realm/realm-types';


// ----------------------------------------------------------------------

export default function CampaignDetailsView({ id }: { id: string }) {
    const settings = useSettingsContext();

    const campaignloading = useBoolean(true);

    const productsLoading = useBoolean(true);

    const realmApp = useRealmApp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>();

    const [campaign, setCampaign] = useState<ICampaign | undefined>(undefined);

    const [products, setProducts] = useState<IProductItem[] | undefined>(undefined);

    const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    const showCampaignLoading = useShowLoader(campaignloading.value && productsLoading.value, 300)

    useEffect(() => {
        campaignloading.onTrue()
        setError(null);
        realmApp.currentUser?.functions.getSingleCampaign({ campaign_id: id }).then(({ campaign: cmpg, users: usrs }: { campaign: ICampaign, users: IUser[] }) => {
            setCampaign(cmpg)
            setUsers(usrs.map(x => ({ ...x, _id: x._id.toString() })));
        })
            .catch(e => {
                console.error(e)
                setError(e);
                enqueueSnackbar("Failed to get campaign details", { variant: "error" })
            }
            )
            .finally(() => campaignloading.onFalse())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        productsLoading.onTrue()
        setError(null);

        realmApp.currentUser?.functions.getCampaignsProducts(id).then((prds: IProductItem[]) => {
            setProducts(prds)
        })
            .catch(e => {
                console.error(e)
                setError(e);
                enqueueSnackbar("Failed to get products", { variant: "error" })
            }
            )
            .finally(() => productsLoading.onFalse())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {/* <CampaignNewEdit currentCampaign={campaign} /> */}
            {showCampaignLoading && <LoadingScreen />}
            {!showCampaignLoading && <CampaignTabsView currentCampaign={campaign} users={users} loading={showCampaignLoading} products={products} />}
        </Container>
    );
}
