'use client';

import { useState, useEffect, useCallback } from 'react';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';

import { _user_routes, USER_ROUTE_STATUS_OPTIONS } from 'src/_mock';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content';
import { useSettingsContext } from 'src/components/settings';

import { IUserRouteShippingAddress } from 'src/types/user-routes';

import UserRoutesMap from '../user-routes-map';
import { UserRoutesDetailsSkeleton } from '../user-routes-skeleton';
import UserRoutesDetailsToolbar from '../user-routes-details-toolbar';

// ----------------------------------------------------------------------

export default function UserRoutesDetailsView({ id }: { id: string }) {
  const renderSkeleton = <UserRoutesDetailsSkeleton />;

  const settings = useSettingsContext();

  const [route, setRoute] = useState<IUserRouteShippingAddress[] | undefined>(undefined)
  const [routeError, setRouteError] = useState<String | undefined>(undefined)
  const routeLoading = useBoolean();

  const [status, setStatus] = useState('');

  useEffect(() => {
    const r = _user_routes?.find(x => x._id)
    console.log(r, "R")
    if (!r) {
      setRouteError("Failed to display route")
    }
    if (r) {
      setRoute(r.shippingAddress);
      setStatus(r.status)
    }

  }, [id])


  const handleChangeState = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  const renderError = (
    <EmptyContent
      filled
      title={`${routeError}`}
      action={
        <Button
          component={RouterLink}
          href={paths.dashboard.userRoutes.root}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
          sx={{ mt: 3 }}
        >
          Back to List
        </Button>
      }
      sx={{ py: 10 }}
    />
  );

  const renderRoute = route && (
    <>
      <UserRoutesDetailsToolbar
        backLink={paths.dashboard.userRoutes.root}
        // editLink={paths.dashboard.userRoutes.edit(`${route?.id}`)}
        editLink="EDIT"
        onChangeState={handleChangeState}
        statusOptions={USER_ROUTE_STATUS_OPTIONS}
        status={status}
      />
      <UserRoutesMap contacts={route.map((addrs) => ({
        latlng: [Number(addrs.longitude), Number(addrs.latitude)],
        address: addrs.fullAddress,
        phoneNumber: addrs.phoneNumber,
        products: addrs.products
      }))} />
    </>
  );

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {routeLoading.value && renderSkeleton}

      {routeError && renderError}

      {route && renderRoute}
    </Container>
  );
  // return (
  //   <Container sx={{ py: 10 }}>
  //     <Box
  //       gap={10}
  //       display="grid"
  //       gridTemplateColumns={{
  //         xs: 'repeat(1, 1fr)',
  //         md: 'repeat(2, 1fr)',
  //       }}
  //     >
  //       <ContactMap contacts={_mapContact} />
  //     </Box>
  //   </Container>
  // );
}


