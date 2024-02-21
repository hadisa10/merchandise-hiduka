"use client"

import * as Yup from 'yup';
import { isNumber } from 'lodash';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { lazy, useMemo, useState, Suspense, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import { createObjectId } from 'src/utils/realm';
import { safeDateFormatter, removeAndFormatNullFields } from 'src/utils/helpers';

import Label from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';

import { IRoute, ICampaign, ICampaign_routes } from 'src/types/realm/realm-types';

import CampaignDetailsToolbar from './campaign-details-toolbar';
import RouteCreateEditForm from './edit/route-create-edit-form';

const ProductListDataGrid = lazy(() => import('../product/product-list-data-grid'));

const CampaignNewEditRouteForm = lazy(() => import('./edit/campaign-new-edit-route'));
const CampaignNewEditDetailsForm = lazy(() => import('./edit/campaign-new-edit-details-form'));
const ReportListDataGrid = lazy(() => import('../reports/view/report-list-data-grid'));

const DETAILS_FIELDS = ['title', 'users', 'description', 'workingSchedule']
const ROUTES_FIELDS = ['routes']

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
};


export const CAMPAING_DETAILS_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'reports', label: 'Reports' },
  { value: 'products', label: 'Products' },
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
    description: Yup.string(),
    // users: Yup.lazy(() => Yup.array().of(Yup.string()).min(1, 'Select atleas one user')).nullable(),
    users: Yup.array(),
    routes: Yup.lazy(() =>
      Yup.array().of(
        Yup.object().shape({
          _id: Yup.string().required('Id is required'),
          createdAt: Yup.date(),
          updatedAt: Yup.date(),
          routeNumber: Yup.number(),
          totalQuantity: Yup.number(),
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
    if (!(Array.isArray(campaignRoutes) && campaignRoutes.some(cmr => cmr._id.toString() === route._id?.toString()))) {
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
    } else {
      enqueueSnackbar("Route already selected", { variant: "error" })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, campaignRoutes]);

  const handleRemoveNewRoute = useCallback((routeIndex: number) => {
    if (isNumber(routeIndex)) {
      remove(routeIndex)
    }
  }, [remove])

  const tabErrors = useCallback((tab: string) => {
    const y = Object.entries(errors).filter(([key, val]) => {
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

  console.log(errors, 'ERRORS')

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data, "DATA")
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
          ...currentCampaign,
          description: data.description ?? '',
          // @ts-expect-error expected
          updatedAt: safeDateFormatter(),
          project_id: createObjectId(),
          // @ts-expect-error expected
          routes: data.routes.map(x => {
            if (!x.createdAt) {
              return {
                ...x,
                createdAt: safeDateFormatter,
                updatedAt: safeDateFormatter,
                totalQuantity: 0
              }
            }
            return x;
          }),
          title: data.title,
          today_checkin: 0,
          total_checkin: 0,
          type: "RSM"
        };
        const cleanData = removeAndFormatNullFields(campaign,
          [
            // {
            //   key: "_id",
            //   formatter: convertObjectId,
            // },
            {
              key: "createdAt",
              formatter: safeDateFormatter,
            },
            {
              key: "updatedAt",
              formatter: safeDateFormatter,
            }
          ]
        );
        // console.log(currentCampaign._id, 'CAMPAIGN ID')
        // console.log(JSON.stringify(cleanData))
        // return;
        if (cleanData) {
          await updateCampaign(cleanData)
        }
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.campaign.root);
        console.info('DATA', data);
      }
    } catch (error) {
      enqueueSnackbar(currentCampaign ? 'Update failed!' : 'Failed to create campaign!', { variant: "error" });
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
      {CAMPAING_DETAILS_TABS.filter(x => !(x.label === "routes" && !currentCampaign)).map((tab) => (
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

        {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><CampaignNewEditDetailsForm currentCampaign={currentCampaign} /></Suspense>}
        {currentTab === 'reports' && <Suspense fallback={<LoadingScreen />}> <ReportListDataGrid id={currentCampaign?._id.toString() ?? ""} /></Suspense>}
        {currentTab === 'products' && <Suspense fallback={<LoadingScreen />}> <ProductListDataGrid campaignId={currentCampaign?._id.toString() ?? ""} /></Suspense>}
        {currentTab === 'users' && <>USERS</>}
        <Suspense fallback={<LoadingScreen />}>
          {
            currentTab === 'routes' &&
            <CampaignNewEditRouteForm
              currentCampaign={currentCampaign}
              handleNewRouteOpen={handleNewRouteOpen}
              handleAddNewRoute={handleAddNewRoute}
              handleRemoveNewRoute={handleRemoveNewRoute}
              // @ts-expect-error campaign routes typescript error
              campaignRoutes={campaignRoutes}
            />
          }
        </Suspense>
      </FormProvider>
      {newGeoLocation &&
        <Suspense fallback={<LoadingScreen />}>
          <RouteCreateEditForm newGeoLocation={newGeoLocation} handleAddNewRoute={handleAddNewRoute} open={open.value} onClose={open.onFalse} />
        </Suspense>
      }
    </>
  );
}