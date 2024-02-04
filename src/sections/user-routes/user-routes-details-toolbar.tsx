import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import LoadingButton from '@mui/lab/LoadingButton';
import Stack, { StackProps } from '@mui/material/Stack';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

type Props = StackProps & {
  backLink: string;
  editLink: string;
  status: string;
  onChangeState: (newValue: string) => void;
  statusOptions: {
    value: string;
    label: string;
  }[];
};

export default function UserRoutesDetailsToolbar({
  status,
  backLink,
  editLink,
  statusOptions,
  onChangeState,
  sx,
  ...other
}: Props) {
  const popover = usePopover();

  return (
    <>
      <Stack
        spacing={1.5}
        direction="row"
        sx={{
          mb: { xs: 3, md: 5 },
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


        {/* <Tooltip title="Edit">
          <IconButton component={RouterLink} href={editLink}>
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        </Tooltip> */}

        <LoadingButton
          color="inherit"
          variant="contained"
          loading={!status}
          loadingIndicator="Loading…"
          endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
          onClick={popover.onOpen}
          sx={{ textTransform: 'capitalize' }}
        >
          {status}
        </LoadingButton>
      </Stack>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        {statusOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={option.value === status}
            onClick={() => {
              popover.onClose();
              onChangeState(option.value);
            }}
          >
            {option.value === 'active' && <Iconify icon="ri:route-line" />}
            {option.value === 'pending' && <Iconify icon="material-symbols:route-outline" />}
            {option.value === 'cancelled' && <Iconify icon="tabler:route-x-2" />}
            {option.value === 'refunded' && <Iconify icon="tabler:route-x-2" />}
            {option.value === 'completed' && <Iconify icon="material-symbols:route" />}
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
