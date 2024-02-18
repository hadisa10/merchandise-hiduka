import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

import Iconify from 'src/components/iconify';

import { ActualInputType } from 'src/types/report';

// Update the constant array to include the new input types
const INPUT_TYPES: ActualInputType[] = ['text', 'number', 'select', 'radio', 'checkbox', 'date', 'email', 'file', 'password', 'range', 'url'];

// Update the Props type (no changes needed here, just included for context)
type Props = {
  inputType: ActualInputType;
  onChangeInputType: (newValue: ActualInputType) => void;
};

// Extend the getIcon function to handle 'range' and 'url'
const getIcon = (option: ActualInputType) => {
  switch (option) {
    case 'text':
      return 'ic:baseline-text-fields';
    case 'number':
      return 'ic:baseline-numeric';
    case 'select':
      return 'ic:baseline-arrow-drop-down-circle';
    case 'radio':
      return 'ic:baseline-radio-button-checked';
    case 'checkbox':
      return 'ic:baseline-check-box';
    case 'date':
      return 'ic:baseline-event';
    case 'email':
      return 'ic:baseline-email';
    case 'file':
      return 'ic:baseline-attach-file';
    case 'password':
      return 'ic:baseline-password';
    case 'range':
      return 'ic:baseline-tune'; // Placeholder icon, adjust as needed
    case 'url':
      return 'ic:baseline-link'; // Placeholder icon, adjust as needed
    default:
      return '';
  }
};

export default function QuestionDetailsInputType({ inputType, onChangeInputType }: Props) {
  return (
    <Stack direction="row" flexWrap="wrap" spacing={1}>
      {INPUT_TYPES.map((option) => (
        <ButtonBase
          key={option}
          onClick={() => onChangeInputType(option)}
          sx={{
            py: 0.5,
            pl: 0.75,
            pr: 1.25,
            fontSize: 12,
            borderRadius: 1,
            lineHeight: '20px',
            textTransform: 'capitalize',
            fontWeight: 'fontWeightBold',
            boxShadow: (theme) => `inset 0 0 0 1px ${alpha(theme.palette.grey[500], 0.24)}`,
            ...(option === inputType && {
              boxShadow: (theme) => `inset 0 0 0 2px ${theme.palette.primary.main}`,
              color: theme => theme.palette.primary.main,
            }),
          }}
        >
          <Iconify
            icon={getIcon(option)}
            sx={{
              mr: 0.5,
              color: (theme) => (option === inputType ? theme.palette.primary.main : theme.palette.action.active),
            }}
          />
          {option}
        </ButtonBase>
      ))}
    </Stack>
  );
}
