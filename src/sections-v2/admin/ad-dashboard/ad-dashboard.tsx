'use client';

import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { IAdminDashboardData, IAdminDashboardReportSummary } from 'src/types/realm/realm-types';

import { AdminDashboardCampaignMetrics } from './ad-dash-components/ad-campaigns-metrics';



// ----------------------------------------------------------------------

export const DASHBOARD_OVERVIEW_DETAILS_TABS = [
  { value: 'campaigns', label: 'Campaigns' },
  { value: 'sale', label: 'Sales' },
  { value: 'inventory', label: 'Inventory' }
];

// ----------------------------------------------------------------------


export default function AdminDashboardView() {
  const settings = useSettingsContext();

  const realmApp = useRealmApp()

  const campaignloading = useBoolean()

  const reportsloading = useBoolean()

  const showCampaignLoader = useShowLoader((campaignloading.value || reportsloading.value), 300);

  const [currentTab, setCurrentTab] = useState('campaigns');

  const [dashboarCampaignMetrics, setDashboarCampaigndMetrics] = useState<IAdminDashboardData | null>(null);

  const [dashboarReportsMetrics, setDashboarReportsdMetrics] = useState<IAdminDashboardReportSummary | null>(null);


  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    campaignloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getDashboardMetrics().then((data: IAdminDashboardData) => setDashboarCampaigndMetrics(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
      }
      )
      .finally(() => campaignloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    campaignloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getReportDashboardMetrics().then((data: IAdminDashboardReportSummary) => setDashboarReportsdMetrics(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
      }
      )
      .finally(() => campaignloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])



  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {DASHBOARD_OVERVIEW_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
        />
      ))}
    </Tabs>
  );

  console.log(dashboarReportsMetrics, "dashboar Reports Metrics")

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>

      {renderTabs}

      {
        showCampaignLoader && !error && <LoadingScreen />
      }

      {
        currentTab === "campaigns" &&
        !showCampaignLoader && !error && dashboarCampaignMetrics && dashboarReportsMetrics &&
        <AdminDashboardCampaignMetrics dashboardMetrics={dashboarCampaignMetrics} dashboarReportsMetrics={dashboarReportsMetrics} />
      }
      {
        currentTab === "sale" &&
        <>SALE DASHBOARD</>
      }

{
        currentTab === "inventory" &&
        <>SALE DASHBOARD</>
      }
    </Container>
  );
}

