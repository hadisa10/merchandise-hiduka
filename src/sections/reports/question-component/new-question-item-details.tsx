// // Import necessary types
// import React, { Suspense } from 'react';
// import { Drawer, Divider, Stack } from '@mui/material';
// import { UseFormRegister } from 'react-hook-form';
// import { LoadingScreen } from 'src/components/loading-screen';
// import { QuestionInput, QuestionSelect } from './QuestionSubcomponents';
// import useQuestionDetails from './useQuestionDetails';
// import { IQuestion, IActions } from 'src/types'; // Placeholder types, replace with actual import paths
// import QuestionDetailsToolbar from './question-details-toolbar';
// import Scrollbar from 'src/components/scrollbar';
// import { IReportQuestion } from 'src/types/realm/realm-types';

// // Styled component remains unchanged
// const StyledLabel = styled('span')(({ theme }) => ({
//   ...theme.typography.caption,
//   width: 100,
//   flexShrink: 0,
//   color: theme.palette.text.secondary,
//   fontWeight: theme.typography.fontWeightSemiBold,
// }));

// // Define TypeScript interface for props
// interface QuestionDetailsProps {
//   question: IReportQuestion;
//   openDetails: boolean;
//   onCloseDetails: () => void;
//   actions: IActions;
//   index: number;
//   register: UseFormRegister<any>; // Specify the actual type instead of any if possible
//   onDeleteQuestion: () => void;
// }

// const QuestionDetails: React.FC<QuestionDetailsProps> = ({
//   question,
//   openDetails,
//   onCloseDetails,
//   actions,
//   index,
//   register,
//   onDeleteQuestion,
// }) => {
//   const {
//     questionText,
//     handleTextChange,
//     handleTextUpdate,
//     validationStates,
//     handleValidationChange,
//     handleValidationUpdate,
//     detailComponents,
//     validationComponents,
//   } = useQuestionDetails(question, actions, index); // Custom hook to manage states and handlers

//   return (
//     <Drawer open={openDetails} onClose={onCloseDetails} anchor="right" PaperProps={{ sx: { width: { xs: 1, sm: 480 } } }}>
//       <QuestionDetailsToolbar onDelete={onDeleteQuestion} onCloseDetails={onCloseDetails} questionName={question.text} />
//       <Divider />
//       <Scrollbar
//         sx={{
//           height: 1,
//           '& .simplebar-content': { height: 1, display: 'flex', flexDirection: 'column' },
//         }}
//       >
//         <Suspense fallback={<LoadingScreen />}>
//           <Stack spacing={3} sx={{ pt: 3, pb: 5, px: 2.5 }}>
//             <QuestionInput
//               label="Question"
//               value={questionText}
//               onChange={handleTextChange}
//               onUpdate={handleTextUpdate}
//               register={register}
//               name={`questions.${index}.text`}
//               error={validationStates.textError}
//               helperText={validationStates.textHelperText}
//             />

//             {detailComponents.map((Component, i) => <Component key={i} />)}

//             {validationComponents.map((Component, i) => <Component key={i} onChange={handleValidationChange} onUpdate={handleValidationUpdate} />)}
//           </Stack>
//         </Suspense>
//       </Scrollbar>
//     </Drawer>
//   );
// };