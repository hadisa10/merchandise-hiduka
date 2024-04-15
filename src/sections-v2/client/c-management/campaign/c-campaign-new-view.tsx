'use client';



import { useState } from 'react';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import CampaignNewEditForm from 'src/sections/campaign/campaign-new-edit-form-tabs';


// ----------------------------------------------------------------------

export default function CampaignNewView() {
    const settings = useSettingsContext();

    // const { client } = useClientContext()

    // const usersloading = useBoolean(true)

    // const productsLoading = useBoolean(true);

    // const realmApp = useRealmApp();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>();

    // const [products, setProducts] = useState<IProductItem[] | undefined>(undefined);

    // const [users, setUsers] = useState<IUser[] | undefined>(undefined);

    // const showCampaignLoading = useShowLoader(usersloading.value && productsLoading.value, 300)

    // useEffect(() => {
    //     if (client?._id) {
    //         usersloading.onTrue()
    //         setError(null);
    //         realmApp.currentUser?.functions.getClientUsers(client?._id.toString()).then((usrs: IUser[]) => {
    //             setUsers(usrs.map(x => ({ ...x, _id: x._id.toString() })));
    //         })
    //             .catch(e => {
    //                 console.error(e)
    //                 setError(e);
    //                 enqueueSnackbar("Failed to get campaign details", { variant: "error" })
    //             }
    //             )
    //             .finally(() => usersloading.onFalse())
    //     }

    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [client?._id])


    return (
        <Container maxWidth={settings.themeStretch ? false : 'lg'}>
            <CampaignNewEditForm />
        </Container>
    );
}
