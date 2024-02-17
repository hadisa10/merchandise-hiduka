import React, { useState, useCallback, ChangeEvent, KeyboardEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Button, TextField, List, ListItem, ListItemText, Container } from '@mui/material';

const ReportList: React.FC = () => {
  const [reports, setReports] = useState<string[]>([]);
  const [newReport, setNewReport] = useState<string>('');

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(reports);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReports(items);
  }, [reports]);

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

  return (
    <Container>
      <TextField
        label="New Report"
        variant="outlined"
        value={newReport}
        onChange={handleNewReportChange}
        onKeyDown={handleNewReportKeyDown}
        fullWidth
        margin="normal"
      />
      <Button onClick={addReport} variant="contained" color="primary">
        Add Report
      </Button>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="reports">
          {(provided) => (
            <List ref={provided.innerRef} {...provided.droppableProps}>
              {reports.map((report, index) => (
                <Draggable key={report} draggableId={report} index={index}>
                  {(provided) => (
                    <ListItem
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <ListItemText primary={report} />
                    </ListItem>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </List>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
}

export default ReportList;
