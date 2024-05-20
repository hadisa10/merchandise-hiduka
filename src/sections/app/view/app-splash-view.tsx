'use client';

import React from 'react';

import { Container } from '@mui/system';

import { useRolePath } from 'src/hooks/use-path-role';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import AppCampaignList from '../app-campaign-list';

function UserAppView() {
  const settings = useSettingsContext();
  const rolePath = useRolePath();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'lg'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs
        heading="List"
        links={[
          { name: 'Dashboard', href: rolePath?.root },
          {
            name: 'User App',
            href: rolePath?.userApp.root,
          },
          { name: 'List' },
        ]}
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <AppCampaignList />
    </Container>
  );
}

export default UserAppView;
