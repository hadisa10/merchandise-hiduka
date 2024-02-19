'use client';

import { useState, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import AnalyticsComingSoon from './campaign/coming-soon';

// ----------------------------------------------------------------------

export const ANALYTICS_OVERVIEW_DETAILS_TABS = [
  { value: 'active', label: 'Daily Active Users' },
  { value: 'task', label: 'Task Completion Rate' },
  { value: 'engagement', label: 'User Engagement Score' },
];

// ----------------------------------------------------------------------

export default function UserPerformanceAnalyticsView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('active');

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
      {ANALYTICS_OVERVIEW_DETAILS_TABS.map((tab) => (
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
      {currentTab === "active" && <AnalyticsComingSoon />}
      {currentTab === "task" && <AnalyticsComingSoon />}
      {currentTab === "engagement" && <AnalyticsComingSoon />}

    </Container>
  );
}
