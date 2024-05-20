import { first } from 'lodash';
import { FeatureCollection } from 'geojson';
import { enqueueSnackbar } from 'notistack';
import Map, { Layer, MapRef, Marker, Source } from 'react-map-gl';
import { useRef, useMemo, useState, useEffect, forwardRef, useImperativeHandle } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import {
  Stack,
  Avatar,
  Button,
  Tooltip,
  Backdrop,
  IconButton,
  AvatarGroup,
  CircularProgress,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import useUserLocation from 'src/hooks/useUserLocation';
import { useResponsive } from 'src/hooks/use-responsive';

import { fDateTime } from 'src/utils/format-time';

import { MAPBOX_API } from 'src/config-global';
import { useGetDirections } from 'src/api/routes';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { MapPopup, MapControl } from 'src/components/map';
import GeocoderControl from 'src/components/map/geocoder-controller';

import RouteMapControlPanel from 'src/sections/campaign/map/campaign-route-map-control-panel';

import { IUserCheckinData } from 'src/types/campaign';

// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 400,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

type Props = {
  contacts: IUserCheckinData[];
  handleNewRouteOpen: ({ lng, lat }: { lng: number; lat: number }) => void;
  fetchDirections: boolean;
  childrenControlPanel?: React.ReactNode; // Added children prop type
  popupInfo: IUserCheckinData | null;
  handleSetPopupInfo: (popupInfo: IUserCheckinData | null) => void;
};

type MouseEventWithCtrl = MouseEvent & { ctrlKey: boolean };

const NairobiCoord: { longitude: number; latitude: number } = {
  latitude: -1.286389,
  longitude: 36.817223,
};

const UserActivityRoutesMap = forwardRef<MapRef, Props>(
  (
    {
      contacts,
      popupInfo,
      handleSetPopupInfo,
      handleNewRouteOpen,
      fetchDirections,
      childrenControlPanel,
    },
    ref
  ) => {
    const theme = useTheme();

    const mdUp = useResponsive('up', 'md');

    const { currentUser } = useRealmApp();

    const mapRef = useRef<MapRef>(null);

    // Adjust useImperativeHandle to meet the MapRef interface
    useImperativeHandle(ref, () => ({
      // @ts-expect-error expected
      getMap: () => mapRef.current?.getMap(),
    }));

    const lightMode = theme.palette.mode === 'light';

    const isLocked = useBoolean(true);

    const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);

    const currentLocation = useUserLocation();

    const userLocation = useMemo(() => {
      if (!currentLocation.loading && currentLocation.error !== null) return {};
      const lt: number =
        currentLocation.latitude === null || Number.isNaN(currentLocation.latitude)
          ? NairobiCoord.latitude
          : currentLocation.latitude;
      const lg =
        currentLocation.longitude === null || Number.isNaN(currentLocation.longitude)
          ? NairobiCoord.longitude
          : currentLocation.longitude;
      return {
        lnglat: [lt, lg],
        address: fDateTime(new Date()),
        phoneNumber: currentUser?.customData.phoneNumber ?? '',
        products: [],
      };
    }, [
      currentUser,
      currentLocation.loading,
      currentLocation.error,
      currentLocation.latitude,
      currentLocation.longitude,
    ]);
    const directionsCoord = useMemo(
      () =>
        userLocation.lnglat
          ? [userLocation, ...contacts].map((x) => [x.lnglat[0], x.lnglat[1]])
          : [...contacts].map((x) => [x.lnglat[0], x.lnglat[1]]),
      [contacts, userLocation]
    );

    const { directions } = useGetDirections(
      directionsCoord.map((x) => [x[1], x[0]]),
      fetchDirections
    );

    const settings = useMemo(() => {
      const interactive = !isLocked.value;
      return {
        scrollZoom: interactive,
        boxZoom: interactive,
        dragRotate: interactive,
        dragPan: interactive,
        keyboard: interactive,
        doubleClickZoom: interactive,
        touchZoomRotate: interactive,
        touchPitch: interactive,
      };
    }, [isLocked.value]);

    const initialState = useMemo(() => {
      if (!Array.isArray(contacts)) {
        return null;
      }

      const startPoint = first(contacts);

      if (startPoint?.lnglat) {
        const [longitude, latitude] = startPoint.lnglat;
        return {
          latitude,
          longitude,
          zoom: 12,
        };
      }
      if (userLocation.lnglat) {
        return {
          latitude: userLocation.lnglat[0],
          longitude: userLocation.lnglat[1],
          zoom: 12,
        };
      }

      return null;
    }, [contacts, userLocation]);

    const coordinates = useMemo(() => {
      if (Array.isArray(directions)) {
        return directions[0].geometry.coordinates;
      }
      return [];
    }, [directions]);

    const geojson: FeatureCollection<any> = useMemo(
      () => ({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [...coordinates],
            },
            properties: {},
          },
        ],
      }),
      [coordinates]
    );

    const lineStyle = {
      id: 'roadLayer',
      type: 'line',
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': lightMode ? theme.palette.primary.main : theme.palette.info.light,
        'line-width': 6,
        'line-opacity': 0.75,
      },
    };
    const handleMapClick = (event: mapboxgl.MapLayerMouseEvent) => {
      // Check if the Ctrl key is pressed
      if (event.originalEvent.ctrlKey) {
        // Extract latitude and longitude from the map click event
        const { lngLat } = event;
        // Call handleNewRouteOpen and pass the clickDetails object
        handleNewRouteOpen(lngLat);
      } else {
        // If Ctrl key is not pressed, handle the normal map click event
        // For example, you can open a popup, etc.
      }
    };

    const handleMouseMove = (event: MouseEventWithCtrl) => {
      if (event.ctrlKey) {
        const { x, y } = event;
        const rect = mapRef.current?.getMap().getContainer().getBoundingClientRect();
        if (!rect) {
          enqueueSnackbar('Invalid location', { variant: 'error' });
          return;
        }
        // @ts-expect-error return type is obj {lng, lat}
        const { lng, lat } =
          mapRef.current?.getMap().unproject([x - rect.left, y - rect.top]) || [];
        setMarkerPosition([lng, lat]);
      }
    };

    const handleMouseLeave = () => {
      setMarkerPosition(null);
    };

    useEffect(() => {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, []);

    const openBackdrop = useMemo(
      () =>
        currentLocation.loading ||
        currentLocation.error !== null ||
        initialState === null ||
        userLocation.lnglat === undefined,
      [currentLocation.loading, currentLocation.error, initialState, userLocation]
    );
    return (
      <Grid container spacing={3}>
        <Grid xs={12}>
          <StyledRoot>
            <Backdrop
              sx={{
                color: '#fff',
                position: 'absolute',
                zIndex: (t) => t.zIndex.drawer + 1,
              }}
              open={openBackdrop}
              // onClick={handleClose}
            >
              {currentLocation.loading && <CircularProgress color="inherit" />}
              {currentLocation.error !== null && (
                <Button
                  variant="soft"
                  color="error"
                  startIcon={<Iconify icon="eva:alert-triangle-fill" width={20} height={20} />}
                >
                  {currentLocation.error ?? "Can't get current location"}
                </Button>
              )}
            </Backdrop>
            {!openBackdrop && (
              <Map
                ref={mapRef}
                {...settings}
                // @ts-expect-error error caught in memorized check
                initialViewState={initialState}
                onClick={handleMapClick}
                // mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
                mapStyle={`mapbox://styles/mapbox/navigation-${lightMode ? 'day' : 'night'}-v1`}
                mapboxAccessToken={MAPBOX_API}
              >
                {/* Lock button */}
                {!mdUp && (
                  <IconButton
                    onClick={isLocked.onToggle}
                    sx={{
                      position: 'absolute',
                      top: mdUp ? 10 : 15,
                      right: mdUp ? 10 : 5,
                      zIndex: 1,
                      bgcolor: 'common.white',
                      color: 'common.black',
                      p: 0.5,
                      borderRadius: theme.spacing(1),
                      '&:hover': {
                        bgcolor: 'common.white',
                        color: 'common.black',
                      },
                    }}
                  >
                    {isLocked.value ? (
                      <Iconify icon="basil:lock-solid" width={24} />
                    ) : (
                      <Iconify icon="basil:unlock-solid" width={24} />
                    )}
                  </IconButton>
                )}
                <GeocoderControl mapboxAccessToken={MAPBOX_API ?? ''} position="top-left" />
                <Source id="route-source" type="geojson" data={geojson}>
                  {/** @ts-expect-error expected * */}
                  <Layer {...lineStyle} />
                </Source>

                <MapControl />

                {Array.isArray(contacts) &&
                  [...contacts].map((country, index) => (
                    <Marker
                      key={`marker-${index}`}
                      latitude={country.lnglat[0]}
                      longitude={country.lnglat[1]}
                      onClick={(event) => {
                        event.originalEvent.stopPropagation();
                        handleSetPopupInfo(country);
                      }}
                    />
                  ))}
                {markerPosition && (
                  <Marker longitude={markerPosition[0]} latitude={markerPosition[1]} />
                )}

                {popupInfo && (
                  <MapPopup
                    longitude={popupInfo.lnglat[1]}
                    latitude={popupInfo.lnglat[0]}
                    onClose={() => handleSetPopupInfo(null)}
                    sx={{
                      '& .mapboxgl-popup-content': {
                        bgcolor: 'common.white',
                        color: 'common.black',
                      },
                      '&.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip': {
                        borderTopColor: '#FFF',
                      },
                      '&.mapboxgl-popup-anchor-top .mapboxgl-popup-tip': {
                        borderBottomColor: '#FFF',
                      },
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Address
                    </Typography>

                    <Typography component="div" variant="caption">
                      {popupInfo.address}
                    </Typography>

                    <Typography
                      component="div"
                      variant="caption"
                      sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <Iconify icon="solar:phone-bold" width={14} sx={{ mr: 0.5 }} />
                      {popupInfo.phoneNumber}
                    </Typography>
                    <Typography
                      component="div"
                      variant="caption"
                      color="success.main"
                      sx={{ mt: 1, display: 'flex', alignItems: 'center' }}
                    >
                      <Iconify icon="tdesign:money" width={14} sx={{ mr: 0.5 }} />
                      <Typography variant="caption">
                        Ksh{' '}
                        {popupInfo?.products?.reduce(
                          (accumulator, item) => accumulator + item.price * item.quantity,
                          0
                        )}
                      </Typography>
                    </Typography>

                    {Array.isArray(popupInfo?.products) && (
                      <AvatarGroup total={popupInfo?.products.length}>
                        {popupInfo?.products.map((prd) => (
                          <Tooltip
                            title={
                              <Stack>
                                <Typography color="inherit" variant="body1">
                                  {prd.name}
                                </Typography>
                                <Typography color="inherit" variant="caption">
                                  Quantity x{prd.quantity}
                                </Typography>
                                <Typography color="inherit" variant="caption">
                                  Q x{prd.quantity * prd.price}
                                </Typography>
                              </Stack>
                            }
                            arrow
                          >
                            <Avatar key={prd._id.toString()} alt={prd.name} src={prd.coverUrl} />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    )}
                  </MapPopup>
                )}
                {mdUp && (
                  <RouteMapControlPanel>
                    <IconButton
                      onClick={isLocked.onToggle}
                      sx={{
                        position: 'absolute',
                        top: mdUp ? 10 : 15,
                        right: mdUp ? 10 : 5,
                        zIndex: 1,
                        bgcolor: 'common.white',
                        color: 'common.black',
                        p: 0.5,
                        borderRadius: theme.spacing(1),
                        '&:hover': {
                          bgcolor: 'common.white',
                          color: 'common.black',
                        },
                      }}
                    >
                      {isLocked.value ? (
                        <Iconify icon="basil:lock-solid" width={24} />
                      ) : (
                        <Iconify icon="basil:unlock-solid" width={24} />
                      )}
                    </IconButton>
                    {childrenControlPanel}
                  </RouteMapControlPanel>
                )}
              </Map>
            )}
          </StyledRoot>
        </Grid>
        {!mdUp && (
          <Grid xs={12}>
            <RouteMapControlPanel>{childrenControlPanel}</RouteMapControlPanel>
          </Grid>
        )}
      </Grid>
    );
  }
);

export default UserActivityRoutesMap;
