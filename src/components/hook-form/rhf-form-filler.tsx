import React from 'react';
import * as Yup from 'yup';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Grid, Stack, MenuItem, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { IReportQuestions } from 'src/types/realm/realm-types';

import FormProvider from './form-provider'; // Adjust the import path as needed

import RHFCode from './rhf-code';
import RHFSwitch from './rhf-switch';
import RHFSlider from './rhf-slider';
import RHFEditor from './rhf-editor';
import { RHFSelect } from './rhf-select';
import { RHFUpload } from './rhf-upload';
// Import your custom RHF components
import RHFTextField from './rhf-text-field';
import { RHFCheckbox } from './rhf-checkbox';
import RHFRadioGroup from './rhf-radio-group';
import RHFAutocomplete from './rhf-autocomplete';



type DynamicFormProps = {
    questions: IReportQuestions[];
    onSubmit: (data: any) => Promise<void>;
};

const RHFFormFiller: React.FC<DynamicFormProps> = ({ questions, onSubmit }) => {
    const mdUp = useResponsive('up', 'md');

    const generateSchema = (q: IReportQuestions[]) => Yup.object().shape(
        q.reduce((acc, question) => {
            let validator: Yup.StringSchema | Yup.NumberSchema = Yup.string(); // Default to string validator

            if (question.input_type === 'number') {
                validator = Yup.number();
                // Numeric validations
                if (question.validation?.minValue !== undefined) {
                    validator = validator.min(question.validation.minValue, `Minimum value is ${question.validation.minValue}`);
                }
                if (question.validation?.maxValue !== undefined) {
                    validator = validator.max(question.validation.maxValue, `Maximum value is ${question.validation.maxValue}`);
                }
            } else {
                // String validations
                if (question.validation?.required) {
                    validator = validator.required('This field is required');
                }
                if (question.validation?.minLength !== undefined) {
                    validator = validator.min(question.validation.minLength, `Minimum length is ${question.validation.minLength}`);
                }
                if (question.validation?.maxLength !== undefined) {
                    validator = validator.max(question.validation.maxLength, `Maximum length is ${question.validation.maxLength}`);
                }
                if (question.validation?.regex?.matches !== undefined) {
                    validator = validator.matches(new RegExp(question.validation.regex.matches), question.validation?.regex?.message ?? "Invalid Input");
                }
            }
            // @ts-expect-error expected
            acc[question._id] = validator;
            return acc;
        }, {} as Record<string, Yup.StringSchema | Yup.NumberSchema>)
    );


    const validationSchema = React.useMemo(() => generateSchema(questions), [questions]);

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: "all",
    });

    const { control, handleSubmit, formState: { isSubmitting, errors } } = methods;

    const handleSubmitting = handleSubmit(async (formData) => {
        await onSubmit(formData);
    });

    return (
        <FormProvider methods={methods} onSubmit={handleSubmitting}>
            {/* <form onSubmit={handleSubmitting}> */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Stack spacing={3}>
                        {questions.map((question) => (
                            <Controller
                                key={question._id.toString()}
                                name={question._id.toString()}
                                control={control}
                                render={({ field, fieldState: { error } }) => {
                                    // Default input component
                                    let InputComponent = RHFTextField;
                                    let additionalProps = {};

                                    switch (question.input_type) {
                                        case 'text':
                                        case 'email':
                                            InputComponent = RHFTextField;
                                            break;
                                        case 'checkbox':
                                            // @ts-expect-error
                                            InputComponent = RHFCheckbox;
                                            break;
                                        case 'select':
                                            // @ts-expect-error
                                            InputComponent = RHFSelect;
                                            additionalProps = {
                                                // For select, options are required
                                                children: question.options?.map(option => (
                                                    <MenuItem key={option} value={option}>{option}</MenuItem>
                                                )),
                                            };
                                            break;
                                        case 'radio':
                                            // @ts-expect-error
                                            InputComponent = RHFRadioGroup;
                                            additionalProps = {
                                                // For radio groups, options are required
                                                options: question.options.map(option => ({ label: option, value: option })),
                                            };
                                            break;
                                        case 'switch':
                                            // @ts-expect-error

                                            InputComponent = RHFSwitch;
                                            break;
                                        case 'autocomplete':
                                            // @ts-expect-error

                                            InputComponent = RHFAutocomplete;
                                            additionalProps = {
                                                // Autocomplete may need options and a way to render them
                                                options: question.options,
                                            };
                                            break;
                                        case 'slider':
                                        case 'range':
                                            // @ts-expect-error

                                            InputComponent = RHFSlider;
                                            break;
                                        case 'code':
                                            // @ts-expect-error

                                            InputComponent = RHFCode;
                                            break;
                                        case 'editor':
                                            // @ts-expect-error

                                            InputComponent = RHFEditor;
                                            break;
                                        case 'upload':
                                        case 'file':
                                            // @ts-expect-error
                                            InputComponent = RHFUpload;
                                            break;
                                        case 'number':
                                            InputComponent = RHFTextField;
                                            additionalProps = {
                                                type: 'number',
                                                // Convert input string to number for correct form handling
                                                onChange: (e: any) => field.onChange(parseFloat(e.target.value)),
                                            };
                                            break;
                                        default:
                                            console.error('Unsupported input type:', question.input_type);
                                    }

                                    return (
                                        <InputComponent
                                            {...field}
                                            {...additionalProps}
                                            label={question.text}
                                            // @ts-expect-error
                                            error={errors[question._id]?.message}
                                        />
                                    );
                                }}
                            />
                        ))}

                        <LoadingButton loading={isSubmitting} type="submit" variant="contained">
                            Submit
                        </LoadingButton>
                    </Stack>
                </Grid>
                {mdUp && (
                    <Grid item md={4}>
                        <Typography variant="h6" sx={{ mb: 0.5 }}>
                            Summary
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            Number of questions: {questions.length}
                        </Typography>
                    </Grid>
                )}
            </Grid>
            {/* </form> */}
        </FormProvider>
    );
};

export default RHFFormFiller;
