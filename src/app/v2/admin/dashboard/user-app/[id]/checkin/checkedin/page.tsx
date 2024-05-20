'use client';

import React from 'react';
import { Container,Typography, Tabs, Tab , Grid} from '@mui/material';
import { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';
import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import { SystemIcon } from 'src/components/iconify';




export const DASHBOARD_OVERVIEW_DETAILS_TABS = [
  { value: 'sales', label: 'Sales' },
  { value: 'payments', label: 'Payments' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'route', label: 'Route' },
];
function Sales() {
   const router = useRouter();
  const searchParams = useSearchParams();
  const searchTabValue = searchParams.get('tab')
  const [currentTab, setCurrentTab] = useState(searchTabValue ?? 'sales');

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
  <Container>
 <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography>
      <Grid container spacing={4} columns={16}>
          <Grid xs={8}>
            <AnalyticsWidgetSummary
              title="Sales Target"
              total={100}
              icon={<SystemIcon type="client" width={45} sx={{ color: 'success.main' }} />} // Example icon for engagement
            />
          </Grid>

          <Grid xs={8}>
            <AnalyticsWidgetSummary
              title="Revenue"
              total={20}
              color="info"
              icon={<SystemIcon type="campaign" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
            />
          </Grid>
        </Grid>  
      {renderTabs}
      {
        currentTab === "sales" &&
        <Typography>Sales</Typography>
      }
      {
        currentTab === "payments" && 
        <Typography>Payments</Typography>
      }
      {
        currentTab === "feedback" && 
        <Typography>Feedback</Typography>
      }
      {
        currentTab === "route" && 
        <Typography>Route</Typography>
      }
  </Container>
  );
}

export default Sales;
