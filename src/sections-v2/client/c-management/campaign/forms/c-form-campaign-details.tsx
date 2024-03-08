"use client"

import * as Yup from 'yup';
import { isObject } from 'lodash';
import React, { memo, useMemo } from 'react'
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Card, Chip, Stack, Button, Divider, MenuItem, CardHeader, Typography } from '@mui/material';
import { MobileDatePicker, MobileTimePicker, DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useResponsive } from 'src/hooks/use-responsive';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import { fTimestamp } from 'src/utils/format-time';
import { createObjectId, convertObjectId } from 'src/utils/realm';
import { safeDateFormatter, generateAccessCode, removeAndFormatNullFields } from 'src/utils/helpers';

import { JOB_WORKING_SCHEDULE_OPTIONS } from 'src/_mock';

import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFSelect, RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUser } from 'src/types/user_realm';
import { ICalendarDate } from 'src/types/calendar';
import { ICampaign } from 'src/types/realm/realm-types';
import { LoadingButton } from '@mui/lab';
import { useClientContext } from 'src/components/clients';

const INACTIVITY_LIMIT = [
  { "label": "30 min", "value": 1800000 },
  { "label": "1 hour", "value": 3600000 },
  { "label": "3 hours", "value": 10800000 }
]

function CFormCampaignDetails({ users, loading, currentCampaign }: { users?: IUser[], loading?: boolean, currentCampaign?: ICampaign }) {

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { client } = useClientContext();

  const { saveCampaign, updateCampaign } = useCampaigns(true);

  const showLoader = useShowLoader(loading ?? false, 200)

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string(),
    users: Yup.array(),
    hourlyRate: Yup.number().min(0).required("Hourly rate is required").typeError("Hourly rate must be a number"),
    inactivityTimeout: Yup.number().required("Inactivity limit required"),
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
      users: currentCampaign?.users?.map(user => user.toString()) || [],
      startDate: currentCampaign?.startDate || new Date(),
      endDate: currentCampaign?.endDate || new Date(),
      checkInTime: currentCampaign?.checkInTime || new Date(),
      checkOutTime: currentCampaign?.checkOutTime || new Date(),
      workingSchedule: currentCampaign?.workingSchedule || [],
      hourlyRate: currentCampaign?.hourlyRate || 0,
      inactivityTimeout: currentCampaign?.inactivityTimeout || 0,
    }),
    [currentCampaign]
  );

  const methods = useForm({
    resolver: yupResolver(NewCurrectSchema),
    defaultValues,
    mode: "all"
  });

  const {
    reset,
    control,
    handleSubmit,
    getFieldState,
    formState: { isSubmitting, errors },
  } = methods;

  console.log(errors, "ERROS")

  const { error: startDateError } = getFieldState("startDate")
  const { error: endDateError } = getFieldState("endDate")
  const { error: checkInTimeError } = getFieldState("checkInTime")
  const { error: checkOutTimeError } = getFieldState("checkOutTime")


  const onSubmit = handleSubmit(async (data) => {
    try {
      const _id = createObjectId().toString();
      const project_id = createObjectId().toString()
      const client_id = client?._id.toString();

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
          title: data.title,
          today_checkin: 0,
          total_checkin: 0,
          type: "RSM"
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
        router.push(paths.v2.client.campaign.root);
        console.info('DATA', data);
      } else {
        const campaign: ICampaign = {
          ...currentCampaign,
          ...data,
          description: data.description ?? '',
          // @ts-expect-error expected
          updatedAt: safeDateFormatter(),
          project_id: createObjectId(),
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
        console.log(cleanData, 'CLEAN DATA')
        if (cleanData) {
          await updateCampaign(cleanData)
        } else throw new Error("Failed to clean data")
        reset();
        enqueueSnackbar(currentCampaign ? 'Update success!' : 'Create success!');
        router.push(paths.v2.client.campaign.edit(campaign._id.toString()));
        console.info('DATA', cleanData);
      }
    } catch (error) {
      enqueueSnackbar(currentCampaign ? 'Update failed!' : 'Failed to create campaign!', { variant: "error" });
      console.error(error);
    }
  });

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Title</Typography>
              <RHFTextField name="title" placeholder="Ex: New year Sales..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Description</Typography>
              <RHFEditor simple name="description" />
            </Stack>

          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderTimeDetails = (
    <>
      {!mdUp &&
        <>
          <Stack spacing={1}>
            <Typography variant="subtitle2">Timeline</Typography>
          </Stack>
          <Controller
            name="checkInTime"
            control={control}
            render={({ field }) => <MobileTimePicker
              {...field}
              value={new Date(field.value as unknown as ICalendarDate)}
              onChange={(newValue) => {
                if (newValue) {
                  field.onChange(fTimestamp(newValue));
                }
              }}
              label="Check in time"
              format="hh:mm a"
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: isObject(checkInTimeError),
                  helperText: isObject(checkInTimeError) && checkInTimeError.message,
                },
              }}
            />}
          />

          <Controller
            name="checkOutTime"
            control={control}
            render={({ field }) => (
              <MobileTimePicker
                {...field}
                value={new Date(field.value as unknown as ICalendarDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    field.onChange(fTimestamp(newValue));
                  }
                }}
                label="Check out time"
                format="hh:mm a"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: isObject(checkOutTimeError),
                    helperText: isObject(checkOutTimeError) && checkOutTimeError.message,
                  },
                }}
              />
            )}
          />
        </>
      }
      {mdUp &&
        <>
          <Controller
            name="checkInTime"
            control={control}
            render={({ field }) => (
              <DesktopTimePicker
                {...field}
                value={new Date(field.value as unknown as ICalendarDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    field.onChange(fTimestamp(newValue));
                  }
                }}
                label="Check in time"
                format="hh:mm a"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: isObject(checkInTimeError),
                    helperText: isObject(checkInTimeError) && checkInTimeError.message,
                  },
                }}
              />
            )}
          />

          <Controller
            name="checkOutTime"
            control={control}
            render={({ field }) => (
              <DesktopTimePicker
                {...field}
                value={new Date(field.value as unknown as ICalendarDate)}
                onChange={(newValue) => {
                  if (newValue) {
                    field.onChange(fTimestamp(newValue));
                  }
                }}
                label="Check out time"
                format="hh:mm a"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    error: isObject(checkOutTimeError),
                    helperText: isObject(checkOutTimeError) && checkOutTimeError.message,
                  },
                }}
              />
            )}
          />
        </>
      }
    </>
  )

  const renderDateDetails = (
    <>
      {!mdUp &&
        <Grid xs={12} md={8}>
          <Card>
            <Stack spacing={3} sx={{ p: 3 }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2">Timeline</Typography>
              </Stack>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => <MobileDatePicker
                  {...field}
                  value={new Date(field.value as unknown as ICalendarDate)}
                  onChange={(newValue) => {
                    if (newValue) {
                      field.onChange(fTimestamp(newValue));
                    }
                  }}
                  label="Start date"
                  format="dd/MM/yyyy hh:mm a"
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      error: isObject(startDateError),
                      helperText: isObject(startDateError) && startDateError.message,
                    },
                  }}
                />}
              />

              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <MobileDatePicker
                    {...field}
                    value={new Date(field.value as unknown as ICalendarDate)}
                    onChange={(newValue) => {
                      if (newValue) {
                        field.onChange(fTimestamp(newValue));
                      }
                    }}
                    label="End date"
                    format="dd/MM/yyyy"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: isObject(endDateError),
                        helperText: isObject(endDateError) && endDateError.message,
                      },
                    }}
                  />
                )}
              />
              {renderTimeDetails}
            </Stack>
          </Card>
        </Grid>
      }
      {mdUp &&
        <>
          <Grid md={4}>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              Time
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Start and end dates...
            </Typography>
          </Grid>

          <Grid xs={12} md={8}>
            <Card>
              <Stack spacing={3} sx={{ p: 3 }}>
                <Stack spacing={1}>
                  <Typography variant="subtitle2">Timelines</Typography>
                </Stack>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      {...field}
                      value={new Date(field.value as unknown as ICalendarDate)}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange(fTimestamp(newValue));
                        }
                      }}
                      label="Start date"
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: isObject(startDateError),
                          helperText: isObject(startDateError) && startDateError.message,
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DesktopDatePicker
                      {...field}
                      value={new Date(field.value as unknown as ICalendarDate)}
                      onChange={(newValue) => {
                        if (newValue) {
                          field.onChange(fTimestamp(newValue));
                        }
                      }}
                      label="End date"
                      format="dd/MM/yyyy"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: isObject(endDateError),
                          helperText: isObject(endDateError) && endDateError.message,
                        },
                      }}
                    />
                  )}
                />
                {renderTimeDetails}
              </Stack>
            </Card>
          </Grid>

        </>
      }
    </>
  )

  const renderUsers = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional details ...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Users" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Users Details</Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Users</Typography>
              {showLoader && <LoadingScreen />}
              {!showLoader && users &&
                <RHFAutocomplete
                  name="users"
                  label="Users"
                  placeholder="+ users"
                  multiple
                  freeSolo
                  loading={loading}
                  disableCloseOnSelect
                  options={users?.map(usr => usr._id) ?? []}
                  getOptionLabel={(option) => {
                    const user = users?.find((usr) => usr._id === option);
                    if (user) {
                      return user?.displayName
                    }
                    return option
                  }}
                  renderOption={(props, option) => {
                    const user = users?.filter(
                      (usr) => usr._id === option
                    )[0];

                    if (!user?._id) {
                      return null;
                    }

                    return (
                      <li {...props} key={user._id.toString()}>
                        {user?.displayName}
                      </li>
                    );
                  }}
                  renderTags={(selected, getTagProps) => (
                    selected.map((option, index) => {
                      const user = users?.find((usr) => usr._id === option);
                      return (
                        <Chip
                          {...getTagProps({ index })}
                          key={user?._id ?? ""}
                          label={user?.displayName ?? ""}
                          size="small"
                          color="info"
                          variant="soft"
                        />
                      )
                    })
                  )
                  }
                />}
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Working schedule</Typography>
              <RHFAutocomplete
                name="workingSchedule"
                placeholder="+ Schedule"
                multiple
                disableCloseOnSelect
                options={JOB_WORKING_SCHEDULE_OPTIONS.map((option) => option)}
                getOptionLabel={(option) => option}
                renderOption={(props, option) => (
                  <li {...props} key={option}>
                    {option}
                  </li>
                )}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => (
                    <Chip
                      {...getTagProps({ index })}
                      key={option}
                      label={option}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  ))
                }
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderUserManagement = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Constraints
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Constraints details ...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Constraints" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Constraints</Typography>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">In Activity Limit</Typography>
              <RHFSelect name="inactivityTimeout" label="In Activity Limit">
                <MenuItem value="">None</MenuItem>
                <Divider sx={{ borderStyle: 'dashed' }} />
                {INACTIVITY_LIMIT.map((limit) => (
                  <MenuItem key={limit.value} value={limit.value}>
                    {limit.label}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Hourly rate</Typography>
              <RHFTextField name="hourlyRate" placeholder="Ex: 200..." />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Box display="flex" width="100%" justifyContent="end">
          <LoadingButton loading={isSubmitting} variant='contained' type="submit">Save Details</LoadingButton>
        </Box>

        {renderDetails}

        {renderDateDetails}

        {renderUsers}

        {renderUserManagement}

      </Grid>
    </FormProvider>
  )
}

export default memo(CFormCampaignDetails)