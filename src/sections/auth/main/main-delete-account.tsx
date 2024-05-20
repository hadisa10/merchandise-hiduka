'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/system';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function MainDeleteAccountView() {
  // const { forgotPassword } = useAuthContext();

  const confirmDelete = useBoolean(false);

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .email('Email must be a valid email address'),
    deleteAccount: Yup.string()
      .required('Delete Account is required')
      .oneOf(['delete account'], 'The string must be exactly "delete account"'),
  });

  const defaultValues = {
    email: '',
    deleteAccount: '',
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      reset();
      const href = `${paths.auth.main.deletedSuccess}`;
      router.push(href);
    } catch (error) {
      console.error(error);
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField name="email" label="Email address" />
      <Typography variant="caption">
        Enter the{' '}
        <Box component="span" color="error.main">
          delete account
        </Box>{' '}
        below to confirm
      </Typography>
      <RHFTextField name="deleteAccount" label="Confirm" />
      <LoadingButton
        type="submit"
        loading={isSubmitting}
        variant="contained"
        // onClick={() => console.log('TEST')}
        color="error"
      >
        Confirm Delete
      </LoadingButton>

      <Link
        component={RouterLink}
        href={paths.auth.main.login}
        color="inherit"
        variant="subtitle2"
        sx={{
          alignItems: 'center',
          display: 'inline-flex',
        }}
      >
        <Iconify icon="eva:arrow-ios-back-fill" width={16} />
        Return to sign in
      </Link>
    </Stack>
  );

  const renderHead = (
    <>
      <Box display="flex" justifyContent="center" alignItems="center" color="error.main">
        <Iconify icon="eva:trash-2-outline" width={50} />
      </Box>

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Delete your account</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Please enter the email address associated with your account to delete your account.
        </Typography>
        <Typography variant="body2" sx={{ color: 'error.main' }}>
          CAUTION: This action is irreversible.
        </Typography>
      </Stack>
    </>
  );

  return (
    <>
      {renderHead}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
        <ConfirmDialog
          open={confirmDelete.value}
          onClose={confirmDelete.onFalse}
          title="Delete"
          content={<Stack width="100%" spacing={2} rowGap={2} />}
          action={
            <LoadingButton
              type="submit"
              loading={isSubmitting}
              variant="contained"
              // onClick={() => console.log('TEST')}
              color="error"
            >
              Confirm Delete
            </LoadingButton>
          }
        />
      </FormProvider>
    </>
  );
}
