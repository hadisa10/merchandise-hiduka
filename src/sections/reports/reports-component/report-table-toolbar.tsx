import { useState, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { ICampaignTableFilters, ICampaignTableFilterValue } from 'src/types/campaign';

// ----------------------------------------------------------------------

type Props = {
  filters: ICampaignTableFilters;
  onFilters: (name: string, value: ICampaignTableFilterValue) => void;
  //
  typeOptions: {
    value: string;
    label: string;
  }[];
  // activationOptions: {
  //   value: string;
  //   label: string;
  // }[];
};

export default function ReportTableToolbar({
  filters,
  onFilters,
  //
  typeOptions,
  // activationOptions,
}: Props) {
  const popover = usePopover();

  const [type, setType] = useState<string[]>(filters.type);

  // const [activation, setActivation] = useState<string[]>(filters.activation);

  const handleChangeType = useCallback((event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    setType(typeof value === 'string' ? value.split(',') : value);
  }, []);

  // const handleChangeActivation = useCallback((event: SelectChangeEvent<string[]>) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setActivation(typeof value === 'string' ? value.split(',') : value);
  // }, []);

  const handleCloseType = useCallback(() => {
    onFilters('type', type);
  }, [onFilters, type]);

  // const handleClosePublish = useCallback(() => {
  //   onFilters('activation', activation);
  // }, [onFilters, activation]);

  return (
    <>
      <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Type</InputLabel>

        <Select
          multiple
          value={type}
          onChange={handleChangeType}
          input={<OutlinedInput label="Type" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleCloseType}
          sx={{ textTransform: 'capitalize' }}
        >
          {typeOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={type.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <FormControl
        sx={{
          flexShrink: 0,
          width: { xs: 1, md: 200 },
        }}
      >
        <InputLabel>Publish</InputLabel>

        <Select
          multiple
          value={activation}
          onChange={handleChangeActivation}
          input={<OutlinedInput label="Activation" />}
          renderValue={(selected) => selected.map((value) => value).join(', ')}
          onClose={handleClosePublish}
          sx={{ textTransform: 'capitalize' }}
        >
          {activationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              <Checkbox disableRipple size="small" checked={activation.includes(option.value)} />
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl> */}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:printer-minimalistic-bold" />
          Print
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:import-bold" />
          Import
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
          }}
        >
          <Iconify icon="solar:export-bold" />
          Export
        </MenuItem>
      </CustomPopover>
    </>
  );
}
