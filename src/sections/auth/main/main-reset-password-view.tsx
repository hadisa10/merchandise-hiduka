'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Button, IconButton, InputAdornment } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';
import { useRouter, useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { PasswordIcon } from 'src/assets/icons';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function MainResetPasswordView() {

  const realmApp = useRealmApp()

  const router = useRouter();

  const searchParams = useSearchParams();

  const token = searchParams.get('token')

  const tokenId = searchParams.get('tokenId')

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const ForgotPasswordSchema = Yup.object().shape({
    password: Yup.string().min(8, "Too short").required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const defaultValues = {
    password: "",
    confirmPassword: ""
  };

  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data, "DATA")
      if (token && tokenId) {
        await realmApp.resetPassword({ token, tokenId, password: data.password });
      } else {
        throw new Error("Failed to reset password")
      }
      // console.log(test, "TEST")
      // console.log(data.email, "EMAIL")
      const href = paths.auth.main.login;
      enqueueSnackbar("Password reset successfully", { variant: "success" })

      router.push(href);
    } catch (error) {
      console.error(error);
      enqueueSnackbar(error?.error ?? "Failed to reset password", { variant: 'error' })
    }
  });

  const renderForm = (
    <Stack spacing={3} alignItems="center">
      <RHFTextField
        name="password"
        label="Password"
        type={password.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={password.onToggle} edge="end">
                <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <RHFTextField
        name="confirmPassword"
        label="Confirm Password"
        type={confirmPassword.value ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={confirmPassword.onToggle} edge="end">
                <Iconify icon={confirmPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting && realmApp.loading}
      >
        Reset Password
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
      <PasswordIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ mt: 3, mb: 5 }}>
        <Typography variant="h3">Reset your password</Typography>
      </Stack>
    </>
  );
  const renderFailedToReset = (
    <>
      <ForbiddenIllustration sx={{ height: 200, my: { xs: 5, sm: 10 } }} />

      <Typography variant="h4" sx={{ mb: 2 }}>
        Failed to reset password.<br /> Try again.
      </Typography>
      <Button
        component={RouterLink}
        href={paths.auth.main.forgotPassword}
        variant="contained"
      >
        Try again
      </Button>
    </>
  );

  return (
    <>
      {!(token && tokenId) && renderFailedToReset}
      {
        token && tokenId &&
        <>
          {renderHead}
          < FormProvider methods={methods} onSubmit={onSubmit}>
            {renderForm}
          </FormProvider >
        </>
      }

    </>
  );
}
