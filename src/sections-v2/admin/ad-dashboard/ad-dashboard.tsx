'use client';

import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useSettingsContext } from 'src/components/settings';

import AdminDashboardCampaignMetrics from './ad-dash-components/ad-campaigns-metrics';
import AdminDashboardInventoryMetrics from './ad-dash-components/ad-inventory-metrics';

// ----------------------------------------------------------------------

export const DASHBOARD_OVERVIEW_DETAILS_TABS = [
  { value: 'system-overview', label: 'System Overview' },
  { value: 'sales_inventory', label: 'Sales & Inventory' },
];

// ----------------------------------------------------------------------


export default function AdminDashboardView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const settings = useSettingsContext();

  const searchTabValue = searchParams.get('tab')

  const [currentTab, setCurrentTab] = useState(searchTabValue ?? 'system-overview');


  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    const tabParams = new URLSearchParams({
      tab: newValue,
    }).toString();

    const href = `${paths.v2.admin.root}?${tabParams}`;
    router.push(href);
  }, [router]);


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
        currentTab === "system-overview" &&
        <AdminDashboardCampaignMetrics />
      }
      {
        currentTab === "sales_inventory" && <AdminDashboardInventoryMetrics />
      }
    </Container>
  );
}

