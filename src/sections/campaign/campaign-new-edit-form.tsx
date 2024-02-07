"use client"

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Avatar, Divider, ListItem, IconButton, Pagination, ListItemText, ListItemAvatar } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFTextField,
} from 'src/components/hook-form';

import { IRole } from 'src/types/user_realm';
import { ICampaign } from 'src/types/realm/realm-types';

import CampaignRoutesMap from './campaign-routes-map';

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
};

// const ROLES: { role: IRole, label: string }[] = [
//   { role: "client", label: "Client" },
//   { role: "lead", label: "Lead" },
//   { role: "admin", label: "Admin" },
//   { role: "user", label: "User" },
//   { role: "brand_ambassador", label: "Brand Ambassador" },
//   { role: "merchant", label: "Merchant" }
// ];

const count = 5;

type IRoute = Array<any>

export default function CampaignNewEditForm({ currentCampaign }: Props) {
  const router = useRouter();
  const { ...userActions } = useUsers();

  const realmApp = useRealmApp();

  const { enqueueSnackbar } = useSnackbar();

  const [routes, setRoutes] = useState<IRoute[]>([])

  const NewUserSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentCampaign?.title || '',
    }),
    [currentCampaign]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const {
    reset,
    // watch,
    // control,
    // setValue,
    handleSubmit,
    // formState: { isSubmitting },
  } = methods;

  // const values = watch();

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (!currentCampaign) {
        // @ts-expect-error expected
        await userActions.registerUser({ ...data, photoURL: cpPhotoURL })
        await realmApp.currentUser?.refreshCustomData();
        router.push(paths.dashboard.root);
        enqueueSnackbar("Registration complete");
        reset();
        return await new Promise((resolve) => setTimeout(resolve, 500));
      }
      enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.user.root);
      reset();
      return await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      enqueueSnackbar(currentCampaign ? 'Update failed!' : 'Update Failed!', { variant: "error" });
      console.error(error);
      return await new Promise((resolve) => setTimeout(resolve, 500));
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} md={8}>
          <Card sx={{ p: 0 }}>
            <CampaignRoutesMap contacts={[]} />
          </Card>
        </Grid>

        <RoutesList routes={routes} />
      </Grid>
    </FormProvider>
  );
}

function RoutesList({ routes }: { routes: IRoute[] }) {
  return <Grid xs={12} md={4}>
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          Routes
        </Typography>

        <IconButton color='success' size="small">
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        List of routes
      </Typography>
      <RHFTextField name="search" label="Search" size="small" />
      <List dense sx={{ maxHeight: 250, overflowY: 'auto', }}>
        {Array.isArray(routes) && routes.map(route => (
          <>
            <ListItem
              secondaryAction={<Stack direction="row" justifyContent="space-between">
                <IconButton edge="end" aria-label="details" size="small">
                  <Iconify icon="solar:pen-bold" width={18} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" color="error" size='small'>
                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                </IconButton>
              </Stack>}
            >
              <ListItemAvatar>
                <Avatar variant='rounded'>
                  R
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Route item"
                secondary="details" />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <Pagination shape="rounded" count={count} showFirstButton showLastButton />


      <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
        <Button variant="soft" color="error" size='small'>
          Clear Routes
        </Button>
      </Stack>
    </Card>
  </Grid>;
}

{/* <Stack spacing={2} borderRadius={2} border={theme => `1px dashed ${theme.palette.divider}`} padding={2}>
                <RHFTextField name="fullAddress" label="Full Address" size='small' />
                <RHFTextField name="phoneNumber" label="Phone Number" size='small' />
                <RHFTextField name="longitude" label="Longitude" size='small' />
                <RHFTextField name="latitude" label="Latitude" size='small' />
              </Stack> */}

{/* <Card sx={{ p: 2, mb: 2 }}>
            <Stack rowGap={2} sx={{ mb: 5 }}>
              <Typography variant="h6" >
                Details
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Title, short description, type...
              </Typography>
              <RHFTextField name="title" label="Title" size="small" />
              <RHFTextField name="description" label="Short description" size="small" />
              <RHFTextField name="type" label="Type" size="small" />
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mt: 3 }}>
              <Button variant="soft" color="error" size="small">
                Cancel
              </Button>
              <LoadingButton
                color="info"
                type="submit"
                variant="soft"
                size="small"
                loading={isSubmitting}
              >
                Save Details
              </LoadingButton>
            </Stack>
          </Card> */}