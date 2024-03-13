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

import CampaignTabsView from './c-campaign-tabs-view';

// ----------------------------------------------------------------------

export default function CampaignNewView() {
    const settings = useSettingsContext();

    const { client } = useClientContext()

    const usersloading = useBoolean(true)

    const productsLoading = useBoolean(true);

    const realmApp = useRealmApp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>();

    // const [products, setProducts] = useState<IProductItem[] | undefined>(undefined);

    const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    const showCampaignLoading = useShowLoader(usersloading.value && productsLoading.value, 300)

    useEffect(() => {
        if (client?._id) {
            usersloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getClientUsers(client?._id.toString()).then((usrs: IUser[]) => {
                setUsers(usrs.map(x => ({ ...x, _id: x._id.toString() })));
            })
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get campaign details", { variant: "error" })
                }
                )
                .finally(() => usersloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client?._id])


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CampaignTabsView users={users} loading={showCampaignLoading}/>
        </Container>
    );
}
