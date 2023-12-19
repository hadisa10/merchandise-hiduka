'use client';

import * as Yup from 'yup';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { isObject, isString } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';

import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function FirebaseRegisterView() {
  const { loginWithGoogle, loginWithGithub, loginWithTwitter } = useAuthContext();

  const realmApp = useRealmApp();

  const [errorMsg, setErrorMsg] = useState('');

  const router = useRouter();

  const password = useBoolean();

  const confirmPassword = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    password: Yup.string().required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
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
      await realmApp.registerUser({ email: data.email, password: data.password, name: `${data.firstName} ${data.lastName}` });
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

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleGithubLogin = async () => {
    try {
      await loginWithGithub?.();
    } catch (error) {
      console.error(error);
    }
  };

  const handleTwitterLogin = async () => {
    try {
      await loginWithTwitter?.();
    } catch (error) {
      console.error(error);
    }
  };

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">Get started absolutely free</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> Already have an account? </Typography>

        <Link href={paths.auth.main.login} component={RouterLink} variant="subtitle2">
          Sign in
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        mt: 2.5,
        textAlign: 'center',
        typography: 'caption',
        color: 'text.secondary',
      }}
    >
      {'By signing up, I agree to '}
      <Link underline="always" color="text.primary">
        Terms of Service
      </Link>
      {' and '}
      <Link underline="always" color="text.primary">
        Privacy Policy
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <RHFTextField name="firstName" label="First name" />
        <RHFTextField name="lastName" label="Last name" />
      </Stack>

      <RHFTextField name="email" label="Email address" />

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
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        Create account
      </LoadingButton>
    </Stack>
  );

  const renderLoginOption = (
    <div>
      <Divider
        sx={{
          my: 2.5,
          typography: 'overline',
          color: 'text.disabled',
          '&:before, :after': {
            borderTopStyle: 'dashed',
          },
        }}
      >
        OR
      </Divider>

      <Stack direction="row" justifyContent="center" spacing={2}>
        <IconButton onClick={handleGoogleLogin}>
          <Iconify icon="eva:google-fill" color="#DF3E30" />
        </IconButton>

        <IconButton color="inherit" onClick={handleGithubLogin}>
          <Iconify icon="eva:github-fill" />
        </IconButton>

        <IconButton onClick={handleTwitterLogin}>
          <Iconify icon="eva:twitter-fill" color="#1C9CEA" />
        </IconButton>
      </Stack>
    </div>
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

      {renderTerms}

      {renderLoginOption}
    </>
  );
}
