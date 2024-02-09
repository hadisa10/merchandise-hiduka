'use client';


import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import CampaignNewEdit from '../campaign-new-edit';

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

export default function UserCreateView() {
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>

      <CampaignNewEdit />
    </Container>
  );
}
