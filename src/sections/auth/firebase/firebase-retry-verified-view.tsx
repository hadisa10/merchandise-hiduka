'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { isObject, isString } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';

import { Stack } from '@mui/system';
import { Alert, LoadingButton } from '@mui/lab';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import ForbiddenIllustration from 'src/assets/illustrations/forbidden-illustration';

import { useRealmApp } from 'src/components/realm';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

// ----------------------------------------------------------------------

export default function FirebaseVerifiedView() {

  const realmApp = useRealmApp();

  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const RegisterSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),

  });

  const defaultValues = {

    email: '',

  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await realmApp.resendConfirmationEmail(data.email);
      const searchParams = new URLSearchParams({
        email: data.email,
      }).toString();

      const href = `${paths.auth.main.verify}?${searchParams}`;

      router.push(href);
    } catch (error) {
      console.error(error);
      reset();
      if (isObject(error) && "error" in error && isString(error.error)) {
        setErrorMsg(error?.error);
      } else {
        setErrorMsg(typeof error === 'string' ? error : error?.message);
      }
    }
  });

  const renderHead = (
    <>
      <ForbiddenIllustration sx={{ height: 200, my: { xs: 5, sm: 10 } }} />

      <Typography variant="h4" sx={{ mb: 2 }}>
        Failed to verify email.<br /> Try again.
      </Typography>
    </>
  );
  const renderForm = (
    <Stack spacing={2.5}>


      <RHFTextField name="email" label="Email address" />

      <LoadingButton
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Send email confirmation
      </LoadingButton>
    </Stack>
  );

  return (
    <>
      {renderHead}

      {!!errorMsg && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMsg}
        </Alert>
      )}

      <FormProvider methods={methods} onSubmit={onSubmit}>
        {renderForm}
      </FormProvider>
    </>
  );
}
