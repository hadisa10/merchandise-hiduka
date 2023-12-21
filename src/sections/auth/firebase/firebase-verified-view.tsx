'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { MotivationIllustration } from 'src/assets/illustrations';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function FirebaseVerifiedView() {

  const renderHead = (
    <>
      <MotivationIllustration sx={{ mb: 5 }} />

      <Typography variant="h3" sx={{ mb: 3 }}>
        Congratulations! <br /> You can now login
      </Typography>
    </>
  );

  return (
    <>
      {renderHead}

      <Button
        component={RouterLink}
        href={paths.auth.main.login ?? ''}
        size="large"
        color="inherit"
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        sx={{ alignSelf: 'center' }}
      >
        Login
      </Button>
    </>
  );
}
