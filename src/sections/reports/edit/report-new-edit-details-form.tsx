import { useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import { useResponsive } from 'src/hooks/use-responsive';

import {
  RHFEditor,
  RHFTextField,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { ICampaign } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

export default function ReportNewEditDetailsForm({
  campaigns,
  campaignsLoading,
}: {
  campaigns?: ICampaign[];
  campaignsLoading?: boolean;
}) {
  const { setValue, watch } = useFormContext();

  const campaingsValue = watch('campaign_id');

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
              <Typography variant="subtitle2">Report Details</Typography>
              <RHFMultiCheckbox row spacing={4} name="employmentTypes" options={[]} />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Campaign</Typography>

              <RHFAutocomplete
                name="campaign_id"
                label="Campaign"
                placeholder="Search campaign..."
                loading={campaignsLoading}
                options={Array.isArray(campaigns) ? campaigns.map((cmpg) => cmpg._id) : []}
                getOptionLabel={(option) => {
                  const campaign = campaigns?.find((cmpg) => cmpg._id === option);
                  if (campaign) {
                    return campaign?.title;
                  }
                  console.log(option, 'option');
                  return option;
                }}
                renderOption={(props, option) => {
                  const campaign = campaigns?.filter((cmpg) => cmpg._id === option)[0];

                  if (!campaign?._id) {
                    return null;
                  }

                  return (
                    <li {...props} key={campaign._id.toString()}>
                      {campaign?.title}
                    </li>
                  );
                }}
                value={campaingsValue || null} // Ensures the value is always an array, even if it's initially undefined
                onChange={(event, newValue) => {
                  setValue('campaign_id', newValue);
                }}
              />
            </Stack>

            {/* <Stack spacing={1.5}>
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
            </Stack> */}
          </Stack>
        </Card>
      </Grid>
    </>
  );
  return (
    <Grid container spacing={3}>
      {renderDetails}

      {renderProperties}
    </Grid>
  );
}
