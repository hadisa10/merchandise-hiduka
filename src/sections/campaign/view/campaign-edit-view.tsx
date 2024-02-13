'use client';


import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import CampaignNewEdit from '../campaign-new-edit';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';
import { useShowLoader } from 'src/hooks/realm';
import { useMemo } from 'react';
import { ICampaign } from 'src/types/realm/realm-types';
import { LoadingScreen } from 'src/components/loading-screen';

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

  const { loading, campaigns } = useCampaigns();
  const showLoader = useShowLoader(loading, 500);
  const campaign = useMemo<ICampaign | null>(() => {
    if (!loading && Array.isArray(campaigns)) {
      const cmpg = campaigns.find(c => c._id.toString() === id);
      if (cmpg) return cmpg;
    }
    return null;
  }, [id, loading, campaigns])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {showLoader && <LoadingScreen />}
      {campaign && !showLoader && <CampaignNewEdit currentCampaign={campaign} />}
    </Container>
  );
}
