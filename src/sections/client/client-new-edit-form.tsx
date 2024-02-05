import * as Yup from 'yup';
import { useMemo, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import { fData } from 'src/utils/format-number';

import { countries } from 'src/assets/data';

import Label from 'src/components/label';
import { useRealmApp } from 'src/components/realm';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSwitch,
  RHFSelect,
  RHFTextField,
  RHFUploadAvatar,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { IRole, IUser } from 'src/types/user_realm';

// ----------------------------------------------------------------------

type Props = {
  currentUser?: IUser;
};

const ROLES: {role: IRole, label: string}[] = [
  { role: "client", label: "Client" },
  { role: "lead", label: "Lead" },
  { role: "admin", label: "Admin" },
  { role: "user", label: "User"},
  { role: "brand_ambassador", label: "Brand Ambassador" },
  { role: "merchant", label: "Merchant" }
];

export default function ClientNewEditForm({ currentUser }: Props) {
  const router = useRouter();
  const { ...userActions } = useUsers();

  const realmApp = useRealmApp();

  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    firstname: Yup.string().required('First name is required'),
    lastname: Yup.string().required('Last name is required'),
    displayName: Yup.string().required('Username is required'),
    email: Yup.string().required('Email is required').email('Email must be a valid email address'),
    phoneNumber: Yup.string().required('Phone number is required'),
    address: Yup.string().required('Address is required'),
    country: Yup.string().required('Country is required'),
    company: Yup.string().required('Company is required'),
    state: Yup.string().required('State is required'),
    city: Yup.string().required('City is required'),
    role: Yup.string().required('Role is required'),
    zipCode: Yup.string().required('Zip code is required'),
    photoURL: Yup.mixed<any>().nullable().required('Avatar is required'),
    // not required
    status: Yup.string(),
    isVerified: Yup.boolean(),
    isPublic: Yup.boolean(),
    about: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      firstname: currentUser?.firstname || '',
      lastname: currentUser?.lastname || '',
      displayName: currentUser?.displayName || '',
      city: currentUser?.city || '',
      role: currentUser?.role || '',
      email: currentUser?.email || '',
      state: currentUser?.state || '',
      status: currentUser?.status || 'pending',
      address: currentUser?.address || '',
      country: currentUser?.country || '',
      zipCode: currentUser?.zipCode || '',
      company: currentUser?.company === "none" || !(currentUser?.company) ? '' : currentUser?.company,
      photoURL: currentUser?.photoURL || null,
      phoneNumber: currentUser?.phoneNumber || '',
      isVerified: currentUser?.isVerified || true,
      isPublic: currentUser?.isPublic || true,
      about: currentUser?.about || ""
    }),
    [currentUser]
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
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const cpPhotoURL = data.photoURL?.path ?? "none"
      if (!currentUser?.isRegistered) {
        // @ts-expect-error expected
        await userActions.registerUser({ ...data, photoURL: cpPhotoURL })
        await realmApp.currentUser?.refreshCustomData();
        router.push(paths.dashboard.root);
        enqueueSnackbar("Registration complete");
        reset();
        return await new Promise((resolve) => setTimeout(resolve, 500));
      }
      enqueueSnackbar(currentUser ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
      reset();
      return await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      enqueueSnackbar(currentUser ? 'Update failed!' : 'Update Failed!', { variant: "error" });
      console.error(error);
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
        setValue('photoURL', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  console.log(values, "VALUES")
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Card sx={{ pt: 10, pb: 5, px: 3 }}>
            {currentUser && (
              <Label
                color={
                  (values.status === 'active' && 'success') ||
                  (values.status === 'banned' && 'error') ||
                  'warning'
                }
                sx={{ position: 'absolute', top: 24, right: 24 }}
              >
                {values.status}
              </Label>
            )}

            <Box sx={{ mb: 5 }}>
              <RHFUploadAvatar
                name="photoURL"
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

            {currentUser && (
              <FormControlLabel
                labelPlacement="start"
                control={
                  <Controller
                    name="status"
                    control={control}
                    disabled={currentUser?.role !== "admin"}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value !== 'active' && field.value !== "pending"}
                        onChange={(event) =>
                          field.onChange(event.target.checked ? 'banned' : 'active')
                        }
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
              name="isVerified"
              labelPlacement="start"
              disabled={currentUser?.role !== "admin"}
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    Email Verified
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Disabling this will automatically send the user a verification email
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
            />

            {currentUser && (
              <Stack justifyContent="center" alignItems="center" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" disabled={currentUser?.role !== "admin"}>
                  Delete User
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
              <RHFTextField name="firstname" label="First Name" />
              <RHFTextField name="lastname" label="Last Name" />
              <RHFTextField name="displayName" label="Full Name" />
              <RHFTextField name="email" disabled label="Email Address" />
              <RHFTextField name="phoneNumber" label="Phone Number" />

              <RHFAutocomplete
                name="country"
                type="country"
                label="Country"
                placeholder="Choose a country"
                fullWidth
                options={countries.map((option) => option.label)}
                getOptionLabel={(option) => option}
              />

              <RHFTextField name="state" label="State/Region" />
              <RHFTextField name="city" label="City" />
              <RHFTextField name="address" label="Address" />
              <RHFTextField name="zipCode" label="Zip/Code" />
              <RHFTextField name="company" label="Company" />
              <RHFSelect
                name="role"
                label="Role"
              // disabled={currentUser?.role !== "admin"}
              >
                {ROLES.map(({role, label}) => (
                  <MenuItem key={role} value={role}>
                    {label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Box>

            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {!currentUser ? 'Create User' : 'Save Changes'}
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
