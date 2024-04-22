'use client';

import React from 'react';

import { Button, Container } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useRolePath } from 'src/hooks/use-path-role';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import CampaignListDataGrid from '../list/campaigns/campaign-list-data-grid';

export default function CampaignListView() {
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
            name: 'Campaign',
            // @ts-expect-error expected
            href: rolePath?.campaign.root,
          },
          { name: 'List' },
        ]}
        action={
          <Button
            component={RouterLink}
            // @ts-expect-error expected
            href={rolePath?.campaign.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            New Campaign
          </Button>
        }
        sx={{
          mb: {
            xs: 3,
            md: 5,
          },
        }}
      />
      <CampaignListDataGrid />
    </Container>
  );
}
