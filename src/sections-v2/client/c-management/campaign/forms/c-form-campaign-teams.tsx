"use client"

import * as Yup from 'yup';

import { yupResolver } from '@hookform/resolvers/yup';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useFieldArray, useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import { enqueueSnackbar } from 'notistack';
import { Avatar, Button, Card, Chip, List, ListItemAvatar, ListItemButton, ListItemText, ListSubheader, Stack, Typography } from '@mui/material';
import { RHFAutocomplete, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import { ICampaign, ICampaignTeam } from 'src/types/realm/realm-types';
import { createObjectId } from 'src/utils/realm';
import { useRealmApp } from 'src/components/realm';
import { LoadingButton } from '@mui/lab';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { useResponsive } from 'src/hooks/use-responsive';
import { LoadingScreen } from 'src/components/loading-screen';
import { IUser } from 'src/types/user_realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useClientContext } from 'src/components/clients';
import { BSON } from 'realm-web';

function CFormCampaignTeams({ campaign, loading, users }: { campaign?: ICampaign, loading?: boolean, users?: IUser[] }) {

  const realmApp = useRealmApp();

  const mdUp = useResponsive('up', 'md');

  const campaignloading = useBoolean(true);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>()

  const [campaignsTeams, setCampaignTeams] = useState<ICampaignTeam<BSON.ObjectId>[] | null>(null)

  const [refetch, setRefetch] = useState<string>("")

  useEffect(() => {
    if (campaign && campaign._id) {
      campaignloading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.getCampaignTeams({ campaign_id: campaign._id.toString() }).then((data: ICampaignTeam<BSON.ObjectId>[]) => setCampaignTeams(data))
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
        }
        )
        .finally(() => campaignloading.onFalse())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaign, refetch])

  const NewCurrectSchema = Yup.object().shape({
    name: Yup.string().required('name is required'),
    regions: Yup.array().of(Yup.string()).required('At least one region is required').nullable(),
    teamLeads: Yup.array().of(Yup.string()).min(1, "At least one team lead is required").required('At least one team lead is required').nullable(),
    users: Yup.array().of(Yup.string()).required('At least one user is required').nullable(),
  })

  const defaultValues = useMemo(
    () => ({
      name: "",
      regions: [],
      teamLeads: [],
      users: []
    }),
    []
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
    formState: { isSubmitting, errors },
  } = methods;




  const onSubmit = handleSubmit(async (data) => {
    try {
      if (campaign?._id) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        // @ts-expect-error expected
        const team: ICampaignTeam<string> = {
          campaign_id: campaign._id.toString(),
          ...data
        }

        console.log(team, "TEAM")

        const teamAdded = await realmApp.currentUser?.functions.addCampaignTeam(team)

        if (teamAdded) {
          console.log(teamAdded, "TEAM ADDED")
        }
        reset();

        setRefetch(Math.random().toString())
        enqueueSnackbar('Saved Team Details');
        console.info('DATA', data);
      } else {
        throw new Error("Invalid campaign")
      }

    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update campaign team', { variant: "error" });
    }
  });

  const renderDetails = (
    <>
      <Grid xs={12} md={8}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Name</Typography>
              <RHFTextField name="name" placeholder="Ex: Team A..." />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Users</Typography>
              {loading && <LoadingScreen />}
              {!loading && users &&
                <RHFAutocomplete
                  name="teamLeads"
                  label="Team Leads"
                  placeholder="+ team leads"
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

              {loading && <LoadingScreen />}
              {!loading && users &&
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

          </Stack>
        </Card>
      </Grid>

      {mdUp && (
        <Grid md={4}>
          <Card sx={{ height: "100%", p: 1 }}>
            <List dense>
              <ListSubheader>Campaign Teams</ListSubheader>
              {campaignloading.value && <LoadingScreen />}
              {!campaignloading.value &&
                campaignsTeams?.map(campaignsTeam => (
                  <ListItemButton>
                    <ListItemAvatar>
                      <Avatar src={campaignsTeam.name} />
                    </ListItemAvatar>
                    <ListItemText>{campaignsTeam.name}</ListItemText>
                  </ListItemButton>
                ))
              }
            </List>
          </Card>
        </Grid>
      )}
    </>
  )

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid xs={12} display="flex" justifyContent="end">
          <LoadingButton
            size="small"
            variant='contained'
            color="primary"
            type="submit"
            loading={isSubmitting}
            sx={{ flexShrink: 0 }}
          >
            Save Team details
          </LoadingButton>
        </Grid>
        {renderDetails}
      </Grid>
    </FormProvider>
  )
}

export default CFormCampaignTeams