// @ts-nocheck
import { isEmpty, isString } from 'lodash';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
// import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import React, { memo, useRef, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, List, Paper, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { ActualInputType, IReportQuestionActions } from 'src/types/report';
import { IReport, IReportQuestion, IQuestionDependency, IReportQuestionValidation } from 'src/types/realm/realm-types';

import QuestionAdd from './question-add';
import QuestionItem from './question-item';
import QuestionsColumnToolBar from './question-column-tool-bar';
import AddQuestionProductDialog from '../edit/add-question-product-dialog';


const QuestionsNewEditList = () => {

  const mdUp = useResponsive('up', 'md');

  const openAddQuestion = useBoolean();

  const openSearchQuestion = useBoolean();

  const dragStarted = useBoolean();

  const openProductDialog = useBoolean()

  const questionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const [selectedItem, setSelectedItem] = useState<number | null>(null);

  const { control, watch, formState: { errors } } = useFormContext<IReport>();

  const { fields: questions, prepend, remove, move, update } = useFieldArray({
    control,
    name: "questions",
  });

  const reportName = watch("title");

  const campaignId = watch("campaign_id");

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

  const addQuestion = (newQuestion: IReportQuestion) => {
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


  const handleAddValidation = useCallback((questionIndex: number, newValidation: Partial<IReportQuestionValidation>) => {
    const question = questions[questionIndex];
    const updatedValidation = { ...question.validation, ...newValidation };
    update(questionIndex, { ...question, validation: updatedValidation });
  }, [questions, update]);

  // Add other dependencies as needed

  const handleChangeQuestionRequired = useCallback((questionIndex: number) => {
    const question = questions[questionIndex];
    const valid = question.validation ?? {}
    update(questionIndex, { ...question, validation: { ...valid, required: !question.validation?.required } });
  }, [questions, update]);


  const handleChangeQuestionUnique = useCallback((questionIndex: number) => {
    const question = questions[questionIndex];
    update(questionIndex, { ...question, unique: !question.unique });
  }, [questions, update]);

  const handleChangeInputType = useCallback((questionIndex: number, newInputType: ActualInputType) => {
    const question = questions[questionIndex];
    update(questionIndex, { ...question, input_type: newInputType });
  }, [questions, update]);

  const handleChangeQuestionText = useCallback((questionIndex: number, text: string) => {
    const question = questions[questionIndex];
    update(questionIndex, { ...question, text });
  }, [questions, update]);

  const handleChangeQuestionMaxValue = useCallback((questionIndex: number, val: number) => {
    if (!Number.isNaN(numericVal)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      update(questionIndex, { ...question, validation: { ...valid, maxValue: numericVal } });
    }
  }, [questions, update]);

  const handleChangeQuestionMinValue = useCallback((questionIndex: number, val: number) => {
    if (!Number.isNaN(numericVal)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      update(questionIndex, { ...question, validation: { ...valid, minValue: numericVal } });
    }
  }, [questions, update]);

  const handleChangeQuestionRegexMatches = useCallback((questionIndex: number, val: string) => {
    if (!(val)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      console.log(val, "VALUE")
      update(questionIndex, { ...question, validation: { ...valid, regex: { ...valid.regex, matches: val } } });
    }
  }, [questions, update]);

  const handleChangeQuestionRegexMessage = useCallback((questionIndex: number, val: string) => {
    if (!(val)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      update(questionIndex, { ...question, validation: { ...valid, regex: { ...valid.regex, message: val } } });
    }
  }, [questions, update]);


  const handleChangeQuestionMaxLength = useCallback((questionIndex: number, val: number) => {
    if (!Number.isNaN(numericVal)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      update(questionIndex, { ...question, validation: { ...valid, maxLength: numericVal } });
    }
  }, [questions, update]);

  const handleChangeQuestionMinLength = useCallback((questionIndex: number, val: number) => {
    if (!Number.isNaN(numericVal)) { // Ensure conversion was successful
      const question = questions[questionIndex];
      const valid = question.validation ?? {};
      update(questionIndex, { ...question, validation: { ...valid, minLength: numericVal } });
    }
  }, [questions, update]);

  const handleChangeAddQuestionProducts = useCallback((questionIndex: number, products: string[]) => {
    if (Array.isArray(products)) { // Ensure conversion was successful
      const question = questions[questionIndex];

      const options = Array.isArray(question.options) ? Array.from(new Set([...question.options, ...products])) : [...products]

      update(questionIndex, { ...question, input_type: "select", options });
    }
  }, [questions, update]);


  const handleAddDependency = useCallback((questionIndex: number, newDependency: IQuestionDependency) => {
    const question = questions[questionIndex];
    const updatedDependencies = question.dependencies ? [...question.dependencies, newDependency] : [newDependency];
    update(questionIndex, { ...question, dependencies: updatedDependencies });
  }, [questions, update]);

  const handleRemoveQuestion = useCallback((index: number) => {
    remove(index);
  }, [remove]);

  const handleRemoveValidation = useCallback((questionIndex: number, validationKey: keyof IReportQuestionValidation) => {
    const question = questions[questionIndex];
    const updatedValidation = { ...question.validation, [validationKey]: undefined };
    update(questionIndex, { ...question, validation: updatedValidation });
  }, [questions, update]);


  useEffect(() => {
    // Adjust the refs array to match the number of questions, initializing with null
    questionRefs.current = questions.map((_, i) => questionRefs.current[i] || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions.length]);

  const scrollToQuestion = useCallback((index: number) => {
    const ref = questionRefs.current[index];
    if (ref) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, []);


  // Then you can group these into an actions object if you like, or pass them directly as props.

  const actions: IReportQuestionActions = {
    handleAddDependency,
    handleAddValidation,
    handleChangeQuestionText,
    handleChangeInputType,
    handleRemoveQuestion,
    handleChangeQuestionMaxValue,
    handleChangeQuestionMinValue,
    handleChangeQuestionMaxLength,
    handleChangeQuestionRegexMatches,
    handleChangeQuestionRegexMessage,
    handleChangeQuestionMinLength,
    handleChangeQuestionRequired,
    handleChangeQuestionUnique,
    handleChangeAddQuestionProducts,
    handleRemoveValidation
  }


  const handleNewAddNewProduct = (prds: string[]) => {
    actions.handleChangeAddQuestionProducts(selectedItem, prds)
  }

  const handleOpenAddProduct = (index) => {
    const q = questions[index]
    if (q) {
      setSelectedItem(index)
      openProductDialog.onTrue();
    }
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
          handleClick={scrollToQuestion}
          openSearch={openSearchQuestion.value}
          openAddQuestion={openAddQuestion.onTrue}
          questions={questions}
          openSearchQuestion={openSearchQuestion.onToggle}
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
                    // eslint-disable-next-line
                    ref={(el: HTMLDivElement | null) => { const t = questionRefs.current[index] = el; return t; }}
                    key={q._id.toString()}
                    campaignId={campaignId}
                    index={index}
                    actions={actions}
                    question={q}
                    questionError={errors.questions?.[index]} // Pass the corresponding error
                    handleOpenAddProduct={handleOpenAddProduct}
                    onUpdateQuestion={(qs: IReportQuestion) => console.log(qs)}
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

      {campaignId && !isEmpty(campaignId) && !Number.isNaN(selectedItem) &&
        <AddQuestionProductDialog
          campaignId={campaignId}
          questionIndex={selectedItem}
          handleAddNewProduct={handleNewAddNewProduct}
          open={openProductDialog.value}
          onClose={openProductDialog.onFalse}
        />}

    </Grid>
  );
}

export default  memo(QuestionsNewEditList);

