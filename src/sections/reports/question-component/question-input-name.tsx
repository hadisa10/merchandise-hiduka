// import { useFormContext, UseFormRegister } from 'react-hook-form';

// import { styled, Typography } from '@mui/material';
// import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';

// import { IReport } from 'src/types/realm/realm-types';

// interface QuestionInputNameProps extends InputBaseProps {
//   error?: boolean;
//   name?: string
//   helperText?: string;
//   register?: UseFormRegister<IReport>;

// }

// const ErrorText = styled(Typography)({
//   color: 'red', // Adjust the color as needed for your design
//   marginTop: 4,
//   fontSize: '0.75rem',
// });

// export default function QuestionInputName({ name, error, helperText, sx, size, ...other }: QuestionInputNameProps) {
//   const { register } = useFormContext();
//   const registerProps = name ? register(name as keyof IReport) : {}
//   const small = size === "small"
//   return (
//     <div>
//       <InputBase
//         {...registerProps}
//         sx={{
//           [`&.${inputBaseClasses.root}`]: {
//             py: small ? 0 : 0.75,
//             borderRadius: 1,
//             typography: small ? 'caption' : 'h6',
//             borderWidth: 2,
//             borderStyle: 'solid',
//             borderColor: error ? 'error.main' : 'transparent', // Use the theme's error color if there's an error
//             transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
//             [`&.${inputBaseClasses.focused}`]: {
//               pl: 1.5,
//               borderColor: error ? 'error.main' : 'text.primary',
//             },
//           },
//           [`& .${inputBaseClasses.input}`]: {
//             typography: small ? "caption " : 'h6',
//           },
//           ...sx,
//         }}
//         {...other}
//       />
//       {error && helperText && <ErrorText>{helperText}</ErrorText>}
//     </div>
//   );
// }

import { Controller, useFormContext } from 'react-hook-form';

import { styled, Typography } from '@mui/material';
import InputBase, { InputBaseProps, inputBaseClasses } from '@mui/material/InputBase';

const ErrorText = styled(Typography)({
  color: 'red',
  marginTop: 4,
  fontSize: '0.75rem',
});

interface QuestionInputNameProps extends InputBaseProps {
  error?: boolean;
  name?: string;
  helperText?: string;
}

export default function QuestionInputName({
  name,
  error,
  helperText,
  sx,
  size,
  ...other
}: QuestionInputNameProps) {
  const { control, watch } = useFormContext();

  const small = size === 'small';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const inputType = watch();

  return (
    <div>
      <Controller
        name={name ?? ''}
        control={control}
        defaultValue={undefined} // Default the value to undefined
        render={({ field: { onChange, onBlur, value, name: n, ref } }) => (
          <InputBase
            name={n}
            ref={ref}
            value={value === '' ? null : value} // Convert empty string to undefined
            onChange={onChange}
            onBlur={onBlur}
            sx={{
              [`&.${inputBaseClasses.root}`]: {
                py: small ? 0 : 0.75,
                borderRadius: 1,
                typography: small ? 'caption' : 'h6',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: error ? 'error.main' : 'transparent',
                transition: (theme) => theme.transitions.create(['padding-left', 'border-color']),
                [`&.${inputBaseClasses.focused}`]: {
                  pl: 1.5,
                  borderColor: error ? 'error.main' : 'text.primary',
                },
              },
              [`& .${inputBaseClasses.input}`]: {
                typography: small ? 'caption' : 'h6',
              },
              ...sx,
            }}
            // {...other}
          />
        )}
      />
      {error && helperText && <ErrorText>{helperText}</ErrorText>}
    </div>
  );
}
