import { isString } from 'lodash';
// import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import React, { useEffect, useCallback } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, List, Paper, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { ActualInputType, IReportQuestionActions } from 'src/types/report';
import { IReport, ICampaign, IReportQuestions, IQuestionDependency, IReportQuestionsValidation } from 'src/types/realm/realm-types';

import QuestionItem from './question-item';
import QuestionAdd from './question/question-add';
import QuestionsColumnToolBar from './question/question-column-tool-bar';


const QuestionsNewEditList = ({ campaigns, campaignsLoading }: { campaigns?: ICampaign[], campaignsLoading?: boolean }) => {

  const mdUp = useResponsive('up', 'md');

  const openAddQuestion = useBoolean();

  const dragStarted = useBoolean();

  const { control, watch, formState: { errors }, register } = useFormContext<IReport>();


  const { fields: questions, prepend, remove, move, update } = useFieldArray({
    control,
    name: "questions",
  });

  const reportName = watch("title");

  // const [reports, setReports] = useState<string[]>([]);
  // const [newReport, setNewReport] = useState<string>('');

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // Do nothing if the item is dropped outside the list or dropped into the same place
    if (!destination || source.index === destination.index) {
      return;
    }

    // Perform the move operation
    move(source.index, destination.index);
    dragStarted.onFalse()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [move, questions, update]);

  const addQuestion = (newQuestion: IReportQuestions) => {
    if (!isString(newQuestion.text)) return;
    if (!newQuestion.text.trim()) return;
    prepend(newQuestion)
  };


  useEffect(() => {
    if (!dragStarted.value) {
      questions.forEach((question, index) => {
        // Assuming the order starts at 1 and matches the array index + 1
        update(index, { ...question, order: index + 1 });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dragStarted.value])


  const handleAddValidation = useCallback((questionIndex: number, newValidation: Partial<IReportQuestionsValidation>) => {
    const question = questions[questionIndex];
    const updatedValidation = { ...question.validation, ...newValidation };
    update(questionIndex, { ...question, validation: updatedValidation });
  }, [questions, update]); // Add other dependencies as needed

  const handleChangeInputType = useCallback((questionIndex: number, newInputType: ActualInputType) => {
    const question = questions[questionIndex];
    update(questionIndex, { ...question, input_type: newInputType });
  }, [questions, update]);

  const handleChangeQuestionText = useCallback((questionIndex: number, text: string) => {
    const question = questions[questionIndex];
    console.log(question, "question")
    update(questionIndex, { ...question, text });
  }, [questions, update]);

  const handleAddDependency = useCallback((questionIndex: number, newDependency: IQuestionDependency) => {
    const question = questions[questionIndex];
    const updatedDependencies = question.dependencies ? [...question.dependencies, newDependency] : [newDependency];
    update(questionIndex, { ...question, dependencies: updatedDependencies });
  }, [questions, update]);

  const handleRemoveQuestion = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  const handleRemoveValidation = useCallback((questionIndex: number, validationKey: keyof IReportQuestionsValidation) => {
    const question = questions[questionIndex];
    const updatedValidation = { ...question.validation, [validationKey]: undefined };
    update(questionIndex, { ...question, validation: updatedValidation });
  }, [questions, update]);


  // Then you can group these into an actions object if you like, or pass them directly as props.

  const actions: IReportQuestionActions = {
    handleAddDependency,
    handleAddValidation,
    handleChangeQuestionText,
    handleChangeInputType,
    handleRemoveQuestion,
    handleRemoveValidation
  }
  const renderSummary = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Summary
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Number of question: {Array.isArray(questions) ? questions.length : 0}
          </Typography>
        </Grid>
      )}
    </>
  )

  const renderAddTask = (
    openAddQuestion.value && (
      <Box
        sx={{
          py: 2,
          px: 2
        }}
      >
        <QuestionAdd
          onAddQuestion={addQuestion}
          onCloseQuestion={openAddQuestion.onFalse}
        />
      </Box>
    )
  );
  const renderQuestions = (
    <Grid xs={12} md={8}>

      <Paper
        sx={{
          p: mdUp ? 0.5 : 0.1,
          borderRadius: 2,
          position: "relative",
          bgcolor: 'background.neutral',

        }}
      >
        <QuestionsColumnToolBar
          openAddQuestion={openAddQuestion.onTrue}
          reportName={reportName as unknown as string ?? ""}
          onClearQuestions={() => console.log("Clear Questions")}
        />
        {renderAddTask}
        <DragDropContext onDragEnd={onDragEnd} onDragStart={dragStarted.onTrue}>
          <Droppable droppableId="reports">
            {(provided) => (
              <List ref={provided.innerRef} sx={{ maxHeight: "60vh", overflowY: "auto" }} {...provided.droppableProps}>
                {(Array.isArray(questions)) && questions.map((q, index) => (
                  <QuestionItem
                    key={q._id.toString()}
                    index={index}
                    actions={actions}
                    question={q}
                    register={register}
                    questionError={errors.questions?.[index]} // Pass the corresponding error
                    onUpdateQuestion={(qs) => console.log(qs)}
                    onDeleteQuestion={() => console.log("QUESTION DELETED")}
                  />
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>
      </Paper>
    </Grid>
  )

  return (
    <Grid container spacing={3}>
      {renderQuestions}

      {renderSummary}

    </Grid>
  );
}

export default QuestionsNewEditList;

