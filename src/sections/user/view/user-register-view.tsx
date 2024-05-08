'use client';

import { useMemo } from 'react';
import { enqueueSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import UserNewEditForm from 'src/sections/user/user-new-edit-form';

import { IUser } from 'src/types/user_realm';

// ----------------------------------------------------------------------

export default function UserRegistrationView() {
  const settings = useSettingsContext();

  const realmApp = useRealmApp();

  const router = useRouter();

  const loading = useBoolean();

  const currentUser: IUser | null = useMemo(() => {
    const usr = realmApp?.currentUser?.customData as unknown as IUser;
    if (!usr) return null;
    return {
      _id: usr._id,
      email: usr.email,
      isPublic: usr.isPublic,
      displayName: usr.displayName,
      firstname: '',
      lastname: '',
      city: usr.city,
      state: usr.state,
      about: usr.about,
      country: usr.country,
      address: usr.address,
      zipCode: usr.zipCode,
      role: usr.role,
      isRegistered: usr.isRegistered,
      phoneNumber: usr.phoneNumber,
      photoURL: usr.photoURL ?? '',
      isVerified: usr.isVerified,
      company: usr.company,
      status: usr.status,
      createdAt: usr.createdAt,
      updatedAt: usr.updatedAt,
    };
  }, [realmApp?.currentUser?.customData]);
  const handleLogout = async () => {
    try {
      loading.onTrue();
      await realmApp.logOut();
      loading.onFalse();
      router.replace(paths.auth.main.login);
    } catch (error) {
      loading.onFalse();
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'} sx={{ pb: 4 }}>
      <CustomBreadcrumbs
        heading="Complete Registration"
        links={[{ name: 'Login', href: paths.auth.main.login }, { name: 'Complete registration' }]}
        action={
          <LoadingButton
            color="error"
            variant="contained"
            onClick={handleLogout}
            loading={loading.value}
            startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
          >
            Cancel
          </LoadingButton>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {currentUser && <UserNewEditForm currentUser={currentUser} />}
    </Container>
  );
}
