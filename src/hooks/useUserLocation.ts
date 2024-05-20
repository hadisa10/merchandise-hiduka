import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { MAPBOX_API } from 'src/config-global';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  placeName: string | null;
  error: string | null;
  loading: boolean;
}

const useUserLocation = (): LocationState => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    placeName: null,
    error: null,
    loading: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchPlaceName = async (latitude: number, longitude: number) => {
    try {
      const response = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        {
          params: {
            access_token: MAPBOX_API,
          },
        }
      );
      const placeName = response.data.features[0]?.place_name || 'Unknown location';
      return placeName;
    } catch (error) {
      console.error('Error fetching place name:', error);
      return 'Unknown location';
    }
  };

  useEffect(() => {
    if (!navigator.onLine) {
      setLocation({
        latitude: null,
        longitude: null,
        placeName: null,
        error: 'Device is offline',
        loading: false,
      });
      enqueueSnackbar('Device is offline. Cannot fetch location.', { variant: 'warning' });
      return;
    }

    const geo = navigator.geolocation;
    if (!geo) {
      setLocation((prevState) => ({
        ...prevState,
        error: 'Geolocation is not supported by this browser.',
        loading: false,
      }));
      enqueueSnackbar('Geolocation is not supported by this browser.', { variant: 'error' });
      return;
    }

    const watcher = geo.watchPosition(
      async (position) => {
        console.log(position.coords.accuracy, 'ACCURACY');
        if (position.coords.accuracy <= 1000) {
          // Adjusted accuracy threshold
          const {latitude} = position.coords;
          const {longitude} = position.coords;
          const placeName = await fetchPlaceName(latitude, longitude);
          setLocation({
            latitude,
            longitude,
            placeName,
            error: null,
            loading: false,
          });
          // enqueueSnackbar(`Location fetched successfully: ${placeName}`, { variant: 'success' });
        } else {
          setLocation((prevState) => ({
            ...prevState,
            error: 'Location accuracy is too low',
            loading: false,
          }));
          // enqueueSnackbar('Location accuracy is too low.', { variant: 'warning' });
        }
      },
      (error) => {
        let errorMessage = 'Failed to get user location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'User denied the request for Geolocation.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
            break;
          default:
            errorMessage = 'An unknown error occurred.';
            break;
        }
        // enqueueSnackbar(errorMessage, { variant: 'error' });
        setLocation((prevState) => ({ ...prevState, error: errorMessage, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 120000, maximumAge: 0 }
    );

    // Clean up the watcher when the component is unmounted or dependencies change
    // eslint-disable-next-line consistent-return
    return () => geo.clearWatch(watcher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return location;
};

export default useUserLocation;
