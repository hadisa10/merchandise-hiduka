import { first } from 'lodash';
import { FeatureCollection } from 'geojson';
import Map, { Layer, Source } from 'react-map-gl';
import { useMemo, useState, useEffect } from 'react';

import Typography from '@mui/material/Typography';
import { Avatar, AvatarGroup, Stack, Tooltip } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

import { MAPBOX_API } from 'src/config-global';
import { useGetDirections } from 'src/api/routes';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { MapPopup, MapMarker, MapControl } from 'src/components/map';

import { IUserRouteProductItem } from 'src/types/user-routes';
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  zIndex: 0,
  height: 560,
  overflow: 'hidden',
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  '& .mapboxgl-ctrl-logo, .mapboxgl-ctrl-bottom-right': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

type CountryData = {
  latlng: number[];
  address: string;
  phoneNumber: string;
  products: IUserRouteProductItem[]
};

type Props = {
  contacts: CountryData[];
};

export default function UserRoutesMap({ contacts }: Props) {
  const theme = useTheme();

  const { currentUser } = useRealmApp();

  const lightMode = theme.palette.mode === 'light';

  const [popupInfo, setPopupInfo] = useState<CountryData | null>(null);
  const [userLocation, setUserLocation] = useState<CountryData>({
    latlng: [-1.447, 37.805],
    address: currentUser?.customData?.displayName as string ?? 'ME',
    phoneNumber: currentUser?.customData?.phoneNumber as string ?? 'no-number',
    products: [],
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          console.log(longitude, 'LONGITUDE');
          console.log(latitude, 'LATITUDE');
          setUserLocation({
            latlng: [latitude, longitude],
            address: currentUser?.customData?.displayName as string ?? 'ME',
            phoneNumber: currentUser?.customData?.phoneNumber as string ?? 'no-number',
            products: [],
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setUserLocation({
            latlng: [-1.447, 37.805],
            address: currentUser?.customData?.displayName as string ?? 'ME',
            phoneNumber: currentUser?.customData?.phoneNumber as string ?? 'no-number',
            products: [],
          });
        }
      );
    } else {
      setUserLocation({
        latlng: [-1.447, 37.805],
        address: currentUser?.customData?.displayName as string ?? 'ME',
        phoneNumber: currentUser?.customData?.phoneNumber as string ?? 'no-number',
        products: [],
      });
    }
  }, [currentUser]);

  const directionsCoord = useMemo(() => ([userLocation, ...contacts].map(x => ([x.latlng[1], x.latlng[0]]))), [contacts, userLocation])

  const { directions } = useGetDirections(directionsCoord);



  const initialState = useMemo(() => {
    if (!Array.isArray(contacts)) return {
      latitude: 37.805,
      longitude: -122.447,
      zoom: 11
    };
    const startPoint = first(contacts)
    if (startPoint) {
      const [latitude, longitude] = startPoint.latlng;
      return {
        latitude,
        longitude,
        zoom: 12
      }
    }
    return {
      latitude: 37.805,
      longitude: -122.447,
      zoom: 12
    }
  }, [contacts])

  const coordinates = useMemo(() => {
    if (Array.isArray(directions)) {
      return directions[0].geometry.coordinates
    }
    return []
  }, [directions])

  const geojson: FeatureCollection<any> = useMemo(() => ({
    "type": "FeatureCollection",
    "features": [{
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          ...coordinates
        ],
      },
      "properties": {}
    }]
  }), [coordinates])

  const lineStyle = {
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round"
    },
    paint: {
      "line-color": lightMode ? theme.palette.primary.main : theme.palette.info.light,
      "line-width": 6,
      "line-opacity": 0.75
    }
  }


  return (
    <StyledRoot>
      <Map
        initialViewState={initialState}
        // mapStyle={`mapbox://styles/mapbox/${lightMode ? 'light' : 'dark'}-v10`}
        mapStyle={`mapbox://styles/mapbox/navigation-${lightMode ? 'day' : 'night'}-v1`}
        mapboxAccessToken={MAPBOX_API}
      >
        <Source id='route-source' type='geojson' data={geojson}>
          {/** @ts-expect-error expected * */}
          <Layer {...lineStyle} />
        </Source>
        <MapControl />

        {Array.isArray(contacts) && [userLocation, ...contacts].map((country, index) => (
          <MapMarker
            key={`marker-${index}`}
            latitude={country.latlng[0]}
            longitude={country.latlng[1]}
            onClick={(event) => {
              event.originalEvent.stopPropagation();
              setPopupInfo(country);
            }}
          />
        ))}

        {popupInfo && (
          <MapPopup
            longitude={popupInfo.latlng[1]}
            latitude={popupInfo.latlng[0]}
            onClose={() => setPopupInfo(null)}
            sx={{
              '& .mapboxgl-popup-content': { bgcolor: 'common.white', color: 'common.black' },
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
              <Typography variant='caption'>Ksh {popupInfo.products.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0)}</Typography>
            </Typography>

            {
              Array.isArray(popupInfo.products) &&
              <AvatarGroup total={popupInfo.products.length}>
                {popupInfo.products.map((prd) =>
                (
                  <Tooltip title={
                    <Stack>
                      <Typography color="inherit" variant='body1'>{prd.name}</Typography>
                      <Typography color="inherit" variant='caption'>Quantity x{prd.quantity}</Typography>
                      <Typography color="inherit" variant='caption'>Total x{prd.quantity * prd.price}</Typography>
                    </Stack>
                  } arrow>
                    <Avatar key={prd.id} alt={prd.name} src={prd.coverUrl} />
                  </Tooltip>
                ))}
              </AvatarGroup>
            }

          </MapPopup>
        )}
      </Map>
    </StyledRoot>
  );
}
