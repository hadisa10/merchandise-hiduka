'use client';

import { MapRef } from 'react-map-gl';
import { memo, useRef, useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { useTheme, Backdrop, CircularProgress } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import useUserLocation from 'src/hooks/useUserLocation';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';

import { IUser } from 'src/types/user_realm';
import { IUserCheckinData } from 'src/types/campaign';
import { ICheckin } from 'src/types/realm/realm-types';

import UserActivityRoutesMap from '../campaign/list/user-activity/routes/user-activity-routes-map';

// import CampaignRoutesMap from '../campaign-routes-map';
// import CampaignSearchRoute from '../campaign-search-route';

// ----------------------------------------------------------------------

type UserCheckinMapViewProps = {
  id: string;
};

const UserCheckinMapView: React.FC<UserCheckinMapViewProps> = ({ id }: UserCheckinMapViewProps) => {
  const fetchDirections = useBoolean();

  const userLocation = useUserLocation();

  const { currentUser } = useRealmApp();

  const user = useMemo(
    () => currentUser?.customData as unknown as IUser,
    [currentUser?.customData]
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const theme = useTheme();

  const mapRef = useRef<MapRef>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [routes, setRoutes] = useState<ICheckin[] | null>(null);

  const [popupInfo, setPopupInfo] = useState<IUserCheckinData | null>(null);

  // const { getCampaignUserCheckins } = useCampaigns(true);

  const handleSetPopupInfo = useCallback((pInfo: IUserCheckinData | null) => {
    setPopupInfo(pInfo);
  }, []);

  // State to track expanded list item
  const [openCollapse, setOpenCollapse] = useState<string | null>(null);

  // Function to handle click to expand/collapse items
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleClick = (clickedid: string) => {
    setOpenCollapse(openCollapse === clickedid ? null : clickedid);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelectRoute = useCallback(
    ({
      longitude,
      latitude,
      addr,
      phoneNumber,
      _id,
    }: {
      _id: string;
      longitude: number;
      latitude: number;
      addr: string;
      phoneNumber: string;
    }) => {
      setSelectedRoute(_id);
      // const prds = []
      zoomToRoute(longitude, latitude);
      setPopupInfo({
        lnglat: [latitude, longitude],
        address: addr,
        phoneNumber: phoneNumber ?? '',
        products: [],
      }); // Set the selected route's info for the popup
    },
    []
  );
  // Example usage of the ref
  const zoomToRoute = (lng: number, lat: number) => {
    const mapInstance = mapRef.current?.getMap();
    if (mapInstance) {
      mapInstance.flyTo({
        center: [lat, lng],
        zoom: 15,
        essential: true,
      });
    }
  };

  // useEffect(() => {
  //   if (startDate && endDate && user._id) {
  //     getCampaignUserCheckins(
  //       campaignId,
  //       startDate.toISOString(),
  //       endDate.toISOString(),
  //       user._id.toString()
  //     )
  //       .then((res) => {
  //         setRoutes(res);
  //       })
  //       .catch((e) => {
  //         console.error(e.message, 'ERROR');
  //       });
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [startDate, endDate, campaignId, user._id]);

  const renderRouteForm = (
    <Stack width={250} spacing={1}>
      <Button
        variant="soft"
        size="small"
        color={fetchDirections.value ? 'success' : 'inherit'}
        sx={{ mb: 1, width: 'max-content' }}
        onClick={fetchDirections.onToggle}
        endIcon={
          fetchDirections.value ? (
            <Iconify icon="eva:done-all-fill" width={12} />
          ) : (
            <Iconify icon="mingcute:close-line" width={12} />
          )
        }
      >
        Directions
      </Button>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {user.displayName ?? ''} Checkins
        </Typography>
      </Stack>
      {/* <List dense sx={{ maxHeight: 200, overflowY: 'auto', width: '100%' }} disablePadding>
        {Array.isArray(routes) &&
          routes.map((route, index) => (
            <Fragment key={typeof route._id === 'string' ? route._id : route._id.toString()}>
              <ListSubheader
                disableGutters
                component={ButtonBase}
                onClick={() => handleClick(route._id.toString())}
                sx={{
                  ...bgBlur({ color: theme.palette.grey[900] }),
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  pl: 1,
                  width: '100%',
                  '&:first-of-type': {
                    borderTopLeftRadius: 5,
                    borderTopRightRadius: 5,
                  },
                  '&:last-of-type': {
                    borderBottomLeftRadius: 5,
                    borderBottomRightRadius: 5,
                  },
                }}
              >
                <Typography variant="caption">{fDate(route.checkin)}</Typography>
                <IconButton>
                  {openCollapse === route._id.toString() ? (
                    <Iconify icon="eva:arrow-ios-upward-fill" width={15} height={15} />
                  ) : (
                    <Iconify icon="eva:arrow-ios-downward-fill" width={15} height={15} />
                  )}
                </IconButton>
              </ListSubheader>

              <Collapse in={openCollapse === route._id.toString()} timeout="auto" unmountOnExit>
                <List component="div" disablePadding dense>
                  {route.sessions.map((r, i) => (
                    <ListItem key={r._id.toString()} sx={{ pl: 4 }}>
                      <RadioGroup
                        value={selectedRoute}
                        onChange={(e) => {
                          const longitude = r.location.coordinates[1];
                          const latitude = r.location.coordinates[0];
                          console.log(r.location, 'LOCATION');
                          if (longitude && latitude) {
                            // onSelectRoute logic here
                            onSelectRoute({
                              _id: r._id.toString(),
                              longitude,
                              latitude,
                              addr: 'Address',
                              phoneNumber: user.displayName,
                            });
                          }
                        }}
                      >
                        <FormControlLabel
                          value={r._id.toString()}
                          control={
                            <Radio
                              size="small"
                              sx={{
                                '& .MuiSvgIcon-root': {
                                  fontSize: 15,
                                },
                              }}
                            />
                          }
                          label={
                            <Typography variant="caption" color="text.secondary">
                              {fTime(r.start_time) ?? ''}
                            </Typography>
                          }
                        />
                      </RadioGroup>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </Fragment>
          ))}
      </List>
      <Pagination
        shape="rounded"
        count={Array.isArray(campaignRoutes) ? Math.ceil(campaignRoutes.length / 10) : 0}
        showFirstButton
        showLastButton
      />

      <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
        <Button variant="soft" color="error" size="small">
          Clear Routes
        </Button>
      </Stack> */}
    </Stack>
  );
  const contacts = useMemo(() => {
    // if (!Array.isArray(routes)) return [];
    // const mappedRoutes: ICheckinsSessions[] = flattenDepth(
    //   routes.map((x) => x.sessions),
    //   3
    // );
    // return mappedRoutes.map((r) => ({
    //   lnglat: [r.location.coordinates[1], r.location.coordinates[0]],
    //   address: fDateTime(r.start_time),
    //   phoneNumber: user.phoneNumber,
    //   products: [],
    // }));
    if (
      !userLocation.loading &&
      !userLocation.error &&
      (userLocation.latitude === null || userLocation.longitude)
    )
      return [];
    return [
      {
        lnglat: [userLocation.latitude as number, userLocation.longitude as number],
        address: fDateTime(new Date()),
        phoneNumber: user?.phoneNumber ?? '',
        products: [],
      },
    ];
  }, [
    user,
    userLocation.loading,
    userLocation.error,
    userLocation.latitude,
    userLocation.longitude,
  ]);

  const renderMap = (
    <Grid xs={12} md={7}>
      <Card sx={{ p: 0, position: 'relative', width: '100%', height: '400px' }}>
        <UserActivityRoutesMap
          ref={mapRef}
          popupInfo={popupInfo}
          handleSetPopupInfo={handleSetPopupInfo}
          contacts={contacts}
          handleNewRouteOpen={() => console.log('NEW ROUTE OPEN')}
          fetchDirections={fetchDirections.value}
          childrenControlPanel={renderRouteForm}
        />
      </Card>
    </Grid>
  );

  const renderCheckin = (
    <Grid xs={12} md={5}>
      <Card sx={{ p: 3, position: 'relative', width: '100%', height: '400px' }}>
        <Backdrop
          sx={{
            bgcolor: (t) => t.palette.background.paper,
            position: 'absolute',
            zIndex: (t) => t.zIndex.drawer + 1,
          }}
          // open={userLocation.loading || userLocation.error !== null}
          open={userLocation.loading}
          // onClick={handleClose}
        >
          {/* {userLocation.loading && <CircularProgress color="inherit" />}
          {userLocation.error !== null && (
            <Button
              variant="soft"
              color="error"
              startIcon={<Iconify icon="eva:alert-triangle-fill" width={20} height={20} />}
            >
              {userLocation.error}
            </Button>
          )} */}
        </Backdrop>
        <Typography>{JSON.stringify(userLocation)}</Typography>
      </Card>
    </Grid>
  );
  return (
    <Grid container spacing={3}>
      {renderCheckin}
      {renderMap}
    </Grid>
  );
};

export default memo<UserCheckinMapViewProps>(UserCheckinMapView);
