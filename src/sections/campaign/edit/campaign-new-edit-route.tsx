"use client"

import { first } from 'lodash';
import { memo, useMemo, Fragment } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Avatar, Divider, ListItem, IconButton, Pagination, ListItemText, ListItemAvatar } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

import { IRoute, ICampaign_routes } from 'src/types/realm/realm-types';

import CampaignRoutesMap from '../campaign-routes-map';
import CampaignSearchRoute from '../campaign-search-route';


// ----------------------------------------------------------------------

type CampaignNewEditRouteFormProps = {
  handleNewRouteOpen: ({ lng, lat }: { lng: number, lat: number }) => void
  handleRemoveNewRoute: (route: number) => void;
  handleAddNewRoute: (route: IRoute) => void;
  campaignRoutes: ICampaign_routes[];
};


const CampaignNewEditRouteForm: React.FC<CampaignNewEditRouteFormProps> = memo(({ handleNewRouteOpen, handleRemoveNewRoute, handleAddNewRoute, campaignRoutes }: CampaignNewEditRouteFormProps) => {
  const fetchDirections = useBoolean();

  const renderRouteForm = (
    <Grid xs={12} md={4}>
      <Card sx={{ p: 2, mb: 2 }}>
        <Button
          variant="soft"
          size='small'
          color={fetchDirections.value ? "success" : 'inherit'}
          sx={{ mb: 1 }} onClick={fetchDirections.onToggle}
          endIcon={
            fetchDirections.value ?
              <Iconify icon="eva:done-all-fill" width={12} />
              :
              <Iconify icon="mingcute:close-line" width={12} />
          }
        >
          Directions
        </Button>
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
        <CampaignSearchRoute handleClick={handleAddNewRoute} />
        <List dense sx={{ maxHeight: 250, overflowY: 'auto', }}>
          {Array.isArray(campaignRoutes) && campaignRoutes.map((campaignRoute, index) => (
            <Fragment key={typeof campaignRoute._id === "string" ? campaignRoute._id : campaignRoute._id.toString()}>
              <ListItem
                secondaryAction={<Stack direction="row" justifyContent="space-between">
                  <IconButton edge="end" aria-label="details" size="small">
                    <Iconify icon="solar:pen-bold" width={18} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" size='small' onClick={() => handleRemoveNewRoute(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                  </IconButton>
                </Stack>}
              >
                <ListItemAvatar>
                  <Avatar variant='rounded'>
                    {first(campaignRoute.routeAddress?.fullAddress)}
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
    if (!Array.isArray(campaignRoutes)) return [];
    return campaignRoutes.map(campaignRoute => ({
      lnglat: campaignRoute.routeAddress?.location?.coordinates,
      address: campaignRoute.routeAddress?.fullAddress,
      phoneNumber: "",
      products: []
    }))
  }, [campaignRoutes])

  const renderMap = (
    <Grid xs={12} md={8}>
      <Card sx={{ p: 0 }}>
        {/** @ts-expect-error expected * */}
        <CampaignRoutesMap contacts={contacts} handleNewRouteOpen={handleNewRouteOpen} fetchDirections={fetchDirections.value} />
      </Card>
    </Grid>
  )

  return (
    <Grid container spacing={3}>
      {renderMap}
      {renderRouteForm}
    </Grid>
  );
})

export default CampaignNewEditRouteForm;