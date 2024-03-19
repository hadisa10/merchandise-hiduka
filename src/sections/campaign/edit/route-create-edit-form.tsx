import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useRealmRoutes } from 'src/hooks/realm/route/use-route-graphql';

import { createObjectId } from 'src/utils/realm';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IRoute, ICampaign_routes_routeAddress } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  currentRoute?: ICampaign_routes_routeAddress;
  newGeoLocation: { lat: number, lng: number };
  handleAddNewRoute: (route: IRoute) => void;
};

export default function RouteCreateEditForm({ currentRoute, newGeoLocation, handleAddNewRoute, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  const { saveRoute } = useRealmRoutes();
  const coordinatesSchema = Yup.array().of(Yup.number().required())
    .length(2, 'Coordinates must be an array of two numbers')
    .test('lon-lat', 'Coordinates must have a valid longitude and latitude', values => {
      const [lat, lon] = values || [];
      return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
    });

  // Updated schema for the location object to validate a GeoPoint
  const locationSchema = Yup.object().shape({
    type: Yup.string().required().matches(/Point/, 'type must be Point'),
    coordinates: coordinatesSchema
  });
  // Define the main schema for the routeAddress object
  const RouteAddressSchema = Yup.object().shape({
    fullAddress: Yup.string().required('Full address is required'),
    location: locationSchema,
    // Validate longitude as a number within the range of -180 to 180
    longitude: Yup.number().required('Longitude is required').min(-180, 'Longitude must be between -180 and 180').max(180, 'Longitude must be between -180 and 180'),
    // Validate latitude as a number within the range of -90 to 90
    latitude: Yup.number().required('Latitude is required').min(-90, 'Latitude must be between -90 and 90').max(90, 'Latitude must be between -90 and 90'),
    phoneNumber: Yup.string().required('Phone number is required').matches(/^\+\d{7,15}$/, 'phoneNumber must be a valid phone number'),
    road: Yup.string().required('Road is required'),
    businessSector: Yup.string().required('Business sector is required')
  });

  const defaultValues = useMemo(
    () => {
      const { lat, lng } = newGeoLocation;

      if (currentRoute) {
        return {
          fullAddress: currentRoute?.fullAddress || '',
          longitude: lng ?? 0,
          latitude: lat ?? 0,
          location: {
            type: currentRoute?.location?.type || 'Point', // Default to 'Point' if not specified
            coordinates: [lat, lng] || [0, 0], // Default coordinates if not specified
          },
          phoneNumber: currentRoute?.phoneNumber || '',
          road: currentRoute?.road || '',
          businessSector: ''
        }
      } 
        return {
          fullAddress: '',
          longitude: lng,
          latitude: lat,
          location: {
            type: 'Point', // Default to 'Point' if not specified
            coordinates: [lng, lat], // Default coordinates if not specified
          },
          phoneNumber: '',
          road: '',
          businessSector: ''
        }
      

    },
    [currentRoute, newGeoLocation]
  );

  const methods = useForm({
    resolver: yupResolver(RouteAddressSchema),
    defaultValues,
  });

  const {
    watch,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    // Construct new default values based on the newGeoLocation
    const newDefaultValues = {
      fullAddress: currentRoute?.fullAddress || '',
      longitude: newGeoLocation.lng,
      latitude: newGeoLocation.lat,
      location: {
        type: 'Point',
        coordinates: [newGeoLocation.lat,newGeoLocation.lng,],
      },
      phoneNumber: currentRoute?.phoneNumber || '',
      road: currentRoute?.road || '',
      businessSector: '',
    };

    // Reset the form with the new default values
    reset(newDefaultValues);
  }, [newGeoLocation, reset, currentRoute]);



  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const dt = new Date();
      const route: IRoute = {
        _id: createObjectId(),
        businessSector: data.businessSector,
        fullAddress: data.fullAddress,
        // @ts-expect-error expected
        location: data.location,
        phoneNumber: data.phoneNumber,
        road: data.road,
        users: [],
        campaigns: [],
        createdAt: dt,
        updatedAt: dt
      }
      await saveRoute(route)
      reset();
      onClose();
      enqueueSnackbar('Route created!');
      handleAddNewRoute(route);
      console.info('DATA', data);
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed error!', { variant: "error" });
    }
  });

  useEffect(() => {

  }, [values.longitude, values.latitude])

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 720 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add Route</DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="fullAddress" label="Full Address" />
            <RHFTextField name="businessSector" label="Business Sector" />
            <RHFTextField name="longitude" label="Longitude" type="number" />
            <RHFTextField name="latitude" label="Latitude" type="number" />
            <RHFTextField name="phoneNumber" label="Phone Numeber" />
            <RHFTextField name="road" label="Road" />

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
