"use client"

import { lazy, useMemo, useState, Suspense, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { LoadingScreen } from 'src/components/loading-screen';

import { IClient } from 'src/types/client';

import ClientNewEditForm from './client-new-edit-form';

const ProductClientListDataGrid = lazy(() => import('../product/product-client-list-data-grid'));

// const ReportListDataGrid = lazy(() => import('../reports/view/report-list-data-grid'));

// const DETAILS_FIELDS = ['title', 'users', 'description', 'workingSchedule']
// const ROUTES_FIELDS = ['routes']

// ----------------------------------------------------------------------

type Props = {
  currentClient?: IClient;
};


export const CLIENT_DETAILS_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'products', label: 'Products' },
];


export default function ClientEditTabs({ currentClient }: Props) {

  const [currentTab, setCurrentTab] = useState('details');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const tabArray = useMemo(() => CLIENT_DETAILS_TABS.filter(x => {
    if (currentClient) {
      return true;
    }
    switch (x.value) {
      case "products":
        return false;
      default:
        return true;
    }
  }), [currentClient])

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {tabArray.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
        //   icon={
        //     tabErrors(tab.value)?.length > 1 ?
        //       <Label variant="soft" color='error'>{tabErrors(tab.value)?.length}</Label>
        //       :
        //       ''
        //   }
        />
      ))}
    </Tabs>
  );

  return (
    <>
      {renderTabs}
      {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><ClientNewEditForm /></Suspense>}
      {currentTab === 'products' && currentClient && <Suspense fallback={<LoadingScreen />}> <ProductClientListDataGrid clientId={currentClient?._id.toString() ?? ""} /></Suspense>}
    </>
  );
}