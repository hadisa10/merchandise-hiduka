'use client';

import * as Yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { lazy, useMemo, useState, Suspense, useEffect, useCallback } from 'react';

import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

// import { useBoolean } from 'src/hooks/use-boolean';
// import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import Label from 'src/components/label';
import FormProvider from 'src/components/hook-form/form-provider';

import { IReport, ICampaign } from 'src/types/realm/realm-types';

// import QuestionsNewEditList from './edit/questions-new-edit';
// import CampaignDetailsToolbar from './report-details-toolbar';
// import ReportNewEditDetailsForm from './edit/report-new-edit-details-form';

import { useBoolean } from 'src/hooks/use-boolean';
import { useReports } from 'src/hooks/realm/report/use-report-graphql';

import { createObjectId } from 'src/utils/realm';
import { safeDateFormatter, removeAndFormatNullFields } from 'src/utils/helpers';

import { useRealmApp } from 'src/components/realm';
import { RHFFormFiller } from 'src/components/hook-form';
import { useClientContext } from 'src/components/clients';
// import { RHFFormFiller, RHFTextField } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';

import ImageResponseView from './responses-component/image-responses-view';
// import { RHFFormFiller } from 'src/components/hook-form';

const DETAILS_FIELDS = ['title', 'users', 'description', 'workingSchedule'];
const ROUTES_FIELDS = ['routes'];

// ----------------------------------------------------------------------

type Props = {
  currentReport?: IReport;
};

export const REPORT_DETAILS_TABS = [
  { value: 'details', label: 'Details' },
  { value: 'questions', label: 'Questions' },
  { value: 'test', label: 'Test Report' },
  { value: 'responses', label: 'Responses' },
  { value: 'merged-responses', label: 'Merged Reponses' },
  { value: 'images', label: 'Images' },
];

// function generateAccessCode() {
//   return Math.floor(10000 + Math.random() * 90000).toString();
// }

// Lazy load the components
const QuestionsNewEditList = lazy(() => import('./question-component/questions-new-edit'));
const ReportsDetailsToolbar = lazy(() => import('./report-details-toolbar'));
const ReportNewEditDetailsForm = lazy(() => import('./edit/report-new-edit-details-form'));
const ResponsesGridView = lazy(() => import('./responses-component/responses-list-view'));
const MergedResponsesGridView = lazy(
  () => import('./responses-component/merged-responses-list-view')
);

export default function ReportNewEditForm({ currentReport }: Props) {
  const router = useRouter();

  const { updateReport, saveReport } = useReports();

  const { enqueueSnackbar } = useSnackbar();

  const campaignloading = useBoolean(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>();

  const realmApp = useRealmApp();

  const [campaigns, setCampaigns] = useState<ICampaign[] | undefined>(undefined);

  const { client } = useClientContext();

  useEffect(() => {
    if (client && client?._id) {
      campaignloading.onTrue();
      setError(null);
      realmApp.currentUser?.functions
        .getClientCampaigns({ client_id: client?._id.toString() })
        .then((data: ICampaign[]) => setCampaigns(data))
        .catch((e) => {
          console.error(e);
          setError(e);
          enqueueSnackbar('Failed to get dashboard Metrics', { variant: 'error' });
        })
        .finally(() => campaignloading.onFalse());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client]);

  const [currentTab, setCurrentTab] = useState('details');

  const regexValidationSchema = Yup.object()
    .shape({
      matches: Yup.string()
        .nullable()
        .test('is-regex', 'matches must be a valid regex', (value) => {
          try {
            // Attempt to create a new RegExp object. If `value` is not a valid regex, this will throw an error.
            // @ts-expect-error expected
            RegExp(value);
            // If no error is thrown, then `value` is a valid regex.
            return true;
          } catch (e) {
            // If an error is thrown, then `value` is not a valid regex.
            return false;
          }
        }), // Allows null
      message: Yup.string().nullable(), // Allows null
    })
    .nullable();

  const questionValidationSchema = Yup.object()
    .shape({
      required: Yup.boolean().nullable(),
      minLength: Yup.number().nullable().typeError('Min Length must be a number'),
      maxLength: Yup.number().nullable().typeError('Max Length must be a number'),
      minValue: Yup.number().nullable().typeError('Min Value must be a number'),
      maxValue: Yup.number().nullable().typeError('Min Value must be a number'),
      regex: regexValidationSchema,
      fileTypes: Yup.array().of(Yup.string()).nullable(), // Allows null and an array of strings
    })
    .nullable();

  const questionDependencySchema = Yup.array()
    .of(
      Yup.object().shape({
        questionId: Yup.string().required('Question ID is required'),
        triggerValue: Yup.string().required('Trigger value is required'),
        operator: Yup.string()
          .oneOf(['equals', 'notEquals', 'greaterThan', 'lessThan'])
          .required('Operator is required'),
      })
    )
    .nullable();

  const questionSchema = Yup.object().shape({
    _id: Yup.string().required('Id is required'),
    text: Yup.string().required('Question text is required'),
    order: Yup.number().required('Order is required'),
    input_type: Yup.string().required('Input type is required'),
    placeholder: Yup.string().nullable(), // Optional, allows null
    initialValue: Yup.string().nullable(), // Optional, allows null
    options: Yup.array().of(Yup.string()).nullable(), // Allows null and an array of strings
    unique: Yup.boolean().nullable(),
    updatedAt: Yup.date().nullable(),
    dependencies: questionDependencySchema,
    validation: questionValidationSchema,
  });

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    campaign_id: Yup.string().required('Campaign is required'),
    // Include additional validations for other top-level fields as necessary
    questions: Yup.array().of(questionSchema),
  });

  const defaultValues = useMemo(
    () => ({
      title: currentReport?.title || '',
      campaign_id: currentReport?.campaign_id || '',
      questions: currentReport?.questions || [],
    }),
    [currentReport]
  );

  const methods = useForm({
    // @ts-expect-error expected
    resolver: yupResolver(NewCurrectSchema),
    defaultValues,
    mode: 'all', // This triggers validation on both onChange and onBlur
  });

  const {
    reset,
    watch,
    // control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const questions = watch('questions');
  const tabErrors = useCallback(
    (tab: string) => {
      const y = Object.entries(errors).filter(([key, val]) => {
        console.log(key, 'ERROR KEYS');
        switch (tab) {
          case 'details':
            return DETAILS_FIELDS.includes(key);
          case 'routes':
            return ROUTES_FIELDS.includes(key);
          default:
            return false;
        }
      });
      return y;
    },
    [errors]
  );

  useEffect(() => {
    if (currentReport) {
      reset(defaultValues);
    }
  }, [currentReport, defaultValues, reset]);

  const onSubmit = handleSubmit(async (formData) => {
    // Remove null fields from the form data
    try {
      if (currentReport) {
        const cleanedData = removeAndFormatNullFields(
          {
            ...currentReport,
            ...formData,
          },
          [
            {
              key: 'updatedAt',
              formatter: safeDateFormatter,
            },
            {
              key: 'createdAt',
              formatter: safeDateFormatter,
            },
          ],
          // @ts-expect-error expected
          ['id', 'description']
        );
        // @ts-expect-error expected
        const dt: IReport = {
          ...cleanedData,
        };
        console.log(dt, 'DT');
        await updateReport(dt);
        reset();
        enqueueSnackbar(currentReport ? 'Update success!' : 'Create success!');
        // router.push(rolePath?.report.root);
      } else {
        const cleanedData = removeAndFormatNullFields(
          {
            ...formData,
          },
          [
            {
              // @ts-expect-error expected
              key: 'updatedAt',
              formatter: safeDateFormatter,
            },
            {
              // @ts-expect-error expected
              key: 'createdAt',
              formatter: safeDateFormatter,
            },
          ],
          ['id', 'workingSchedule', 'description']
        );
        console.log(cleanedData, 'DT');

        const campaign = campaigns?.find(
          (cmpg) => cmpg._id.toString() === cleanedData?.campaign_id
        );
        if (!campaign) throw new Error('Error creating campaign because client does not exist');
        // @ts-expect-error expected
        const id = await saveReport({
          ...cleanedData,
          client_id: campaign._id,
          campaign_title: campaign.title,
          project_id: createObjectId(),
          responses: 0,
        });
        reset();
        enqueueSnackbar(currentReport ? 'Update success!' : 'Create success!');
        router.push(paths.dashboard.report.edit(id.toString()));
      }
    } catch (e) {
      enqueueSnackbar(currentReport ? 'Update failed!' : 'Failed to create campaign!', {
        variant: 'error',
      });
      console.error(e);
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
        mb: { xs: 1, md: 2 },
      }}
    >
      {REPORT_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            tabErrors(tab.value)?.length > 1 ? (
              <Label variant="soft" color="error">
                {tabErrors(tab.value)?.length}
              </Label>
            ) : (
              ''
            )
          }
        />
      ))}
    </Tabs>
  );

  console.log(questions, 'questions');
  return (
    <>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <ReportsDetailsToolbar
          currentReport={currentReport}
          isSubmitting={isSubmitting}
          backLink={paths.dashboard.report.root}
        />
        {renderTabs}

        {currentTab === 'details' && (
          <Suspense fallback={<LoadingScreen />}>
            {campaignloading.value ? (
              <LoadingScreen />
            ) : (
              <ReportNewEditDetailsForm
                campaigns={campaigns}
                campaignsLoading={campaignloading.value}
              />
            )}
          </Suspense>
        )}
        {currentTab === 'questions' && (
          <Suspense fallback={<LoadingScreen />}>
            <QuestionsNewEditList />
          </Suspense>
        )}
        {currentTab === 'responses' && (
          <Suspense fallback={<LoadingScreen />}>
            <ResponsesGridView report={currentReport} questions={currentReport?.questions} />
          </Suspense>
        )}
        {currentTab === 'merged-responses' && (
          <Suspense fallback={<LoadingScreen />}>
            <MergedResponsesGridView report={currentReport} questions={currentReport?.questions} />
          </Suspense>
        )}
        {currentTab === 'images' && (
          <Suspense fallback={<LoadingScreen />}>
            <ImageResponseView report={currentReport} questions={currentReport?.questions} />
          </Suspense>
        )}

        {/* {currentTab === 'details' && <ReportNewEditDetailsForm campaigns={campaigns} campaignsLoading={campaignsLoading} />}
        {currentTab === 'questions' && <QuestionsNewEditList campaigns={campaigns} campaignsLoading={campaignsLoading} />}
        {
          currentTab === 'routes' &&
          // @ts-expect-error expected
          <RHFFormFiller questions={questions} onSubmit={(val) => new Promise(() => console.log(val, "FORM FILLED"))} />
        } */}
      </FormProvider>
      {currentTab === 'test' && (
        <RHFFormFiller
          questions={removeAndFormatNullFields(questions) ?? []}
          onSubmit={(val) => new Promise(() => console.log(val, 'FORM FILLED'))}
        />
      )}
    </>
  );
}
