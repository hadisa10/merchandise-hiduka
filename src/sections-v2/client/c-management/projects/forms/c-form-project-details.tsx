"use client"

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import React, { memo, useMemo } from 'react'
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { Box, Card, Chip, Stack, CardHeader, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useResponsive } from 'src/hooks/use-responsive';

import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFAutocomplete } from 'src/components/hook-form';

import { IUser } from 'src/types/user_realm';
import { IProject } from 'src/types/realm/realm-types';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
const INACTIVITY_LIMIT = [
  { "label": "30 min", "value": 1800000 },
  { "label": "1 hour", "value": 3600000 },
  { "label": "3 hours", "value": 10800000 }
]

function CFormProjectDetails({ currentProject, loading, users }: { currentProject?: IProject, loading: boolean, users: IUser[] }) {

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { client } = useClientContext();

  const showLoader = useShowLoader(loading, 300);

  const realmApp = useRealmApp();

  const NewCurrectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    project_managers: Yup.lazy(() => Yup.array().of(Yup.string().required('Project manager is required')))
  })

  const defaultValues = useMemo(
    () => ({
      title: currentProject?.title || '',
      project_managers: currentProject?.project_managers.map(x => x.toString()) || []
    }),
    [currentProject]
  );

  const methods = useForm({
    resolver: yupResolver(NewCurrectSchema),
    defaultValues,
    mode: "all"
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;





  const onSubmit = handleSubmit(async (data) => {
    try {
      const client_id = client?._id.toString();

      if (!currentProject) {
        const prj: Omit<IProject<string>, "_id" | "createdAt" | "updatedAt"> = {
          ...data,
          project_managers: data.project_managers ?? [],
          client_id,
          campaigns: [],
          reports: []
        }
        await realmApp.currentUser?.functions.createProject(prj)
        enqueueSnackbar(currentProject ? 'Update success!' : 'Create success!');
        router.push(paths.v2.client.project.root);
        console.info('DATA', data);
        reset();
      } else {
        const prj: Omit<IProject<string>,  "createdAt" | "updatedAt" | "campaigns" | "reports"> = {
          _id: currentProject._id.toString(),
          ...data,
          project_managers: data.project_managers ?? [],
          client_id,
        }
        await realmApp.currentUser?.functions.updateProject(prj)
        enqueueSnackbar(currentProject ? 'Update success!' : 'Create success!');
        router.push(paths.v2.client.project.root);
        console.info('DATA', data);
        reset();
        
      }
    } catch (error) {
      enqueueSnackbar(currentProject ? 'Update failed!' : 'Failed to create campaign!', { variant: "error" });
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
          </Stack>
        </Card>
      </Grid>
    </>
  );
  const renderUsers = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Users
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            User management ...
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
              <Typography variant="subtitle2">Project Managers</Typography>
              {showLoader && <LoadingScreen />}
              {users && !showLoader &&
                <RHFAutocomplete
                  name="project_managers"
                  label="Project Managers"
                  placeholder="+ users"
                  multiple
                  freeSolo
                  loading={showLoader}
                  disableCloseOnSelect
                  options={users?.map(usr => usr._id.toString()) ?? []}
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

        {renderUsers}

      </Grid>
    </FormProvider>
  )
}

export default memo(CFormProjectDetails)