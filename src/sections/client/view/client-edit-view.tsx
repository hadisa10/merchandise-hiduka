'use client';


import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';
import { useClients, useShowLoader } from 'src/hooks/realm';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { IClient } from 'src/types/client';

import ClientEditTabs from '../client-edit-tabs';

// ----------------------------------------------------------------------

export const CAMPAIGN_PUBLISH_OPTIONS = [
    {
        value: 'published',
        label: 'Published',
    },
    {
        value: 'draft',
        label: 'Draft',
    },
];


// ----------------------------------------------------------------------

export default function ClientEditView({ id }: { id: string }) {
    const settings = useSettingsContext();

    const { getClient } = useClients();

    const loader = useBoolean();

    const showLoader = useShowLoader(loader.value, 500);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<any>(null);
    const [client, setClient] = useState<IClient | null>(null)

    useEffect(() => {
        loader.onTrue();
        setError(null);
        getClient(id).then(rep => setClient(rep)).catch(e => setError(e))
            .finally(() => loader.onFalse())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])



    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            {showLoader && <LoadingScreen />}
            {client && !showLoader && <ClientEditTabs currentClient={client} />}
        </Container>
    );
}
