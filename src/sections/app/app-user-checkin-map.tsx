'use client';

import { MapRef } from 'react-map-gl';
import { memo, useRef, useMemo, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import {
  useTheme,
  Backdrop,
  CircularProgress,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Container,
} from '@mui/material';
import { Camera } from 'react-camera-pro';
// import { useRouter } from 'next/router';
import { useBoolean } from 'src/hooks/use-boolean';
import useUserLocation from 'src/hooks/useUserLocation';
import styled from 'styled-components';
import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';

import { IUser } from 'src/types/user_realm';
import { IUserCheckinData } from 'src/types/campaign';
import { ICheckin } from 'src/types/realm/realm-types';

import UserActivityRoutesMap from '../campaign/list/user-activity/routes/user-activity-routes-map';
import { cl } from '@fullcalendar/core/internal-common';

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
  const [open, setOpen] = useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    
    setOpen(true);
    
  };

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
  const Wrapper = styled.div`
    position: fixed;
    width: 100%;
    height: 100%;
    z-index: 1;
  `;

  const Control = styled.div`
    position: fixed;
    display: flex;
    right: 0;
    width: 20%;
    min-width: 130px;
    min-height: 130px;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 50px;
    box-sizing: border-box;
    flex-direction: column-reverse;

    @media (max-aspect-ratio: 1/1) {
      flex-direction: row;
      bottom: 0;
      width: 100%;
      height: 20%;
    }

    @media (max-width: 400px) {
      padding: 10px;
    }
  `;

  const CamButton = styled.button`
    outline: none;
    color: white;
    opacity: 1;
    background: transparent;
    background-color: transparent;
    background-position-x: 0%;
    background-position-y: 0%;
    background-repeat: repeat;
    background-image: none;
    padding: 0;
    text-shadow: 0px 0px 4px black;
    background-position: center center;
    background-repeat: no-repeat;
    pointer-events: auto;
    cursor: pointer;
    z-index: 2;
    filter: invert(100%);
    border: none;

    &:hover {
      opacity: 0.7;
    }
  `;

  const TakePhotoButton = styled(CamButton)`
    background: url('https://img.icons8.com/ios/50/000000/compact-camera.png');
    background-position: center;
    background-size: 50px;
    background-repeat: no-repeat;
    width: 80px;
    height: 80px;
    border: solid 4px black;
    border-radius: 50%;

    &:hover {
      background-color: rgba(0, 0, 0, 0.3);
    }
  `;

  const ChangeFacingCameraButton = styled(Button)`
    background: url(https://img.icons8.com/ios/50/000000/switch-camera.png);
    background-position: center;
    background-size: 40px;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    padding: 40px;
    &:disabled {
      opacity: 1;
      cursor: default;
    }
    @media (max-width: 400px) {
      padding: 40px 5px;
    }
  `;

  const ImagePreview = styled.div<{ image: string | null }>`
    width: 120px;
    height: 120px;
    ${({ image }) => (image ? `background-image:  url(${image});` : '')}
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;

    @media (max-width: 400px) {
      width: 50px;
      height: 120px;
    }
  `;
  const cameraRef = useRef(null);
  const [photoData, setPhotoData] = useState(null);
  // const router = useRouter();
  const takePhoto = () => {
    if (cameraRef.current) {
      const photo = cameraRef.current.takePhoto();
      setPhotoData(photo);
      if (photo !== '') {
        // router.push('/destination-page');
        console.log('Testing')
      }
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
        <Typography>
          <span>Location : </span>
          {JSON.stringify(userLocation?.placeName ?? 'Riverside')}{' '}
        </Typography>
        <CardContent
          sx={{
            display: 'grid',
            justifyContent: 'center',
            alignItems: 'center', // Add this line to center vertically
            position: 'absolute',
            bottom: '40%',
            width: '100%',
            paddingBottom: '1px',
            paddingRight: '100px',
          }}
        >
          <Button variant="contained" color="primary">
            Activity Logs
          </Button>
          <Button variant="contained" color="success" sx={{ mt: 1 }} onClick={handleOpen}>
            Check In
          </Button>
          <Dialog
            open={open}
            onClose={handleClose}
            fullScreen
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box sx={{ flexGrow: 1 }}>
              <AppBar position="static" color="primary">
                <Toolbar>
                  <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                  >
                    <Iconify icon="eva:menu-fill" width={12} />
                  </IconButton>
                  <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    News
                  </Typography>
                  <Button color="inherit" onClick={handleClose}>
                    Close
                  </Button>
                </Toolbar>
              </AppBar>
                <Box>
                  <Wrapper>
                    <Camera ref={cameraRef} aspectRatio="cover"/>
                    <Control>
                    {photoData && <img src={photoData} alt="Preview" />}
                      <TakePhotoButton onClick={takePhoto} />
                      <ChangeFacingCameraButton />
                    </Control>
                  </Wrapper>
                </Box>
            </Box>
            {/* <List>
          <ListItemButton>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItemButton>
          <Divider />
          <ListItemButton>
            <ListItemText
              primary="Default notification ringtone"
              secondary="Tethys"
            />
          </ListItemButton>
        </List> */}
          </Dialog>
        </CardContent>
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
