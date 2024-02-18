import { useFieldArray, useFormContext } from 'react-hook-form';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
// import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button, List, Paper, Stack, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { IReport, IReportQuestions } from 'src/types/realm/realm-types';

import QuestionItem from './question-item';
import Iconify from 'src/components/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import QuestionAdd from './question/question-add';
import QuestionsColumnToolBar from './question/question-column-tool-bar';
import { isString } from 'lodash';

const QuestionsNewEditList: React.FC = () => {

  const mdUp = useResponsive('up', 'md');

  const openAddQuestion = useBoolean();

  const { control, watch } = useFormContext<IReport>(); // TypeScript assertion

  const { fields: questions, prepend, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  const reportName = watch("title");

  // const [reports, setReports] = useState<string[]>([]);
  // const [newReport, setNewReport] = useState<string>('');

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // Do nothing if the item is dropped outside the list or dropped into the same place
    if (!destination || (source.index === destination.index)) {
      return;
    }

    // Use the `move` method to reorder the questions
    move(source.index, destination.index);
  }, [move]);

  const addQuestion = (newQuestion: IReportQuestions) => {
    if (!isString(newQuestion.text)) return;
    if (!newQuestion.text.trim()) return;
    prepend(newQuestion)
  };




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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reports">
            {(provided) => (
              <List ref={provided.innerRef} sx={{ maxHeight: "60vh", overflowY: "auto" }} {...provided.droppableProps}>
                {(Array.isArray(questions)) && questions.map((question, index) => (
                  <QuestionItem
                    key={question._id.toString()}
                    index={index}
                    question={question}
                    onUpdateQuestion={(question) => console.log(question)}
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

