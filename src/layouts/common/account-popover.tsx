import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import { alpha } from '@mui/material/styles';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { varHover } from 'src/components/animate';
import { useRealmApp } from 'src/components/realm';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useMemo } from 'react';
import { IUserAccount } from 'src/types/user';

// ----------------------------------------------------------------------

const OPTIONS = [
  {
    label: 'Home',
    linkTo: '/',
  },
  {
    label: 'Profile',
    linkTo: paths.dashboard.user.profile,
  },
  {
    label: 'Settings',
    linkTo: paths.dashboard.user.account,
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const router = useRouter();

  const realmApp = useRealmApp();

  const realmUser = useMemo(() => {
    const cpUser: IUserAccount = {
      about: realmApp.currentUser?.customData?.about as string ?? 'User',
      address: realmApp.currentUser?.customData?.address as string ?? 'Address',
      city: realmApp.currentUser?.customData?.city as string ?? 'city',
      country: realmApp.currentUser?.customData?.country as string ?? 'country',
      displayName: realmApp.currentUser?.customData?.displayName as string ?? 'name',
      email: realmApp.currentUser?.customData?.email as string ?? 'email',
      isPublic: realmApp.currentUser?.customData?.about as boolean ?? true,
      phoneNumber: realmApp.currentUser?.customData?.phoneNumber as string ?? 'phoneNumber',
      photoURL: realmApp.currentUser?.customData?.photoURL as string ?? 'photoURL',
      role: realmApp.currentUser?.customData?.role as string ?? 'role',
      state: realmApp.currentUser?.customData?.state as string ?? 'state',
      zipCode: realmApp.currentUser?.customData?.about as string ?? 'zipCode',
    }
    return cpUser;
  }, [realmApp.currentUser?.customData])

  const { enqueueSnackbar } = useSnackbar();

  const popover = usePopover();

  const handleLogout = async () => {
    try {
      console.log("TEST")
      await realmApp.logOut();
      popover.onClose();
      router.replace(paths.auth.main.login);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Unable to logout!', { variant: 'error' });
    }
  };

  const handleClickItem = (path: string) => {
    popover.onClose();
    router.push(path);
  };

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        onClick={popover.onOpen}
        sx={{
          width: 40,
          height: 40,
          background: (theme) => alpha(theme.palette.grey[500], 0.08),
          ...(popover.open && {
            background: (theme) =>
              `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.main} 100%)`,
          }),
        }}
      >
        <Avatar
          src={realmUser?.photoURL as string}
          alt={realmUser?.displayName}
          sx={{
            width: 36,
            height: 36,
            border: (theme) => `solid 2px ${theme.palette.background.default}`,
          }}
        >
          {realmUser?.displayName.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 200, p: 0 }}>
        <Box sx={{ p: 2, pb: 1.5 }}>
          <Typography variant="subtitle2" noWrap>
            {realmUser?.displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {realmUser?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleClickItem(option.linkTo)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem
          onClick={handleLogout}
          sx={{ m: 1, fontWeight: 'fontWeightBold', color: 'error.main' }}
        >
          Logout
        </MenuItem>
      </CustomPopover>
    </>
  );
}
