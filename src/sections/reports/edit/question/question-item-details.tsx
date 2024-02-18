import { capitalize } from 'lodash';
import { UseFormRegister } from 'react-hook-form';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import { List, ListItem, Typography } from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import Scrollbar from 'src/components/scrollbar';

import { IReport, IReportQuestions } from 'src/types/realm/realm-types';
import { QuestionError, ActualInputType, IReportQuestionActions } from 'src/types/report';

import QuestionInputName from './question-input-name';
import QuestionDetailsToolbar from './question-details-toolbar';
import QuestionDetailsInputType from './question-details-input-type';

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
  question: IReportQuestions;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  actions: IReportQuestionActions;
  questionError?: QuestionError;
  register: UseFormRegister<IReport>;
  index: number;
  //
  // onUpdateQuestion: (onUpdateQuestion: IReportQuestions) => void;
  onDeleteQuestion: VoidFunction;
};

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
    [questionText, index, actions]
  );

  const handleChangeInputType = (inputType: ActualInputType) => {
    actions.handleChangeInputType(index, inputType)
  }
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

  const details = useMemo(() => (
    Object.entries(question)
      .filter(([key, value]) =>
      (key !== "__typename"
        && value !== null
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
          case "updatedat":
            val =
              <Stack direction="row" key={index} alignItems="center">
                <StyledLabel>Updated At</StyledLabel>
                <Typography variant='caption'>{fDateTime(value.toLocaleString())}</Typography>
              </Stack>;
            break;
          case "string":
          default:
            val =
              <Stack direction="row" key={index} alignItems="center">
                <StyledLabel>{capitalize(key)}</StyledLabel>
                <Typography variant='caption'>{capitalize(typeof value !== "string" ? value.toString() : value)}</Typography>
              </Stack>;
            break;
        }
        return val
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  ), [question, index, inputType])




  const renderDetails = (details)

  const renderValidations = (
    question.validation && Object.entries(question.validation).filter(([key, value]) => key !== "__typename" && value !== null).map(([key, value], i) => (
      <Stack direction="row" key={key + i} alignItems="center">
        <StyledLabel>{capitalize(key)}</StyledLabel>
        <Typography variant='caption'>{JSON.stringify(value)}</Typography>
      </Stack>
    ))
  )


  const renderDependencies = (
    question.dependencies && Object.entries(question.dependencies).filter(([key, value]) => key !== "__typename" && value !== null).map(([key, value], i) => (
      <Stack direction="row" key={key + i} alignItems="center">
        <StyledLabel>{capitalize(key)}</StyledLabel>
        <Typography variant='caption'>{JSON.stringify(value)}</Typography>
      </Stack>
    ))
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

      </Scrollbar>

    </Drawer>
  );
}
