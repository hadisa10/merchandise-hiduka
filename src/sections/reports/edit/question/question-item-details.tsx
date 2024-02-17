import { useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';

import { useBoolean } from 'src/hooks/use-boolean';

import Scrollbar from 'src/components/scrollbar';

import { IReportQuestions } from 'src/types/realm/realm-types';

import QuestionInputName from './question-input-name';
import QuestionDetailsToolbar from './question-details-toolbar';


// ----------------------------------------------------------------------

type Props = {
  question: IReportQuestions;
  openDetails: boolean;
  onCloseDetails: VoidFunction;
  //
  onUpdateQuestion: (onUpdateQuestion: IReportQuestions) => void;
  onDeleteQuestion: VoidFunction;
};

export default function QuestionDetails({
  question,
  openDetails,
  onCloseDetails,
  //
  onUpdateQuestion,
  onDeleteQuestion,
}: Props) {

  const [questionText, setQuestionText] = useState(question.text);

  const like = useBoolean();

  const contacts = useBoolean();

  // const [taskDescription, setTaskDescription] = useState(task.description);

  // const rangePicker = useDateRangePicker(task.due[0], task.due[1]);

  const handleChangeQuestionName = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuestionText(event.target.value);
  }, []);

  const handleUpdateTask = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      try {
        if (event.key === 'Enter') {
          if (questionText) {
            onUpdateQuestion({
              ...question,
              text: questionText,
            });
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [onUpdateQuestion, question, questionText]
  );

  const renderHead = (
    <QuestionDetailsToolbar
      liked={like.value}
      questionName={question.text}
      onLike={like.onToggle}
      onDelete={onDeleteQuestion}
      questionStatus=""
      onCloseDetails={onCloseDetails}
    />
  );

  const renderName = (
    <QuestionInputName
      placeholder="Question"
      value={questionText}
      onChange={handleChangeQuestionName}
      onKeyUp={handleUpdateTask}
    />
  );

  // const renderReporter = (
  //   <Stack direction="row" alignItems="center">
  //     <StyledLabel>Reporter</StyledLabel>
  //     <Avatar alt={task.reporter.name} src={task.reporter.avatarUrl} />
  //   </Stack>
  // );

  // const renderAssignee = (
  //   <Stack direction="row">
  //     <StyledLabel sx={{ height: 40, lineHeight: '40px' }}>Assignee</StyledLabel>

  //     <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
  //       {task.assignee.map((user) => (
  //         <Avatar key={user.id} alt={user.name} src={user.avatarUrl} />
  //       ))}

  //       <Tooltip title="Add assignee">
  //         <IconButton
  //           onClick={contacts.onTrue}
  //           sx={{
  //             bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
  //             border: (theme) => `dashed 1px ${theme.palette.divider}`,
  //           }}
  //         >
  //           <Iconify icon="mingcute:add-line" />
  //         </IconButton>
  //       </Tooltip>

  //       <KanbanContactsDialog
  //         assignee={task.assignee}
  //         open={contacts.value}
  //         onClose={contacts.onFalse}
  //       />
  //     </Stack>
  //   </Stack>
  // );

  // const renderLabel = (
  //   <Stack direction="row">
  //     <StyledLabel sx={{ height: 24, lineHeight: '24px' }}>Labels</StyledLabel>

  //     {!!task.labels.length && (
  //       <Stack direction="row" flexWrap="wrap" alignItems="center" spacing={1}>
  //         {task.labels.map((label) => (
  //           <Chip key={label} color="info" label={label} size="small" variant="soft" />
  //         ))}
  //       </Stack>
  //     )}
  //   </Stack>
  // );

  // const renderDueDate = (
  //   <Stack direction="row" alignItems="center">
  //     <StyledLabel> Due date </StyledLabel>

  //     {rangePicker.selected ? (
  //       <Button size="small" onClick={rangePicker.onOpen}>
  //         {rangePicker.shortLabel}
  //       </Button>
  //     ) : (
  //       <Tooltip title="Add due date">
  //         <IconButton
  //           onClick={rangePicker.onOpen}
  //           sx={{
  //             bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
  //             border: (theme) => `dashed 1px ${theme.palette.divider}`,
  //           }}
  //         >
  //           <Iconify icon="mingcute:add-line" />
  //         </IconButton>
  //       </Tooltip>
  //     )}

  //     <CustomDateRangePicker
  //       variant="calendar"
  //       title="Choose due date"
  //       startDate={rangePicker.startDate}
  //       endDate={rangePicker.endDate}
  //       onChangeStartDate={rangePicker.onChangeStartDate}
  //       onChangeEndDate={rangePicker.onChangeEndDate}
  //       open={rangePicker.open}
  //       onClose={rangePicker.onClose}
  //       selected={rangePicker.selected}
  //       error={rangePicker.error}
  //     />
  //   </Stack>
  // );

  // const renderPriority = (
  //   <Stack direction="row" alignItems="center">
  //     <StyledLabel>Priority</StyledLabel>

  //     <KanbanDetailsPriority priority={priority} onChangePriority={handleChangePriority} />
  //   </Stack>
  // );

  // const renderDescription = (
  //   <Stack direction="row">
  //     <StyledLabel> Description </StyledLabel>

  //     <TextField
  //       fullWidth
  //       multiline
  //       size="small"
  //       value={taskDescription}
  //       onChange={handleChangeTaskDescription}
  //       InputProps={{
  //         sx: { typography: 'body2' },
  //       }}
  //     />
  //   </Stack>
  // );

  // const renderAttachments = (
  //   <Stack direction="row">
  //     <StyledLabel>Attachments</StyledLabel>
  //     <KanbanDetailsAttachments attachments={task.attachments} />
  //   </Stack>
  // );

  // const renderComments = <KanbanDetailsCommentList comments={task.comments} />;

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

          {/* {renderReporter}

          {renderAssignee}

          {renderLabel}

          {renderDueDate}

          {renderPriority}

          {renderDescription}

          {renderAttachments} */}
        </Stack>

        {/* {!!task.comments.length && renderComments} */}
      </Scrollbar>

      {/* <KanbanDetailsCommentInput /> */}
    </Drawer>
  );
}
