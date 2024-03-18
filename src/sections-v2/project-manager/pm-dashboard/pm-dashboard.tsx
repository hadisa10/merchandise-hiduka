'use client';

import { useSearchParams } from 'next/navigation'
import { useMemo, useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';

import PMDashboardCampaignMetrics from './pm-dash-components/pm-campaigns-metrics';
import PMDashboardInventoryMetrics from './pm-dash-components/pm-inventory-metrics';

// ----------------------------------------------------------------------

export const DASHBOARD_OVERVIEW_DETAILS_TABS = [
  { value: 'projects', label: 'Projects' },
  { value: 'sales_inventory', label: 'Sales & Inventory' },
];

// ----------------------------------------------------------------------


export default function PMDashboardView() {
  const router = useRouter();

  const searchParams = useSearchParams();

  const settings = useSettingsContext();

  const realmApp = useRealmApp();

  const searchTabValue = searchParams.get('tab')

  const [currentTab, setCurrentTab] = useState(searchTabValue ?? 'projects');

  // @ts-expect-error expected
  const role: ERole = useMemo(() => realmApp.currentUser?.customData.role as unknown, [realmApp.currentUser?.customData.role])


  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
    const tabParams = new URLSearchParams({
      tab: newValue,
    }).toString();

    // @ts-expect-error expected
    const href = `${paths.v2[role].root}?${tabParams}`;
    router.push(href);
  }, [router, role]);


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
        currentTab === "projects" &&
        <PMDashboardCampaignMetrics />
      }
      {
        currentTab === "sales_inventory" && <PMDashboardInventoryMetrics />
      }
    </Container>
  );
}

