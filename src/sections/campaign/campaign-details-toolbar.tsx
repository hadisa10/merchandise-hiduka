import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack, { StackProps } from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

import { ICampaign } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  // publish: string;
  currentCampaign: ICampaign | undefined;
  isSubmitting: boolean;
  // onChangePublish: (newValue: string) => void;
  // publishOptions: {
  //   value: string;
  //   label: string;
  // }[];
};

export default function CampaignDetailsToolbar({
  backLink,
  currentCampaign,
  isSubmitting,
  // onChangePublish,
  sx,
  ...other
}: Props) {
  return (
    <Stack>
      <Typography variant="body2" color="text.secondary">
        {currentCampaign?.title?.toUpperCase() ?? ""}
      </Typography>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mt: { xs: 0, md: 1 },
          mb: { xs: 1, md: 2 },
          ...sx,
        }}
        {...other}
      >
        <Button
          component={RouterLink}
          href={backLink}
          startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={16} />}
        >
          Back
        </Button>

        <Box sx={{ flexGrow: 1 }} />

        {/* <LoadingButton
          color="inherit"
          variant="contained"
          loading={!publish}
          loadingIndicator="Loading…"
          // endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          Save Campaign
        </LoadingButton> */}
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {!currentCampaign ? 'Create Campaign' : 'Save Changes'}
        </LoadingButton>
      </Stack>

      {/* <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {publishOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === publish}
            onClick={() => {
              popover.onClose();
              onChangePublish(option.value);
            }}
          >
            {option.value === 'published' && <Iconify icon="eva:cloud-upload-fill" />}
            {option.value === 'draft' && <Iconify icon="solar:file-text-bold" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover> */}
    </Stack>
  );
}
