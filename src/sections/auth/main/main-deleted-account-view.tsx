'use client';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { CheckoutIllustration } from 'src/assets/illustrations';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MainDeletedAccountView() {
  const renderHead = (
    <>
      <CheckoutIllustration sx={{ mb: 5 }} />

      <Typography variant="h3" sx={{ mb: 3 }}>
        Account deleted! <br /> Thank you for using hokela.
        <br /> We hope to see you again soon
      </Typography>
    </>
  );

  return (
    <>
      {renderHead}

      <Button
        component={RouterLink}
        href={paths.auth.main.register ?? ''}
        size="large"
        color="inherit"
        variant="contained"
        startIcon={<Iconify icon="eva:arrow-ios-back-fill" />}
        sx={{ alignSelf: 'center' }}
      >
        Back to register
      </Button>
    </>
  );
}
