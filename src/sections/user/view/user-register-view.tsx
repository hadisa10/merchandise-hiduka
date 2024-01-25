'use client';

import Container from '@mui/material/Container';
import { use, useMemo } from 'react';


import { _userList } from 'src/_mock';
import { useRealmApp } from 'src/components/realm';

import { useSettingsContext } from 'src/components/settings';

import UserNewEditForm from 'src/sections/user/user-new-edit-form';

import { useRouter } from 'src/routes/hooks';

import { IUser } from 'src/types/user_realm';
import { paths } from 'src/routes/paths';
import { enqueueSnackbar } from 'notistack';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------


export default function UserRegistrationView() {
  const settings = useSettingsContext();

  const realmApp = useRealmApp();

  const router = useRouter();

  const currentUser: IUser | null = useMemo(() => {
    const usr = realmApp?.currentUser?.customData as unknown as IUser;
    if (!usr) return null;
    return {
      _id: usr._id,
      email: usr.email,
      isPublic: usr.isPublic,
      displayName: usr.displayName,
      city: usr.city,
      state: usr.state,
      about: usr.about,
      country: usr.country,
      address: usr.address,
      zipCode: usr.zipCode,
      role: usr.role,
      isRegistered: usr.isRegistered,
      phoneNumber: usr.phoneNumber,
      photoURL: usr.photoURL,
      active: usr.active,
      isVerified: usr.isVerified,
      company: usr.company,
      status: usr.status,
      createdAt: usr.createdAt,
      updatedAt: usr.updatedAt
    }

  }, [realmApp?.currentUser?.customData])
  const handleLogout = async () => {
    try {
      await realmApp.logOut();
      router.replace(paths.auth.main.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>


      <Button
        color="inherit"
        size="large"
        variant="contained"
        onClick={handleLogout}
      >
        Logout
      </Button>

      {
        currentUser && <UserNewEditForm currentUser={currentUser} />
      }

    </Container>
  );
}
