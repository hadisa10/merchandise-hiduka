'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CampaignNewEditForm from '../campaign-new-edit-form';

// ----------------------------------------------------------------------

export default function UserCreateView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new campaign"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Campaign',
            href: paths.dashboard.campaign.root,
          },
          { name: 'New Campaign' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <CampaignNewEditForm />
    </Container>
  );
}
