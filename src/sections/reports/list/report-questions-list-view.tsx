// ReportList.tsx
import React, { useCallback, useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { List, ListItem, ListItemText } from '@mui/material';

interface ReportListProps {
  id: string;
}

const AdminReportQuestionList: React.FC<ReportListProps> = ({ id }) => {


  const [reports, setReports] = useState<string[]>(["Annual Report 2024", "Q1 Sales Analysis"]);

  const onAddReport = (newReport: string) => {
    setReports([...reports, newReport]);
  };

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items = Array.from(reports);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setReports(items);
  }, [reports]);
  
  return (
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
  );
};

export default AdminReportQuestionList;
