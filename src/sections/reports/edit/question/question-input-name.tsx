import { UseFormRegister } from 'react-hook-form';

import { styled, Typography } from '@mui/material';
import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';

import { IReport } from 'src/types/realm/realm-types';

interface QuestionInputNameProps extends InputBaseProps {
  error?: boolean;
  name: string
  helperText?: string;
  register: UseFormRegister<IReport>;

}

const ErrorText = styled(Typography)({
  color: 'red', // Adjust the color as needed for your design
  marginTop: 4,
  fontSize: '0.75rem',
});

export default function QuestionInputName({ name, error, helperText, sx, register, size, ...other }: QuestionInputNameProps) {
  const registerProps = register(name as keyof IReport);
  const small = size === "small"
  return (
    <div>
      <InputBase
        {...registerProps}
        sx={{
          [`&.${inputBaseClasses.root}`]: {
            py: small ? 0 : 0.75,
            borderRadius: 1,
            typography: small ? 'caption' : 'h6',
            borderWidth: 2,
            borderStyle: 'solid',
            borderColor: error ? 'error.main' : 'transparent', // Use the theme's error color if there's an error
            transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
            [`&.${inputBaseClasses.focused}`]: {
              pl: 1.5,
              borderColor: error ? 'error.main' : 'text.primary',
            },
          },
          [`& .${inputBaseClasses.input}`]: {
            typography: small ? "caption " : 'h6',
          },
          ...sx,
        }}
        {...other}
      />
      {error && helperText && <ErrorText>{helperText}</ErrorText>}
    </div>
  );
}
