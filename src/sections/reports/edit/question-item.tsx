import { Draggable } from '@hello-pangea/dnd';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ListItem } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Paper, { PaperProps } from '@mui/material/Paper';
import AvatarGroup, { avatarGroupClasses } from '@mui/material/AvatarGroup';

import { useBoolean } from 'src/hooks/use-boolean';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { IReportQuestions } from 'src/types/realm/realm-types';

import QuestionDetails from './question/question-item-details';

// import KanbanDetails from './kanban-details';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: number;
  question: IReportQuestions;
  onUpdateQuestion: (question: IReportQuestions) => void;
  onDeleteQuestion: VoidFunction;
};

export default function QuestionItem({
  question,
  index,
  onDeleteQuestion,
  onUpdateQuestion,
  sx,
  ...other
}: Props) {
  const theme = useTheme();

  const openDetails = useBoolean();

  const renderPriority = (
    <Iconify
      icon={
        (question.validation?.required && 'solar:double-alt-arrow-down-bold-duotone') ||
        (!question.validation?.required && 'solar:double-alt-arrow-right-bold-duotone') ||
        'solar:double-alt-arrow-up-bold-duotone'
      }
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        ...(question.validation?.required && {
          color: 'error.main',
        }),
        ...(isNaN(question.order) && {
          color: 'info.main',
        })

      }}
    />
  );

  const renderImg = (
    <Box
      sx={{
        p: theme.spacing(1, 1, 0, 1),
      }}
    >
      <Box
        component="img"
        alt={question.text}
        src={question.text}
        sx={{
          borderRadius: 1.5,
          ...(openDetails.value && {
            opacity: 0.8,
          }),
        }}
      />
    </Box>
  );

  const renderInfo = (
    <Stack direction="row" alignItems="center">
      <Stack
        flexGrow={1}
        direction="row"
        alignItems="center"
        sx={{
          typography: 'caption',
          color: 'text.disabled',
        }}
      >
        <Iconify width={16} icon="solar:chat-round-dots-bold" sx={{ mr: 0.25 }} />
        <Box component="span" sx={{ mr: 1 }}>
          {question.validation?.maxLength ?? 0}
        </Box>

        <Iconify width={16} icon="eva:attach-2-fill" sx={{ mr: 0.25 }} />
        <Box component="span">{question.validation?.maxLength ?? 0}</Box>
      </Stack>

      <AvatarGroup
        sx={{
          [`& .${avatarGroupClasses.avatar}`]: {
            width: 24,
            height: 24,
          },
        }}
      >
        {/* {question.t.map((user) => ( */}
        <Avatar key="T" alt="T" src="T" />
        {/* ))} */}
      </AvatarGroup>
    </Stack>
  );

  return (
    <>
      <Draggable draggableId={question._id.toString()} index={index}>
        {(provided, snapshot) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={openDetails.onTrue}
          >
            <Paper
              sx={{
                width: 1,
                borderRadius: 1.5,
                overflow: 'hidden',
                position: 'relative',
                bgcolor: 'background.default',
                boxShadow: theme.customShadows.z1,
                '&:hover': {
                  boxShadow: theme.customShadows.z20,
                },
                ...(openDetails.value && {
                  boxShadow: theme.customShadows.z20,
                }),
                ...(snapshot.isDragging && {
                  boxShadow: theme.customShadows.z20,
                  ...bgBlur({
                    opacity: 0.48,
                    color: theme.palette.background.default,
                  }),
                }),
                ...sx,
              }}
              {...other}
            >
              {/* {!!question..length && renderImg} */}

              <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                {renderPriority}

                <Typography variant="subtitle2">{question.text}</Typography>

                {renderInfo}
              </Stack>
            </Paper>
          </ListItem>
        )}
      </Draggable>

      <QuestionDetails
        question={question}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        onUpdateQuestion={onUpdateQuestion}
        onDeleteQuestion={onDeleteQuestion}
      />
    </>
  );
}
