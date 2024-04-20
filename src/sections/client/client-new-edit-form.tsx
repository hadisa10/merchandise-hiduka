import * as Yup from 'yup';
import * as Realm from 'realm-web';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { Chip, Paper } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useClients } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import { fData } from 'src/utils/format-number';
import { createObjectId } from 'src/utils/realm';

import { _userPlans } from 'src/_mock';
import { PlanFreeIcon, PlanPremiumIcon, PlanStarterIcon } from 'src/assets/icons';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IRole } from 'src/types/user_realm';
import { IClient, IDraftClient } from 'src/types/client';

// ----------------------------------------------------------------------

type Props = {
  currentClient?: IClient;
};

export default function ClientNewEditForm({ currentClient }: Props) {
  const router = useRouter();

  const realmApp = useRealmApp();

  const { users } = useUsers();

  const loading = useBoolean(true);

  const [clients, setClients] = useState<IClient[] | null>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loading.onTrue();
    setError(null);
    realmApp.currentUser?.functions
      .getUserClients()
      .then((data: IClient[]) => setClients(data))
      .catch((e) => {
        console.error(e);
        setError(e);
        enqueueSnackbar('Failed to get your clients', { variant: 'error' });
      })
      .finally(() => loading.onFalse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { saveClient } = useClients(true);

  const role = useMemo(
    () => realmApp.currentUser?.customData?.role as unknown as IRole,
    [realmApp.currentUser?.customData?.role]
  );

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    client_icon: Yup.mixed<any>().nullable().required('Icon is required'),
    client_plan: Yup.string().required('Plan is required'),
    // not required
    active: Yup.boolean(),
    users: Yup.lazy(() =>
      Yup.array()
        .of(Yup.string().required('User is required').email('Invalid email'))
        .min(1, 'Select atleas one user')
    ),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentClient?.name || '',
      client_icon: currentClient?.client_icon || '',
      client_plan: currentClient?.client_plan || '',
      active: currentClient?.active || true,
      children: currentClient?.children || [],
      parent: currentClient?.parent || '',
      users: currentClient?.users || [],
    }),
    [currentClient]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const values = watch();

  const handleSelectPlan = (clientPlan: string) => {
    setValue('client_plan', clientPlan, { shouldValidate: true });
  };

  const renderPlans = useMemo(
    () =>
      _userPlans.map((plan) => (
        <Grid xs={12} md={4} key={plan.subscription}>
          <Stack
            component={Paper}
            variant="outlined"
            onClick={() => handleSelectPlan(plan.subscription)}
            sx={{
              p: 2.5,
              position: 'relative',
              cursor: 'pointer',
              ...(plan.primary && {
                opacity: 0.48,
                cursor: 'default',
              }),
              ...(plan.subscription?.toLowerCase() === values.client_plan?.toLowerCase() && {
                boxShadow: (theme) => `0 0 0 2px ${theme.palette.text.primary}`,
              }),
            }}
          >
            {plan.primary && (
              <Label
                color="info"
                startIcon={<Iconify icon="eva:star-fill" />}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                Current
              </Label>
            )}

            <Box sx={{ width: 48, height: 48 }}>
              {plan.subscription === 'basic' && <PlanFreeIcon />}
              {plan.subscription === 'starter' && <PlanStarterIcon />}
              {plan.subscription === 'premium' && <PlanPremiumIcon />}
            </Box>

            <Box
              sx={{
                typography: 'subtitle2',
                mt: 2,
                mb: 0.5,
                textTransform: 'capitalize',
              }}
            >
              {plan.subscription}
            </Box>

            <Stack direction="row" alignItems="center" sx={{ typography: 'h4' }}>
              {plan.subscription !== 'basic' && 'Ksh '}
              {plan.price || 'Free'}

              {!!plan.price && (
                <Box component="span" sx={{ typography: 'body2', color: 'text.disabled', ml: 0.5 }}>
                  /mo
                </Box>
              )}
            </Stack>
          </Stack>
        </Grid>
      )),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values]
  );

  const onSubmit = handleSubmit(async (data) => {
    try {
      const cpPhotoURL = data.client_icon?.path ?? 'none';
      const dt = new Date();
      if (!currentClient) {
        if (realmApp.currentUser?.customData._id) {
          const newClient: IDraftClient = {
            ...data,
            _id: createObjectId(),
            creator: {
              _id: realmApp.currentUser?.customData._id as Realm.BSON.ObjectId,
              name: realmApp.currentUser?.customData.displayName as string,
              email: realmApp.currentUser?.customData.email as string,
            },
            users:
              data.users?.map((usr) => ({
                email: usr,
                verified: false,
                dateAdded: dt,
              })) ?? [],
            active: data.active ?? false,
            client_icon: cpPhotoURL,
          };
          await saveClient(newClient);

          console.log(data, 'DATA');
          router.push(paths.dashboard.client.root);
          enqueueSnackbar('Client Created');
          reset();
        }

        return await new Promise((resolve) => setTimeout(resolve, 500));
      }
      enqueueSnackbar(currentClient ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
      reset();
      return await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (e) {
      enqueueSnackbar(currentClient ? 'Update failed!' : 'Update Failed!', { variant: 'error' });
      console.error(e);
      return await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('client_icon', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentClient && (
              <Label
                color={(values.active && 'success') || (!values.active && 'error') || 'error'}
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.active ? 'Active' : 'In Active'}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="client_icon"
                maxSize={3145728}
                onDrop={handleDrop}
                helperText={
                  <Typography
                    variant="caption"
                    sx={{
                      mt: 3,
                      mx: 'auto',
                      display: 'block',
                      textAlign: 'center',
                      color: 'text.disabled',
                    }}
                  >
                    Allowed *.jpeg, *.jpg, *.png, *.gif
                    <br /> max size of {fData(3145728)}
                  </Typography>
                }
              />
            </Box>

            {currentClient && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="active"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    )}
                  />
                }
                label={
                  <>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Banned
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Apply disable account
                    </Typography>
                  </>
                }
                sx={{ mx: 0, mb: 3, width: 1, justifyContent: 'space-between' }}
              />
            )}

            <RHFSwitch
              name="active"
              labelPlacement="start"
              label={
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Active
                </Typography>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentClient && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" disabled={role !== 'admin'}>
                  Delete Client
                </Button>
              </Stack>
            )}
          </Card>
        </Grid>

        <Grid xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Name" />
              <RHFAutocomplete
                name="users"
                label="Users"
                placeholder="+ users"
                multiple
                freeSolo
                disableCloseOnSelect
                options={users}
                getOptionLabel={(option) => (typeof option === 'string' ? option : option.email)}
                isOptionEqualToValue={(option, value) => option.email === value.email}
                onChange={(event, value) => {
                  // Assuming `setValue` is available in the component's scope,
                  // e.g., from useForm() hook or passed as a prop
                  const emails = value.map((val) => (typeof val === 'string' ? val : val.email));
                  setValue('users', emails, { shouldValidate: true });
                }}
                renderOption={(props, option) => (
                  <li {...props} key={option._id}>
                    {option.email}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option._id} // Ensure keys are unique if option is a string or has no `_id`
                      label={typeof option === 'string' ? option : option.email}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />

              <RHFAutocomplete
                name="client_id"
                label="Client"
                placeholder="Select client"
                loading={loading.value}
                freeSolo
                options={clients?.map((clnt) => clnt._id?.toString()) ?? []}
                getOptionLabel={(option) => {
                  const client = clients?.find(
                    (clnt) => clnt._id?.toString() === option.toString()
                  );
                  if (client) {
                    return client?.name;
                  }
                  return option;
                }}
                renderOption={(props, option) => {
                  const client = clients?.filter(
                    (clnt) => clnt._id?.toString() === option.toString()
                  )[0];

                  if (!client?._id) {
                    return null;
                  }

                  return (
                    <li {...props} key={client?._id?.toString()}>
                      {client?.name}
                    </li>
                  );
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => {
                    const client = clients?.find((clnt) => clnt._id?.toString() === option);
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        key={client?._id?.toString() ?? ''}
                        label={client?.name ?? ''}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    );
                  })
                }
              />
            </Box>
            <Grid
              container
              spacing={2}
              sx={{ my: 4, mx: 0.5, p: 1 }}
              border={(theme) =>
                `1px ${
                  errors.client_plan ? theme.palette.error.main : theme.palette.text.disabled
                } dashed`
              }
              borderRadius={1}
            >
              {renderPlans}
              {errors.client_plan && (
                <Typography color="error" variant="caption" marginLeft={1}>
                  Select a client plan
                </Typography>
              )}
            </Grid>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentClient ? 'Create Client' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
