import { Suspense, forwardRef } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { UseFormRegister } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ListItem, IconButton } from '@mui/material';
import Paper, { PaperProps } from '@mui/material/Paper';

import { useBoolean } from 'src/hooks/use-boolean';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { IReport, IReportQuestion } from 'src/types/realm/realm-types';
import { QuestionError, IReportQuestionActions } from 'src/types/report';

import QuestionItemDetails from './question-item-details';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: number;
  question: IReportQuestion;
  onUpdateQuestion: (question: IReportQuestion) => void;
  handleOpenAddProduct: (index: number) => void;
  onDeleteQuestion: VoidFunction;
  questionError?: QuestionError;
  register: UseFormRegister<IReport>;
  actions: IReportQuestionActions;
  campaignId?: string;
};

const QuestionItem = forwardRef<HTMLDivElement, Props>(({
  question,
  index,
  onDeleteQuestion,
  onUpdateQuestion,
  handleOpenAddProduct,
  questionError,
  register,
  campaignId,
  actions,
  sx,
  ...other
}, ref) => {
  const theme = useTheme();

  const openDetails = useBoolean();


  const handleToggleUnique = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation(); // Prevent click event from bubbling up
    // Your toggle logic here
  }

  const renderInputType = (
    <Iconify
      icon={
        (question.input_type === 'text' && 'ic:baseline-text-fields') ||
        (question.input_type === 'number' && 'ic:baseline-numeric') ||
        (question.input_type === 'select' && 'ic:baseline-arrow-drop-down-circle') ||
        (question.input_type === 'radio' && 'ic:baseline-radio-button-checked') ||
        (question.input_type === 'checkbox' && 'ic:baseline-check-box') ||
        (question.input_type === 'date' && 'ic:baseline-event') ||
        (question.input_type === 'email' && 'ic:baseline-email') ||
        (question.input_type === 'file' && 'ic:baseline-attach-file') ||
        (question.input_type === 'password' && 'ic:baseline-password') ||
        (question.input_type === 'range' && 'ic:baseline-tune') ||
        (question.input_type === 'url' && 'ic:baseline-link') ||
        'ic:baseline-help-outline' // Default icon if no match
      }
      sx={{
        position: 'absolute',
        top: 4,
        right: 4,
        color: (() => {
          switch (question.input_type) {
            case 'text':
            case 'number':
            case 'select':
            case 'radio':
            case 'checkbox':
            case 'date':
            case 'email':
            case 'file':
            case 'password':
            case 'range':
            case 'url':
              return 'primary.main'; // Change color based on input type if needed
            default:
              return 'action.active';
          }
        })()
      }}
    />
  );



  const renderInfo = (
    <Stack direction="row" alignItems="center" sx={{ typography: 'caption', color: 'text.secondary', ml: -1 }}>
      <IconButton
        onClick={handleToggleUnique}
        sx={{
          color: question.unique ? 'success.main' : 'inherit',
        }}
      >
        <Iconify icon={question.unique ? "akar-icons:circle-check-fill" : "akar-icons:circle-x-fill"} />
      </IconButton>
      <Box component="span">
        {`Unique: ${question.unique}`}
      </Box>
    </Stack>
  );


  const renderAddProducts = (
    <Stack direction="row" alignItems="center" sx={{ typography: 'caption', color: 'text.secondary', ml: -1 }}>
      <IconButton
        onClick={(e) => {
          e.stopPropagation()
          handleOpenAddProduct(index)
        }}
        sx={{
          color: 'inherit',
        }}
      >
        <Iconify icon="mingcute:add-line" />
      </IconButton>
      <Box component="span">
        Products
      </Box>
    </Stack>
  );


  return (

    <Suspense key={index} fallback={<LoadingScreen />}>
      <Draggable draggableId={question._id.toString()} index={index}>
        {(provided, snapshot) => (
          <ListItem
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={openDetails.onTrue}

          >
            <Paper
              ref={ref}
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

                {renderInputType}

                <Typography variant="subtitle2">{question.text}</Typography>
                <Stack direction="row" justifyContent="space-between">
                  {renderInfo}
                  {renderAddProducts}
                </Stack>


              </Stack>
            </Paper>
          </ListItem>
        )}
      </Draggable>

      <QuestionItemDetails
        question={question}
        index={index}
        questionError={questionError}
        register={register}
        actions={actions}
        openDetails={openDetails.value}
        onCloseDetails={openDetails.onFalse}
        // onUpdateQuestion={onUpdateQuestion}
        onDeleteQuestion={onDeleteQuestion}
      />

    </Suspense>
  );
})

export default QuestionItem;