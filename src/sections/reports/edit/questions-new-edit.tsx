import { useFieldArray, useFormContext } from 'react-hook-form';
import { Droppable, DropResult, DragDropContext } from '@hello-pangea/dnd';
import React, { useState, useEffect, useCallback, ChangeEvent, KeyboardEvent } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import { List, Paper, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { IReportQuestions } from 'src/types/realm/realm-types';

import QuestionItem from './question-item';

const QuestionsNewEditList: React.FC = () => {

  const mdUp = useResponsive('up', 'md');

  const { control } = useFormContext<{ questions: IReportQuestions[] }>(); // TypeScript assertion

  const { fields: questions, append, remove, move } = useFieldArray({
    control,
    name: "questions",
  });

  useEffect(() => {
    console.log(questions, 'QUESTIONS')
  }, [questions])

  const [reports, setReports] = useState<string[]>([]);
  const [newReport, setNewReport] = useState<string>('');

  const onDragEnd = useCallback((result: DropResult) => {
    const { source, destination } = result;

    // Do nothing if the item is dropped outside the list or dropped into the same place
    if (!destination || (source.index === destination.index)) {
      return;
    }

    // Use the `move` method to reorder the questions
    move(source.index, destination.index);
  }, [move]);

  const addReport = () => {
    if (!newReport.trim()) return;
    setReports((prevReports) => [...prevReports, newReport]);
    setNewReport('');
  };

  const handleNewReportChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewReport(event.target.value);
  };

  const handleNewReportKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') addReport();
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
  const renderQuestions = (
    <Grid xs={12} md={8}>
      <Paper
        sx={{
          p: mdUp ? 0.5 : 0.1,
          borderRadius: 2,
          bgcolor: 'background.neutral',
          maxHeight: "60vh",
          overflowY: "auto"
        }}
      >
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="reports">
            {(provided) => (
              <List ref={provided.innerRef} {...provided.droppableProps}>
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

