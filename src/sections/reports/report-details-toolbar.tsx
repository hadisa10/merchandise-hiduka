import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack, { StackProps } from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';

import { IReport } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  // publish: string;
  currentReport: IReport | undefined;
  isSubmitting: boolean;
  // onChangePublish: (newValue: string) => void;
  // publishOptions: {
  //   value: string;
  //   label: string;
  // }[];
};

export default function ReportDetailsToolbar({
  backLink,
  currentReport,
  isSubmitting,
  // onChangePublish,
  sx,
  ...other
}: Props) {
  return (
    <Stack>
      <Typography variant="body2" color="text.secondary">
        {currentReport?.title?.toUpperCase() ?? ""}
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
        <LoadingButton
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {!currentReport ? 'Create Report' : 'Save Changes'}
        </LoadingButton>
      </Stack>
    </Stack>
  );
}
