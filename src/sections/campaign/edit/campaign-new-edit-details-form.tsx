
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';
import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import {
  JOB_WORKING_SCHEDULE_OPTIONS,
} from 'src/_mock';

import {
  RHFEditor,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { ICampaign } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = {
  currentCampaign?: ICampaign;
};

export default function CampaignNewEditDetailsForm({ currentCampaign }: Props) {
  const { users } = useUsers();

  const mdUp = useResponsive('up', 'md');

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

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Stack spacing={1}>
              <Typography variant="subtitle2">Users Details</Typography>
              <RHFMultiCheckbox
                row
                spacing={4}
                name="employmentTypes"
                options={[]}
              />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Users</Typography>

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
                    <li {...props} key={user._id}>
                      {user?.displayName}
                    </li>
                  );
                }}
                renderTags={(selected, getTagProps) =>
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
                }
              />
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

  // const renderActions = (
  //   <>
  //     {mdUp && <Grid md={4} />}
  //     <Grid xs={12} md={8} sx={{ display: 'flex', justifyContent: "end", alignItems: 'center' }}>
  //       <LoadingButton
  //         type="submit"
  //         variant="contained"
  //         size="large"
  //         loading={isSubmitting}
  //         sx={{ ml: 2 }}
  //       >
  //         {!currentCampaign ? 'Create Campaign' : 'Save Changes'}
  //       </LoadingButton>
  //     </Grid>
  //   </>
  // );

  return (
    <Grid container spacing={3}>
      {renderDetails}

      {renderProperties}

      {/* {renderActions} */}
    </Grid>
  );
}
