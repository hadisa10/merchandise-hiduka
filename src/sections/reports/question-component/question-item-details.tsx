// 

import { isNumber, capitalize, isString } from 'lodash';
import { UseFormRegister } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback, ChangeEvent, lazy, Suspense } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { List, Switch, ListItem, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import Scrollbar from 'src/components/scrollbar';

import { IReport, IReportQuestion } from 'src/types/realm/realm-types';
import { QuestionError, ActualInputType, IReportQuestionActions } from 'src/types/report';
import { LoadingScreen } from 'src/components/loading-screen';

const QuestionInputName = lazy(() => import('./question-input-name'));
const QuestionDetailsToolbar = lazy(() => import('./question-details-toolbar'));
const QuestionDetailsInputType = lazy(() => import('./question-details-input-type'));


// ----------------------------------------------------------------------

const StyledLabel = styled('span')(({ theme }) => ({
  ...theme.typography.caption,
  width: 100,
  flexShrink: 0,
  color: theme.palette.text.secondary,
  fontWeight: theme.typography.fontWeightSemiBold,
}));

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

type Props = {
  question: IReportQuestion;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  actions: IReportQuestionActions;
  questionError?: QuestionError;
  register: UseFormRegister<IReport>;
  index: number;
  //
  // onUpdateQuestion: (onUpdateQuestion: IReportQuestion) => void;
  onDeleteQuestion: VoidFunction;
};


const VALIDATION_OPTIONS = [
  { id: 'required', label: 'Required', type: 'boolean', value: null },
  { id: 'minLength', label: 'Minimum Length', type: 'number', value: null },
  { id: 'maxLength', label: 'Maximum Length', type: 'number', value: null },
  { id: 'minValue', label: 'Minimum Value', type: 'number', value: null },
  { id: 'maxValue', label: 'Maximum Value', type: 'number', value: null },
  { id: 'regex', label: 'Regex', type: 'object', value: null },

  // Add more validation options as needed
];
export default function QuestionDetails({
  question,
  openDetails,
  onCloseDetails,
  questionError,
  actions,
  index,
  register,
  //
  onDeleteQuestion,
}: Props) {

  const [questionText, setQuestionText] = useState(question.text);

  const [maxValue, setMaxValue] = useState<number | null>(null);

  const [minValue, setMinValue] = useState<number | null>(null);

  const [regexMatches, setRegexMatches] = useState<string | null>(null);

  const [regexMessage, setRegexMessage] = useState<string | null>(null);

  const [maxLength, setMaxLength] = useState<number | null>(null);

  const [minLength, setMinLength] = useState<number | null>(null);

  // const [taskDescription, setTaskDescription] = useState(task.description);

  // const rangePicker = useDateRangePicker(task.due[0], task.due[1]);

  const handleChangeQuestionName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(event.target.value)
  }, []);

  const handleUpdateTask = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (questionText) {
            actions.handleChangeQuestionText(index, questionText)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questionText, index]
  );

  const handleUpdateMaxValue = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (maxValue && isNumber(maxValue)) {
            actions.handleChangeQuestionMaxValue(index, maxValue)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxValue, index]
  );

  const handleUpdateMinValue = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (minValue && isNumber(minValue)) {
            actions.handleChangeQuestionMinValue(index, minValue)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minValue, index]
  );

  const handleUpdateRegexMatchesValue = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {
          if (regexMatches && isString(regexMatches)) {
            actions.handleChangeQuestionRegexMatches(index, regexMatches)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regexMatches, index]
  );


  const handleUpdateRegexMessageValue = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (regexMessage && isString(regexMessage)) {
            actions.handleChangeQuestionRegexMessage(index, regexMessage)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [regexMessage, index]
  );


  const handleUpdateMaxLength = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (maxValue && isNumber(maxValue)) {
            actions.handleChangeQuestionMaxLength(index, maxValue)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [maxValue, index]
  );

  const handleUpdateMinLength = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {

          if (minLength && isNumber(minLength)) {
            actions.handleChangeQuestionMinLength(index, minLength)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [minLength, index]
  );


  const handleChangeInputType = (inputType: ActualInputType) => {
    actions.handleChangeInputType(index, inputType)
  }

  const handleChangeQuestionRequired = () => {
    actions.handleChangeQuestionRequired(index)
  }

  const handleChangeQuestionUnique = () => {
    actions.handleChangeQuestionUnique(index)
  }

  const onChangeMaxValue = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as number
    if (!Number.isNaN(v)) setMaxValue(v);
  })

  const onChangeMinValue = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as number
    if (!Number.isNaN(v)) setMinValue(v);
  })

  const onChangeRegexMatchesVal = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as string

    if (isString(v)) {
      setRegexMatches(v);
    }
  })

  const onChangeRegexMessageVal = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as string
    if (isString(v)) {
      setRegexMessage(v);
    }
  })

  const onChangeMaxLength = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as number
    if (!Number.isNaN(v)) setMaxLength(v);
  })

  const onChangeMinLength = ((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const v = e.target.value as unknown as number
    if (!Number.isNaN(v)) setMinLength(v);
  })
  const renderHead = (
    <QuestionDetailsToolbar
      questionName={question.text}
      onDelete={onDeleteQuestion}
      onCloseDetails={onCloseDetails}
    />
  );

  useEffect(() => {
    setQuestionText(question.text)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openDetails])

  const textErrorMessage = useMemo(() => questionError?.text?.message, [questionError?.text?.message]);

  const renderName = (
    <QuestionInputName
      placeholder="Question"
      value={questionText}
      name={`questions.${index}.text`}
      register={register}
      onChange={handleChangeQuestionName}
      onKeyUp={handleUpdateTask}
      error={!!textErrorMessage}
      helperText={textErrorMessage}
      fullWidth // Assuming you want the input to take the full width
    />
  );

  const inputType = useMemo(() => question.input_type, [question.input_type])


  const renderInputType = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Input Type</StyledLabel>

      <QuestionDetailsInputType inputType={inputType as unknown as ActualInputType} onChangeInputType={handleChangeInputType} />
    </Stack>
  );

  const renderRequired = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Required</StyledLabel>
      <Switch size="small" checked={question.validation?.required} onClick={handleChangeQuestionRequired} />
    </Stack>
  );

  const renderMaxLength = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Max Length</StyledLabel>
      <QuestionInputName
        placeholder=""
        value={maxLength}
        size="small"
        type='number'
        inputProps={{ min: 1, step: 1 }}
        // name={`questions.${index}.validation.maxLength`}
        // register={register}
        onChange={onChangeMaxLength}
        onKeyUp={handleUpdateMaxLength}
        error={!!questionError?.validation?.maxLength?.message}
        helperText={questionError?.validation?.maxLength?.message}
      />
    </Stack>
  );

  const renderMinLength = (

    <Stack direction="row" alignItems="start">
      <StyledLabel>Min Length</StyledLabel>
      <QuestionInputName
        placeholder=""
        value={minLength}
        size="small"
        type='number'
        inputProps={{ min: 1, step: 1 }}
        // name={`questions.${index}.validation.minLength`}
        // register={register}
        onChange={onChangeMinLength}
        onKeyUp={handleUpdateMinLength}
        error={!!questionError?.validation?.minLength?.message}
        helperText={questionError?.validation?.minLength?.message}
      />
    </Stack>
  );

  const renderMaxValue = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Max Value</StyledLabel>
      <QuestionInputName
        placeholder=""
        value={maxValue}
        size="small"
        type='number'
        inputProps={{ min: 1, step: 1 }}
        // name={`questions.${index}.validation.maxValue`}
        // register={register}
        onChange={onChangeMaxValue}
        onKeyUp={handleUpdateMaxValue}
        error={!!questionError?.validation?.maxValue?.message}
        helperText={questionError?.validation?.maxValue?.message}
      />
    </Stack>
  );


  const renderMinValue = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Min Value</StyledLabel>
      <QuestionInputName
        placeholder=""
        value={minValue}
        size="small"
        type='number'
        inputProps={{ min: 1, step: 1 }}
        // name={`questions.${index}.validation.minValue`}
        // register={register}
        onChange={onChangeMinValue}
        onKeyUp={handleUpdateMinValue}
        error={!!questionError?.validation?.minValue?.message}
        helperText={questionError?.validation?.minValue?.message}
      />
    </Stack>
  );
  const renderRegex = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Regex</StyledLabel>
      <Stack>

        <Stack spacing={1}>
          <QuestionInputName
            placeholder="matches"
            value={regexMatches}
            size="small"
            // name={`questions.${index}.validation.regex.matches`}
            // register={register}
            onChange={onChangeRegexMatchesVal}
            onKeyUp={handleUpdateRegexMatchesValue}
            error={!!questionError?.validation?.regex?.matches}
            // @ts-expect-error expected
            helperText={questionError?.validation?.regex?.matches}
          />
          <QuestionInputName
            placeholder="message"
            value={regexMessage}
            size="small"
            // name={`questions.${index}.validation.regex.message`}
            // register={register}
            onChange={onChangeRegexMessageVal}
            onKeyUp={handleUpdateRegexMessageValue}
            error={!!questionError?.validation?.regex?.matches?.message}
            // @ts-expect-error expected
            helperText={questionError?.validation?.regex?.message?.message ?? ""}
          />
        </Stack>
      </Stack>
    </Stack>
  );




  const renderUnique = (
    <Stack direction="row" alignItems="start">
      <StyledLabel>Unique</StyledLabel>
      <Switch size="small" checked={question.unique} onClick={handleChangeQuestionUnique} />
    </Stack>
  );

  const details = useMemo(() => (
    Object.entries(question)
      .filter(([key, value]) =>
      (key !== "__typename"
        // && value !== null
        && key !== "validation"
        && key !== "dependencies"
        && key !== "id"
        && key !== "_id"
        && key !== "text"
        && key !== "__typename"
      )
      ).map(([key, value], i) => {
        let val;
        const idx = key + i;
        switch (key.toLowerCase()) {
          case "options":
            val =
              <Stack direction="row" key={idx} alignItems="start">
                <StyledLabel>{capitalize(key)}</StyledLabel>
                <List disablePadding>
                  {Array.isArray(value) &&
                    value.map((v, indx) => (
                      <ListItem disableGutters disablePadding key={v.toString() + indx}>
                        <Typography variant="caption" sx={{ mb: 0.5 }}>
                          {v.toString()}
                        </Typography>
                      </ListItem>
                    ))
                  }
                </List>
              </Stack>;

            break;
          case "input_type":
            val = renderInputType;
            break;
          case "unique":
            val = renderUnique;
            break;
          case "updatedat":
            val =
              <Stack direction="row" key={idx} alignItems="center">
                <StyledLabel>Updated At</StyledLabel>
                <Typography variant='caption'>{value && fDateTime(value.toLocaleString())}</Typography>
              </Stack>;
            break;
          case "string":
          default:
            val =
              <Stack direction="row" key={idx} alignItems="center">
                <StyledLabel>{capitalize(key)}</StyledLabel>
                <Typography variant='caption'>{value && capitalize(typeof value !== "string" ? value.toString() : value)}</Typography>
              </Stack>;
            break;
        }
        return val
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [question, index, inputType])




  const renderDetails = (details)

  const renderDependencies = (
    question.dependencies && Object.entries(question.dependencies).filter(([key]) => key !== "__typename").map(([key, value], i) => (
      <Stack direction="row" key={key + i} alignItems="center">
        <StyledLabel>{capitalize(key)}</StyledLabel>
        <Typography variant='caption'>{JSON.stringify(value)}</Typography>
      </Stack>
    ))
  )

  const validationOptions = useMemo(() =>
    // @ts-expect-error expected
    VALIDATION_OPTIONS.map(({ id, label }) => ({ id, label, value: question.validation ? (question.validation[id] ?? null) : null }))
    , [question.validation])

  const renderValidations = (
    validationOptions.map(({ id, label, value }, i) => {
      switch (id.toLowerCase()) {
        case "required":
          return renderRequired;

        case "maxlength":
          return renderMaxLength;

        case "minlength":
          return renderMinLength;

        case "maxvalue":
          return renderMaxValue;

        case "minvalue":
          return renderMinValue;

        case "regex":
          return renderRegex;

        default:
          return (
            <Stack direction="row" key={id} alignItems="center">
              <StyledLabel>{label}</StyledLabel>
              <Typography variant='caption'>{value && (JSON.stringify(value))}</Typography>
            </Stack>
          );
      }

    })
  )

  return (
    <Drawer
      open={openDetails}
      onClose={onCloseDetails}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: {
          width: {
            xs: 1,
            sm: 480,
          },
        },
      }}
    >
      {renderHead}

      <Divider />

      <Scrollbar
        sx={{
          height: 1,
          '& .simplebar-content': {
            height: 1,
            display: 'flex',
            flexDirection: 'column',
          },
        }}
      >
        <Suspense fallback={<LoadingScreen />}>

          <Stack
            spacing={3}
            sx={{
              pt: 3,
              pb: 5,
              px: 2.5,
            }}
          >
            {renderName}

            <Divider>
              <Typography variant='caption' > <StyledLabel>Details</StyledLabel></Typography>
            </Divider>

            {renderDetails}

            <Divider>
              <Typography variant='caption' > <StyledLabel>Validations</StyledLabel></Typography>
            </Divider>

            {renderValidations}

            <Divider>
              <Typography variant='caption' > <StyledLabel>Dependencies</StyledLabel></Typography>
            </Divider>

            {renderDependencies}

          </Stack>
        </Suspense>
      </Scrollbar>

    </Drawer>
  );
}
