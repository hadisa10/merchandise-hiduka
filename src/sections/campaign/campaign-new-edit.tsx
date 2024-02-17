"use client"

import * as Yup from 'yup';
import { isNumber } from 'lodash';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import { createObjectId } from 'src/utils/realm';

import Label from 'src/components/label';
import FormProvider from 'src/components/hook-form/form-provider';

import { IRoute, ICampaign, ICampaign_routes } from 'src/types/realm/realm-types';

import { CampaignReportList } from './list';
import CampaignDetailsToolbar from './campaign-details-toolbar';
import RouteCreateEditForm from './edit/route-create-edit-form';
import CampaignNewEditRouteForm from './edit/campaign-new-edit-route';
import CampaignNewEditDetailsForm from './edit/campaign-new-edit-details-form';

const DETAILS_FIELDS = ['title', 'users', 'description', 'workingSchedule']
const ROUTES_FIELDS = ['routes']

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
};


export const CAMPAING_DETAILS_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'reports', label: 'Reports' },
  { value: 'routes', label: 'Routes' },
];


function generateAccessCode() {
  return Math.floor(10000 + Math.random() * 90000).toString();
}

export default function CampaignNewEditForm({ currentCampaign }: Props) {

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const { saveCampaign, updateCampaign } = useCampaigns();

  const open = useBoolean();

  const [newGeoLocation, setNewGeoLocation] = useState<{ lat: number, lng: number } | null>(null);


  const handleNewRouteOpen = useCallback(({ lat, lng }: { lat: number, lng: number }) => {
    console.log(lat, "LATITUDE")
    console.log(lng, "LONGITUDE")
    setNewGeoLocation({ lat, lng });
    open.onTrue()
  }, [open])



  const [currentTab, setCurrentTab] = useState('details');

  const routeAddressSchema = Yup.object().shape({
    fullAddress: Yup.string().required('Full address is required'),
    _id: Yup.string().required('Address ID is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    road: Yup.string().required('Road is required'),
    location: Yup.object().shape({
      type: Yup.string().required('Location type is required'),
      coordinates: Yup.array()
        .of(Yup.number().required('Coordinate is required'))
        .min(2, 'At least two coordinates are required')
        .max(2, 'Only two coordinates are required (longitude and latitude)'),
    }),
  });

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
    users: Yup.lazy(() => Yup.array().of(Yup.string().required('User is required')).min(1, 'Select atleas one user')),
    routes: Yup.lazy(() =>
      Yup.array().of(
        Yup.object().shape({
          _id: Yup.string().required('Id is required'),
          createdAt: Yup.date().required('Creation date is required'),
          updatedAt: Yup.date().required('Update date is required'),
          routeNumber: Yup.number().required('Route number is required'),
          totalQuantity: Yup.number().required('Total quantity is required'),
          routeAddress: routeAddressSchema,
        })
      )
    ),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentCampaign?.title || '',
      description: currentCampaign?.description || '',
      users: currentCampaign?.users?.map(user => user.toString()) || [],
      routes: currentCampaign?.routes?.map(r => {
        const _id = r._id.toString()
        if (r.routeAddress) {
          const addrs = {
            ...r.routeAddress,
            _id: r.routeAddress?._id.toString()
          }
          return {
            ...r,
            _id,
            routeAddress: addrs
          }
        }
        return {
          ...r
        }

      }) || [],
    }),
    [currentCampaign]
  );

  const methods = useForm({
    // @ts-expect-error expected
    resolver: yupResolver(NewCurrectSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields: campaignRoutes, append, remove } = useFieldArray({
    control,
    name: "routes",
  });

  const handleAddNewRoute = useCallback((route: IRoute) => {
    // Convert route details to match the form's expected structure
    const rtAddrs = {
      _id: route._id,
      fullAddress: route.fullAddress,
      location: route.location,
      phoneNumber: route.phoneNumber ?? '',
      road: route.road ?? ''
    }
    const dt = new Date();
    const routeForForm: ICampaign_routes = {
      _id: createObjectId(), // Ensure _id is a string to match the form's expectation
      routeAddress: rtAddrs,
      routeNumber: Array.isArray(campaignRoutes) ? campaignRoutes.length + 1 : 1,
      totalQuantity: 0,
      createdAt: dt,
      updatedAt: dt,
    };
    append(routeForForm);
  }, [append, campaignRoutes]);

  const handleRemoveNewRoute = useCallback((routeIndex: number) => {
    if (isNumber(routeIndex)) {
      remove(routeIndex)
    }
  }, [remove])

  const tabErrors = useCallback((tab: string) => {
    const y = Object.entries(errors).filter(([key, val]) => {
      console.log(key, "ERROR KEYS")
      switch (tab) {
        case 'details':
          return DETAILS_FIELDS.includes(key)
        case 'routes':
          return ROUTES_FIELDS.includes(key)
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
      if (!currentCampaign) {
        const campaign: ICampaign = {
          _id: createObjectId(),
          access_code: generateAccessCode(),
          client_id: createObjectId(),
          description: data.description ?? '',
          products: [],
          users: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(),
          project_id: createObjectId(),
          // @ts-expect-error expected
          routes: data.routes,
          title: data.title,
          today_checkin: 0,
          total_checkin: 0,
          type: "RSM"
        };
        await saveCampaign(campaign)
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.campaign.root);
        console.info('DATA', data);
      } else {
        const campaign: ICampaign = {
          description: data.description ?? '',
          products: [],
          users: [],
          updatedAt: new Date(),
          startDate: new Date(),
          endDate: new Date(),
          project_id: createObjectId(),
          // @ts-expect-error expected
          routes: data.routes,
          title: data.title,
          today_checkin: 0,
          total_checkin: 0,
          type: "RSM"
        };
        await updateCampaign(campaign)
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.campaign.root);
        console.info('DATA', data);
      }
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
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <CampaignDetailsToolbar
          currentCampaign={currentCampaign}
          isSubmitting={isSubmitting}
          backLink={paths.dashboard.campaign.root}
        />
        {renderTabs}
        {currentTab === 'details' && <CampaignNewEditDetailsForm currentCampaign={currentCampaign} />}
        {currentTab === 'reports' && <CampaignReportList />}
        {
          currentTab === 'routes' &&
          <CampaignNewEditRouteForm
            currentCampaign={currentCampaign}
            handleNewRouteOpen={handleNewRouteOpen}
            handleRemoveNewRoute={handleRemoveNewRoute}
            // @ts-expect-error campaign routes typescript error
            campaignRoutes={campaignRoutes}

          />
        }
      </FormProvider>
      {newGeoLocation && <RouteCreateEditForm newGeoLocation={newGeoLocation} handleAddNewRoute={handleAddNewRoute} open={open.value} onClose={open.onFalse} />}
    </>
  );
}