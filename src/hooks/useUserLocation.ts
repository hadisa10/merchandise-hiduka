import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

const useUserLocation = (): LocationState => {
  const [location, setLocation] = useState<LocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: true,
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!navigator.onLine) {
      setLocation({ latitude: null, longitude: null, error: 'Device is offline', loading: false });
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
      (position) => {
        console.log(position.coords.accuracy, 'ACCURACY');
        if (position.coords.accuracy <= 40000) {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            error: null,
            loading: false,
          });
        } else {
          setLocation((prevState) => ({
            ...prevState,
            error: 'Location accuracy is too low',
            loading: false,
          }));
        }
      },
      (error) => {
        enqueueSnackbar('Failed to get user location', { variant: 'error' });
        setLocation((prevState) => ({ ...prevState, error: error.message, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Clean up the watcher when the component is unmounted or dependencies change
    // eslint-disable-next-line consistent-return
    return () => geo.clearWatch(watcher);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return location;
};

export default useUserLocation;
