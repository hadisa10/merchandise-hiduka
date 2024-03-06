'use client';


import { enqueueSnackbar } from 'notistack';
import { memo, useState, useEffect } from 'react';

import Grid from '@mui/material/Unstable_Grid2';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { SystemIcon } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';

import { IAdminDashboardInventoryMetrics } from 'src/types/realm/realm-types';

function AdminDashboardInventoryMetrics() {

  const realmApp = useRealmApp()



  const inventoryloading = useBoolean()

  const showInventoryLoader = useShowLoader((inventoryloading.value), 300);


  const [dashboardInventoryMetrics, setDashboarInventoryMetrics] = useState<IAdminDashboardInventoryMetrics | null>(null);


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    inventoryloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getInventoryDashboardMetrics().then((data: IAdminDashboardInventoryMetrics) => setDashboarInventoryMetrics(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
      }
      )
      .finally(() => inventoryloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <>
      {showInventoryLoader && <LoadingScreen />}
      {
        !showInventoryLoader &&
        dashboardInventoryMetrics &&
        <Grid container spacing={3}>
          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Products"
              total={dashboardInventoryMetrics.totalProducts ?? 0}
              icon={<SystemIcon type="client" width={45} sx={{ color: 'success.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Sold"
              total={dashboardInventoryMetrics.totalSold ?? 0}
              color="info"
              icon={<SystemIcon type="merchandising" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Avarage Product price"
              total={dashboardInventoryMetrics.averagePrice}
              color="warning"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'primary.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={12} sm={6} md={3}>
            <AnalyticsWidgetSummary
              title="Total Stock"
              total={dashboardInventoryMetrics.totalStock}
              color="error"
              icon={<SystemIcon type="checkin" width={45} sx={{ color: 'error.main' }} />} // Example icon for engagement
            />
          </Grid>
        </Grid>
      }
    </>
  );
}

export default memo(AdminDashboardInventoryMetrics)