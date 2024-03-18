
import { FC, memo, useEffect, useState } from 'react';
import { isObject } from 'lodash';
import { Controller, useFormContext } from 'react-hook-form';

import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import { Divider, MenuItem } from '@mui/material';
import { MobileDatePicker, MobileTimePicker, DesktopDatePicker, DesktopTimePicker } from '@mui/x-date-pickers';

import { useResponsive } from 'src/hooks/use-responsive';
import { useClients, useShowLoader } from 'src/hooks/realm';
import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import { fTimestamp } from 'src/utils/format-time';

import {
  JOB_WORKING_SCHEDULE_OPTIONS,
} from 'src/_mock';

import { LoadingScreen } from 'src/components/loading-screen';
import {
  RHFEditor,
  RHFSelect,
  RHFTextField,
  RHFAutocomplete,
} from 'src/components/hook-form';

import { ICalendarDate } from 'src/types/calendar';
import { useBoolean } from 'src/hooks/use-boolean';
import { useRealmApp } from 'src/components/realm';
import { enqueueSnackbar } from 'notistack';
import { IProject } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------
const INACTIVITY_LIMIT = [
  { "label": "30 min", "value": 1800000 },
  { "label": "1 hour", "value": 3600000 },
  { "label": "3 hours", "value": 10800000 }
]
const CAMPAIGN_TYPES = [
  { "label": "Sales", "value": "sales"  },
  { "label": "Promotion", "value": "promotion" },
]

const CampaignNewEditDetailsTab: FC = () => {
  const { users, loading: loadingUsers } = useUsers();

  const { control, getFieldState, watch } = useFormContext();

  const mdUp = useResponsive('up', 'md');

  const { loading, clients } = useClients(false);

  const projectsloading = useBoolean();

  const showLoader = useShowLoader(loading, 200)

  const realmApp = useRealmApp();

  const [projects, setProjects] = useState<IProject[] | null>(null)

  const client_id = watch("client_id");
  useEffect(() => {
      if (client_id) {
          projectsloading.onTrue()
          realmApp.currentUser?.functions.getUserProjects(client_id.toString()).then((data: IProject[]) => { 
            console.log(client_id.toString(), "CLIENT ID")
            console.log(data, "PROJECTS DATA")
            setProjects(data)
          })
              .catch(e => {
                  console.error(e)
                  enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
              }
              )
              .finally(() => projectsloading.onFalse())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client_id])

  const showUsersLoader = useShowLoader(loadingUsers, 200)

  const { error: startDateError } = getFieldState("startDate")
  const { error: endDateError } = getFieldState("endDate")
  const { error: checkInTimeError } = getFieldState("checkInTime")
  const { error: checkOutTimeError } = getFieldState("checkOutTime")


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

            <Stack spacing={1.5}>
                <Typography variant="subtitle2">Campaign Type</Typography>
                <RHFSelect name="type" label="Type">
                  <Divider sx={{ borderStyle: 'dashed' }} />
                  {CAMPAIGN_TYPES.map((limit) => (
                    <MenuItem key={limit.value} value={limit.value}>
                      {limit.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Client</Typography>
              {showLoader && <LoadingScreen />}
              {!showLoader && <RHFAutocomplete
                name="client_id"
                label="Client"
                placeholder="Select client"
                loading={showLoader}
                freeSolo
                options={clients?.map(clnt => clnt._id?.toString()) ?? []}
                getOptionLabel={(option) => {
                  const client = clients?.find((clnt) => clnt._id?.toString() === option.toString());
                  if (client) {
                    return client?.name
                  }
                  return option
                }}
                renderOption={(props, option) => {
                  const client = clients?.filter(
                    (clnt) => clnt._id?.toString() === option.toString()
                  )[0];

                  if (!client?._id) {
                    return null;
                  }

                  return (
                    <li {...props} key={client?._id?.toString()}>
                      {client?.name}
                    </li>
                  );
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => {
                    const client = clients?.find((clnt) => clnt._id?.toString() === option);
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        key={client?._id?.toString() ?? ""}
                        label={client?.name ?? ""}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    )
                  })
                }
              />}
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Project</Typography>
              {projectsloading.value && <LoadingScreen />}
              {!projectsloading.value && <RHFAutocomplete
                name="project_id"
                label="Project"
                placeholder="Project client"
                loading={projectsloading.value}
                freeSolo
                options={projects?.map(clnt => clnt._id?.toString()) ?? []}
                getOptionLabel={(option) => {
                  const client = projects?.find((clnt) => clnt._id?.toString() === option.toString());
                  if (client) {
                    return client?.title
                  }
                  return option
                }}
                renderOption={(props, option) => {
                  const client = projects?.filter(
                    (clnt) => clnt._id?.toString() === option.toString()
                  )[0];

                  if (!client?._id) {
                    return null;
                  }

                  return (
                    <li {...props} key={client._id?.toString()}>
                      {client?.title}
                    </li>
                  );
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => {
                    const client = projects?.find((clnt) => clnt._id?.toString() === option);
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        key={client?._id?.toString() ?? ""}
                        label={client?.title ?? ""}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    )
                  })
                }
              />}
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
              value={new Date(field.value as ICalendarDate)}
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
                value={new Date(field.value as ICalendarDate)}
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
                value={new Date(field.value as ICalendarDate)}
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
                value={new Date(field.value as ICalendarDate)}
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
                  value={new Date(field.value as ICalendarDate)}
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
                    value={new Date(field.value as ICalendarDate)}
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
                      value={new Date(field.value as ICalendarDate)}
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
                      value={new Date(field.value as ICalendarDate)}
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
              {showUsersLoader && <LoadingScreen />}
              {!showUsersLoader &&
                <RHFAutocomplete
                  name="users"
                  label="Users"
                  placeholder="+ users"
                  multiple
                  freeSolo
                  disableCloseOnSelect
                  options={users.map(usr => usr._id)}
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

  const renderConstraints = (
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

  const renderCampaignKPIS = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            KPIS
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            KPI details ...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Constraints" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Sales KPIS</Typography>
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Daily Units Target</Typography>
              <RHFTextField name="salesKpi.totalDailyUnits" type="number" placeholder="Ex: 100..." />
            </Stack>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Daily Revenue Target</Typography>
              <RHFTextField name="salesKpi.totalDailyRevenue" type="number" placeholder="Ex: Ksh. 1000..." />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  return (
    <Grid container spacing={3}>

      {renderDetails}

      {renderDateDetails}

      {renderUsers}

      {renderCampaignKPIS}

      {renderConstraints}

    </Grid>
  );
}

export default memo(CampaignNewEditDetailsTab)