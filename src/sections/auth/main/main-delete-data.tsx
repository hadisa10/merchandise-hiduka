'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box } from '@mui/system';
import { Chip } from '@mui/material';
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
import FormProvider, { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

// ----------------------------------------------------------------------

const data = [
  {
    id: '1',
    name: 'Personal Data',
  },
  {
    id: '2',
    name: 'Reports Data',
  },
  {
    id: '3',
    name: 'Sales Data',
  },
];

export default function MainDeleteDataView() {
  // const { forgotPassword } = useAuthContext();

  const confirmDelete = useBoolean(false);

  const router = useRouter();

  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email('Email must be a valid email address')
      .required('Email is required')
      .email('Email must be a valid email address'),
    data: Yup.array().min(1, 'Please select at least 1 data type'),
    deleteAccount: Yup.string()
      .required('Delete Data confirmation is required')
      .oneOf(['delete data'], 'The string must be exactly "delete account"'),
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

  const onSubmit = handleSubmit(async () => {
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
      <RHFAutocomplete
        name="data"
        fullWidth
        label="Delete Data"
        placeholder="+ data"
        multiple
        limitTags={2}
        freeSolo
        disableCloseOnSelect
        options={data.map((dt) => dt.id)}
        getOptionLabel={(option) => {
          const d = data?.find((dt) => dt.id === option);
          if (d) {
            return d?.name;
          }
          return option;
        }}
        renderOption={(props, option) => {
          const d = data?.filter((dt) => dt.id === option)[0];

          if (!d?.id) {
            return null;
          }

          return (
            <li {...props} key={d.id}>
              {d?.name}
            </li>
          );
        }}
        renderTags={(selected, getTagProps) =>
          selected.map((option, index) => {
            const d = data?.find((dt) => dt.id === option);
            return (
              <Chip
                {...getTagProps({ index })}
                key={d?.id ?? ''}
                label={d?.name ?? ''}
                size="small"
                color="info"
                variant="soft"
              />
            );
          })
        }
      />
      <Typography variant="caption">
        Enter the{' '}
        <Box component="span" color="error.main">
          delete data
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
        <Typography variant="h3">Delete your data</Typography>
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
