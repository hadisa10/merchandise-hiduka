"use client"

import { MapRef } from 'react-map-gl';
import { memo, useRef, useMemo, Fragment, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Radio, ListItem, IconButton, Pagination, RadioGroup, FormControlLabel } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';

import { CountryData } from 'src/types/campaign';
import { IRoute, ICampaignRoutes } from 'src/types/realm/realm-types';

import CampaignRoutesMap from '../campaign-routes-map';
import CampaignSearchRoute from '../campaign-search-route';


// ----------------------------------------------------------------------

type CampaignNewEditRouteFormProps = {
  handleNewRouteOpen: ({ lat, lng }: { lng: number, lat: number }) => void
  handleRemoveNewRoute: (route: number) => void;
  handleAddNewRoute: (route: IRoute) => void;
  campaignRoutes: ICampaignRoutes[];
};

const CampaignNewEditRouteForm: React.FC<CampaignNewEditRouteFormProps> = ({ handleNewRouteOpen, handleRemoveNewRoute, handleAddNewRoute, campaignRoutes }: CampaignNewEditRouteFormProps) => {
  const fetchDirections = useBoolean();

  const mapRef = useRef<MapRef>(null)

  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

  const [popupInfo, setPopupInfo] = useState<CountryData | null>(null)

  const handleSetPopupInfo = useCallback((pInfo: CountryData | null) => {
    setPopupInfo(pInfo);
  }
    , [])

  const onSelectRoute = useCallback((campaignRoute: ICampaignRoutes) => {
    setSelectedRoute(campaignRoute._id.toString());
    const [latitude, longitude] = campaignRoute.routeAddress?.location?.coordinates ?? [0, 0];
    console.log(campaignRoute, "CAMPAIGN ROUTE")
    const addr = campaignRoute.routeAddress?.fullAddress ?? 'ME';
    const phoneNumber = campaignRoute.routeAddress?.phoneNumber ?? 'no-number'
    // const prds = []
    zoomToRoute(longitude, latitude);
    setPopupInfo({
      lnglat: [latitude, longitude],
      address: addr,
      phoneNumber,
      products: [],
    }); // Set the selected route's info for the popup
  }, []);
  // Example usage of the ref
  const zoomToRoute = (lng: number, lat: number,) => {
    const mapInstance = mapRef.current?.getMap();
    if (mapInstance) {
      mapInstance.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true,
      });
    }
  };

  const renderRouteForm = (
    <Stack maxWidth={300} spacing={1}>
      <Button
        variant="soft"
        size='small'
        color={fetchDirections.value ? "success" : 'inherit'}
        sx={{ mb: 1, width: "max-content" }} onClick={fetchDirections.onToggle}
        endIcon={
          fetchDirections.value ?
            <Iconify icon="eva:done-all-fill" width={12} />
            :
            <Iconify icon="mingcute:close-line" width={12} />
        }
      >
        Directions
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          List of routes
        </Typography>
        {/* <IconButton color='success' size="small" >
          <Iconify icon="mingcute:add-line" width={15} />
        </IconButton> */}
      </Stack>

      <CampaignSearchRoute handleClick={handleAddNewRoute} />
      <List dense sx={{ maxHeight: 200, overflowY: 'auto', width: "100%" }}>
        {Array.isArray(campaignRoutes) && campaignRoutes.map((campaignRoute, index) => (
          <Fragment key={typeof campaignRoute._id === "string" ? campaignRoute._id : campaignRoute._id.toString()}>
            <ListItem
              secondaryAction={
                <Stack direction="row" justifyContent="space-between">
                  <IconButton edge="end" aria-label="details" size="small">
                    <Iconify icon="solar:pen-bold" width={18} />
                  </IconButton>
                  <IconButton edge="end" aria-label="delete" color="error" size='small' onClick={() => handleRemoveNewRoute(index)}>
                    <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                  </IconButton>
                </Stack>
              }
            >
              <RadioGroup
                value={selectedRoute}
                onChange={(e) => {
                  const latitude = campaignRoute.routeAddress?.location?.coordinates?.[0]
                  const longitude = campaignRoute.routeAddress?.location?.coordinates?.[1]
                  if (longitude && latitude) {
                    onSelectRoute(campaignRoute)
                  }
                }}
              >
                <FormControlLabel
                  value={campaignRoute._id}
                  control={<Radio size="small" />}
                  label={campaignRoute.routeAddress?.fullAddress ?? ''}
                  sx={{ color: 'common.white' }}
                />
              </RadioGroup>
            </ListItem>
          </Fragment>
        ))}
      </List>
      <Pagination shape="rounded" count={Math.ceil(campaignRoutes.length / 10)} showFirstButton showLastButton />

      <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
        <Button variant="soft" color="error" size='small'>
          Clear Routes
        </Button>
      </Stack>
    </Stack>
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
    <Grid xs={12}>
      <Card sx={{ p: 0 }}>
        <CampaignRoutesMap
          ref={mapRef}
          popupInfo={popupInfo}
          handleSetPopupInfo={handleSetPopupInfo}
          // @ts-expect-error expected
          contacts={contacts}
          handleNewRouteOpen={handleNewRouteOpen}
          fetchDirections={fetchDirections.value}
          childrenControlPanel={renderRouteForm}
        />
      </Card>
    </Grid>
  )

  return (
    <Grid container spacing={3}>
      {renderMap}
    </Grid>
  );
}

export default memo(CampaignNewEditRouteForm);