'use client';

import { useMemo } from 'react';

import Container from '@mui/material/Container';

import { useRolePath } from 'src/hooks/use-path-role';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { View403 } from 'src/sections/error';

import { IRole } from 'src/types/user_realm';

import ClientNewEditForm from '../client-new-edit-form';

// ----------------------------------------------------------------------

export default function ClientCreateView() {
  const settings = useSettingsContext();

  const realmApp = useRealmApp();

  const role = useMemo(
    () => realmApp.currentUser?.customData?.role as unknown as IRole,
    [realmApp.currentUser?.customData?.role]
  );

  const rolePath = useRolePath();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Create a new client"
        links={[
          {
            name: 'Dashboard',
            href: rolePath?.root,
          },
          {
            name: 'Client',
            // @ts-expect-error expected
            href: rolePath.client.root,
          },
          { name: 'New client' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {role !== 'admin' && <View403 />}
      {role === 'admin' && <ClientNewEditForm />}
    </Container>
  );
}
