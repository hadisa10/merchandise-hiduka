"use client"

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { isEmpty, isNumber } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { lazy, useMemo, useState, Suspense, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import { createObjectId, convertObjectId } from 'src/utils/realm';
import { safeDateFormatter, generateAccessCode, removeAndFormatNullFields } from 'src/utils/helpers';

import Label from 'src/components/label';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';

import { IRoute, ICampaign, ICampaignRoutes } from 'src/types/realm/realm-types';

import CampaignDetailsToolbar from './campaign-details-toolbar';
import RouteCreateEditForm from './edit/route-create-edit-form';

const ProductListDataGrid = lazy(() => import('../product/product-list-data-grid'));

const UserActivityView = lazy(() => import('./list/user-activity-2'));

const CampaignNewEditRouteForm = lazy(() => import('./edit/campaign-new-edit-route'));
const CampaignNewEditDetailsTab = lazy(() => import('./edit/campaign-new-edit-details-tab'));
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
  { value: 'users', label: 'User Activity' }
];




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
  const salesKpiSchema = Yup.object().shape({
    totalDailyUnits: Yup.number(),
    totalDailyRevenue: Yup.number()
  })

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    client_id: Yup.string().required("Client is required"),
    type: Yup.string().required("Campaign type is required"),
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
    hourlyRate: Yup.number().min(0).required("Hourly rate is required").typeError("Hourly rate must be a number"),
    inactivityTimeout: Yup.number().required("Inactivity limit required"),
    salesKpi: salesKpiSchema,
    startDate: Yup.date()
      .transform((value, originalValue) => {
        // Check if the originalValue is a number (Unix timestamp in milliseconds)
        if (typeof originalValue === 'number') {
          return new Date(originalValue);
        }
        // For string input, attempt to parse it as a date
        if (typeof originalValue === 'string') {
          return new Date(originalValue);
        }
        return value;
      })
      .required('Start date is required')
      .typeError('Start date must be a valid date, date-time string, or Unix timestamp'),
    endDate: Yup.date()
      .transform((value, originalValue) => {
        // Check if the originalValue is a number (Unix timestamp in milliseconds)
        if (typeof originalValue === 'number') {
          return new Date(originalValue);
        }
        // For string input, attempt to parse it as a date
        if (typeof originalValue === 'string') {
          return new Date(originalValue);
        }
        return value;
      })
      .required('End date is required')
      .typeError('End date must be a valid date, date-time string, or Unix timestamp')
      .test(
        'date-after-start',
        'End date must be after start date',
        (value, { parent }) => {
          const { startDate } = parent;
          // Ensure both startDate and endDate are valid Date objects before comparing
          return startDate && value && new Date(startDate) < new Date(value);
        }
      ),
    checkInTime: Yup.date()
      .transform((value, originalValue) => {
        // Check if the originalValue is a number (Unix timestamp in milliseconds)
        if (typeof originalValue === 'number') {
          return new Date(originalValue);
        }
        // For string input, attempt to parse it as a date
        if (typeof originalValue === 'string') {
          return new Date(originalValue);
        }
        return value;
      })
      .required('Check in is required')
      .typeError('Check in must be a valid date'),
    checkOutTime: Yup.date()
      .transform((value, originalValue) => {
        // Check if the originalValue is a number (Unix timestamp in milliseconds)
        if (typeof originalValue === 'number') {
          return new Date(originalValue);
        }
        // For string input, attempt to parse it as a date
        if (typeof originalValue === 'string') {
          return new Date(originalValue);
        }
        return value;
      })
      .required('Check out is required')
      .typeError('Check out  must be a valid date')
      .test(
        'time-after-check-in',
        'Checkin time must be after checkout time',
        (value, { parent }) => {
          const { checkInTime } = parent;
          // Ensure both startDate and endDate are valid Date objects before comparing
          return checkInTime && value && new Date(checkInTime) < new Date(value);
        }
      )
  })
  const defaultValues = useMemo(
    () => ({
      title: currentCampaign?.title || '',
      description: currentCampaign?.description || '',
      client_id: currentCampaign?.client_id.toString() || '',
      project_id: currentCampaign?.project_id.toString() || '',
      users: currentCampaign?.users?.map(user => user.toString()) || [],
      startDate: currentCampaign?.startDate || '',
      type: currentCampaign?.type || 'type',
      salesKpi: {
        totalDailyRevenue: currentCampaign?.salesKpi?.totalDailyRevenue || 0,
        totalDailyUnits: currentCampaign?.salesKpi?.totalDailyUnits || 0,
      },
      endDate: currentCampaign?.endDate || '',
      checkInTime: currentCampaign?.checkInTime || '',
      checkOutTime: currentCampaign?.checkOutTime || '',
      workingSchedule: currentCampaign?.workingSchedule || [],
      hourlyRate: currentCampaign?.hourlyRate || 0,
      inactivityTimeout: currentCampaign?.inactivityTimeout || 0,
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
    mode: "all"
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
      const routeForForm: ICampaignRoutes = {
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
    if (!isEmpty(errors)) {
      console.log(errors, 'ERRORS')
    }
  }, [errors])

  useEffect(() => {
    if (currentCampaign) {
      reset(defaultValues);
    }
  }, [currentCampaign, defaultValues, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const _id = createObjectId().toString();
      const project_id = data.project_id ? data.project_id : createObjectId().toString();
      const client_id = convertObjectId(data.client_id).toString();
      if (!currentCampaign) {
        const campaign: ICampaign = {
          ...data,
          // @ts-expect-error expected
          _id,
          access_code: generateAccessCode(),
          // @ts-expect-error expected
          client_id,
          description: data.description ?? '',
          products: [],
          // @ts-expect-error expected
          users: data.users.map(x => x.toString()) ?? [],
          createdAt: new Date(),
          updatedAt: new Date(),
          // @ts-expect-error expected
          project_id,
          // @ts-expect-error expected
          routes: data.routes,
          title: data.title,
          today_checkin: 0,
          total_checkin: 0,
        };
        const cleanData = removeAndFormatNullFields({
          ...campaign
        }, [
          {
            key: "updatedAt",
            formatter: safeDateFormatter,
          },
          {
            key: "createdAt",
            formatter: safeDateFormatter,
          },
          {
            key: "endDate",
            formatter: safeDateFormatter,
          },
          {
            key: "startDate",
            formatter: safeDateFormatter,
          },
          {
            key: "checkInTime",
            formatter: safeDateFormatter,
          },
          {
            key: "checkOutTime",
            formatter: safeDateFormatter,
          }
          // @ts-expect-error expected
        ], ["id"]);

        if (!cleanData) {
          throw new Error("Error creating campaign")
        }
        await saveCampaign(cleanData)
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.campaign.root);
        console.info('DATA', data);
      } else {
        const campaign: ICampaign = {
          ...currentCampaign,
          ...data,
          description: data.description ?? '',
          // @ts-expect-error expected
          updatedAt: safeDateFormatter(),
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
        };
        const cleanData = removeAndFormatNullFields(campaign,
          [

            {
              key: "createdAt",
              formatter: safeDateFormatter,
            },
            {
              key: "updatedAt",
              formatter: safeDateFormatter,
            },
            {
              key: "startDate",
              formatter: safeDateFormatter,
            },
            {
              key: "endDate",
              formatter: safeDateFormatter,
            },
            {
              key: "checkInTime",
              formatter: safeDateFormatter,
            },
            {
              key: "checkOutTime",
              formatter: safeDateFormatter,
            },
          ]
        );
        console.log(cleanData, 'UPDATED CAMPAIGN')
        if (cleanData) {
          await updateCampaign(cleanData)
        } else throw new Error("Failed to clean data")
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.campaign.root);
        console.info('DATA', cleanData);
      }
    } catch (error) {
      enqueueSnackbar(currentCampaign ? 'Update failed!' : 'Failed to create campaign!', { variant: "error" });
      console.error(error);
    }
  });

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const tabArray = useMemo(() => CAMPAING_DETAILS_TABS.filter(x => {
    if (currentCampaign) {
      return true;
    }
    switch (x.value) {
      case "reports":
      case "products":
        return false;
      default:
        return true;
    }
  }), [currentCampaign])

  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 1, md: 2 },
      }}
    >
      {tabArray.map((tab) => (
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

        {currentTab === 'details' && <Suspense fallback={<LoadingScreen />}><CampaignNewEditDetailsTab /></Suspense>}
        {currentTab === 'reports' && currentCampaign && <Suspense fallback={<LoadingScreen />}> <ReportListDataGrid id={currentCampaign?._id.toString() ?? ""} /></Suspense>}
        {currentTab === 'products' && currentCampaign && <Suspense fallback={<LoadingScreen />}> <ProductListDataGrid clientId={currentCampaign?.client_id.toString() ?? ""} campaignId={currentCampaign?._id.toString() ?? ""} /></Suspense>}
        {currentTab === 'users' && currentCampaign && <Suspense fallback={<LoadingScreen />}><UserActivityView campaign={currentCampaign} /></Suspense>}
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