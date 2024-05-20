'use client';

import { Stack } from '@mui/system';
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
      <CheckoutIllustration height={150} sx={{ mb: 5 }} />

      <Typography variant="h4" sx={{ mb: 3 }}>
        Request to delete account will be processed within the next 24 hours!
      </Typography>
      <Typography>
        <br /> Thank you for using hokela.
        <br /> We hope to see you again soon
      </Typography>
    </>
  );

  return (
    <Stack rowGap={2}>
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
    </Stack>
  );
}
