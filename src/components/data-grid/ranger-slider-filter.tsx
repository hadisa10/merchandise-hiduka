import * as React from 'react';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { TextField } from '@mui/material';
import { GridFilterOperator, GridFilterInputValueProps } from '@mui/x-data-grid';

export interface RangeSliderFilterProps extends GridFilterInputValueProps { }

export const RangeSliderFilter: React.FC<RangeSliderFilterProps> = ({
  item,
  applyValue,
}) => {
  const [value, setValue] = React.useState<number[]>(item.value || [20, 37]);

  const handleChange = (
    event: Event,
    newValue: number | number[],
  ) => {
    setValue(newValue as number[]);
    applyValue({ ...item, value: newValue });
  };

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <Slider
        getAriaLabel={() => 'Range filter'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={0}
        max={100}
      />
    </Box>
  );
};

interface NumericFilterInputProps extends GridFilterInputValueProps { }

export const NumericFilterInput: React.FC<NumericFilterInputProps> = ({
  item,
  applyValue,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    applyValue({
      ...item,
      value: event.target.value === '' ? undefined : Number(event.target.value),
    });
  };

  return (
    <Box sx={{ width: 300, padding: 2 }}>
      <TextField
        type="number"
        value={item.value ?? ''}
        onChange={handleChange}
        variant="outlined"
        size="small"
        fullWidth
      />
    </Box>
  );
};



export const numericFilterOperators: GridFilterOperator[] = [

  {
    label: 'Greater than',
    value: 'greaterThan',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value === undefined) return null;

      return ({ value }): boolean => value > filterItem.value;
    },
    InputComponent: NumericFilterInput,
  },
  {
    label: 'Less than',
    value: 'lessThan',
    getApplyFilterFn: (filterItem) => {
      if (filterItem.value === undefined) return null;

      return ({ value }): boolean => value < filterItem.value;
    },
    InputComponent: NumericFilterInput,
  },
  {
    label: 'In range',
    value: 'inRange',
    getApplyFilterFn: (filterItem) => {
      if (!filterItem.value) return null;

      return ({ value }): boolean => {
        const [min, max] = filterItem.value as number[];
        return value >= min && value <= max;
      };
    },
    InputComponent: RangeSliderFilter,
  },
  // You can add more custom filter operators here
];
