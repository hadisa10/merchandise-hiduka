"use client"

import * as Yup from 'yup';
import { first } from 'lodash';
import { useForm } from 'react-hook-form';
import { useMemo, Fragment } from 'react';
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

import { ICampaign, ICampaign_routes } from 'src/types/realm/realm-types';

import CampaignRoutesMap from '../campaign-routes-map';


// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
  handleNewRouteOpen: ({ lng, lat }: { lng: number, lat: number }) => void
  campaignRoutes: ICampaign_routes[];
};


export default function CampaignNewEditRouteForm({ currentCampaign, handleNewRouteOpen, campaignRoutes }: Props) {
  const router = useRouter();
  const { ...userActions } = useUsers();

  const realmApp = useRealmApp();

  const { enqueueSnackbar } = useSnackbar();
  // const [routes, setRoutes] = useState<ICampaign_routes[]>(campaignRoutes)

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

  const renderRouteForm = (
    <Grid xs={12} md={4}>
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
          {Array.isArray(campaignRoutes) && campaignRoutes.map((campaignRoute) => (
            <Fragment key={typeof campaignRoute._id === "string" ? campaignRoute._id: campaignRoute._id.toString()}>
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
                    { first(campaignRoute.routeAddress?.fullAddress) }
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={campaignRoute.routeAddress?.fullAddress ?? ""}
                  secondary={campaignRoute.routeAddress?.road} />
              </ListItem>
              <Divider variant="inset" component="li" />
            </Fragment>
          ))}
        </List>
        <Pagination shape="rounded" count={Math.ceil(campaignRoutes.length / 10)} showFirstButton showLastButton />


        <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
          <Button variant="soft" color="error" size='small'>
            Clear Routes
          </Button>
        </Stack>
      </Card>
    </Grid>
  )
  const contacts = useMemo(() => {
    if(!Array.isArray(campaignRoutes)) return [];
    return campaignRoutes.map(campaignRoute => ({
      latlng: campaignRoute.routeAddress?.location?.coordinates,
      address: campaignRoute.routeAddress?.fullAddress,
      phoneNumber: "",
      products: []
    }))
  },[campaignRoutes])

  const renderMap = (
    <Grid xs={12} md={8}>
      <Card sx={{ p: 0 }}>
          {/** @ts-expect-error expected * */}
          <CampaignRoutesMap contacts={contacts} handleNewRouteOpen={handleNewRouteOpen} />
      </Card>
    </Grid>
  )



  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
        <Grid container spacing={3}>
          {renderMap}
          {renderRouteForm}
        </Grid>
      </FormProvider>
  );
}