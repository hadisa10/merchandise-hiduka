'use client';

import { isEmpty, isString } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { NotFoundView } from 'src/sections/error';

import { ICampaign } from 'src/types/realm/realm-types';

import CampaignNewEdit from '../campaign-new-edit-form-tabs';

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

export default function CampaignEditView({ id }: { id: string }) {
  const settings = useSettingsContext();

  const loading = useBoolean(true);

  const realmApp = useRealmApp();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [campaignError, setCampaignError] = useState<unknown>(null);
  const [campaign, setCampaign] = useState<ICampaign | undefined>(undefined);
  const showLoader = useShowLoader(loading.value, 100);

  useEffect(() => {
    if (isString(id) && !isEmpty(id)) {
      loading.onTrue();
      setCampaignError(null);
      realmApp.currentUser?.functions
        .getCampaign({ campaign_id: id })
        .then((res: ICampaign) => {
          if (!res._id) throw new Error(JSON.stringify(res));
          setCampaign(res);
        })
        .catch((e) => {
          enqueueSnackbar('Failed to fetch campaign', { variant: 'error' });
          setCampaignError(e.message);
          console.error(e, 'REPORT FETCH');
        })
        .finally(() => {
          loading.onFalse();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  console.log(campaign, 'campaign');

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {showLoader && <LoadingScreen />}
      {campaign && !showLoader && <CampaignNewEdit currentCampaign={campaign} />}
      {!campaign && !showLoader && <NotFoundView />}
    </Container>
  );
}
