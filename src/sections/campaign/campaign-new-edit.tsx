"use client"

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import Label from 'src/components/label';
import FormProvider from 'src/components/hook-form/form-provider';

import { ICampaign } from 'src/types/realm/realm-types';

import { CampaignReportList } from './list';
import CampaignDetailsToolbar from './campaign-details-toolbar';
import CampaignNewEditRouteForm from './edit/campaign-new-edit-route';
import CampaignNewEditDetailsForm from './edit/campaign-new-edit-details-form';
import { createObjectId } from 'src/utils/realm';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

const DETAILS_FIELDS = ['title', 'users', 'description', 'workingSchedule']

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
};


export const CAMPAING_DETAILS_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'reports', label: 'Reports' },
  { value: 'routes', label: 'Routes' },
];

export type IRoute = Array<any>


function generateAccessCode() {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
}

export default function CampaignNewEditForm({ currentCampaign }: Props) {

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { saveCampaign } = useCampaigns();


  const [currentTab, setCurrentTab] = useState('details');

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    users: Yup.lazy(() => Yup.array().of(Yup.string().required('User is required')).min(1, 'Select atleas one user'))
  });

  const defaultValues = useMemo(
    () => ({
      title: currentCampaign?.title || '',
      users: currentCampaign?.users.map(user => user.toString()) || []
    }),
    [currentCampaign]
  );

  const methods = useForm({
    resolver: yupResolver(NewCurrectSchema),
    defaultValues,
  });

  const {
    reset,
    // control,
    // setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const tabErrors = useCallback((tab: string) => {
    const y = Object.entries(errors).filter(([key, val]) => {
      switch (tab) {
        case 'details':
          return DETAILS_FIELDS.includes(key)
        default:
          return false
      }
    })
    return y;
  }, [errors])



  useEffect(() => {
    if (currentCampaign) {
      reset(defaultValues);
    }
  }, [currentCampaign, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      reset();
      const campaign: ICampaign = {
        _id: createObjectId(),
        access_code: generateAccessCode(),
        client_id: createObjectId(),
        products: [],
        users: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        project_id: createObjectId(),
        routes: [
          {
            _id: createObjectId(),
            routeNumber: "Route001",
            routeAddress: {
              _id: createObjectId(),
              fullAddress: "Naivas Supermarket-Mountain View, PPMR+7QF, Mountain View Mall, Off Waiyaki Way, Nairobi",
              location: {
                type: "Point",
                coordinates: [
                  36.740946588285425,
                  -1.2594064822986786
                ]
              },
              phoneNumber: "+254712345679",
              road: "Waiyaki Way",
            },
            checkins: [],
            totalQuantity: 0,
            updatedAt: new Date(),
            createdAt: new Date()
          },
          {
            _id: createObjectId(),
            routeNumber: "Route002",
            routeAddress: {
              _id: createObjectId(),
              fullAddress: "Naivas, Waiyaki Way, Nairobi",
              location: {
                type: "Point",
                coordinates: [
                  36.80199644276411,
                  -1.264780592401393
                ]
              },
              phoneNumber: "+254712345678",
              road: "Waiyaki Way"
            },
            checkins: [],
            totalQuantity: 0,
            updatedAt: new Date(),
            createdAt: new Date()
          }
        ],
        title: data.title,
        today_checkin: 0,
        total_checkin: 0,
        type: "RSM"
      };
      console.log(data, "DATA");

      await saveCampaign(campaign)

      enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
      router.push(paths.dashboard.campaign.root);
      console.info('DATA', data);
    } catch (error) {
      enqueueSnackbar(currentCampaign ? 'Update failed!' : 'Failed to create campaign!');
      console.error(error);
    }
  });

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
      {CAMPAING_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tabErrors(tab.value)?.length > 1 ?
              <Label variant="soft" color='error'>{tabErrors(tab.value)?.length}</Label>
              :
              ''
          }
        />
      ))}
    </Tabs>
  );

  return (

    <FormProvider methods={methods} onSubmit={onSubmit}>
      <CampaignDetailsToolbar
        currentCampaign={currentCampaign}
        isSubmitting={isSubmitting}
        backLink={paths.dashboard.campaign.root}
      />
      {renderTabs}
      {currentTab === 'details' && <CampaignNewEditDetailsForm currentCampaign={currentCampaign} />}
      {currentTab === 'reports' && <CampaignReportList />}
      {currentTab === 'routes' && <CampaignNewEditRouteForm currentCampaign={currentCampaign} />}
    </FormProvider>
  );
}