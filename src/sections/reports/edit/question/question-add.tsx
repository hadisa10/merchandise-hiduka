import { useMemo, useState, useCallback } from 'react';

import Paper from '@mui/material/Paper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';

import uuidv4 from 'src/utils/uuidv4';

import { _mock } from 'src/_mock';

import { IKanbanTask } from 'src/types/kanban';
import { IReportQuestions } from 'src/types/realm/realm-types';
import { createObjectId } from 'src/utils/realm';
import { IconButton } from '@mui/material';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

type Props = {
  onCloseQuestion: VoidFunction;
  onAddQuestion: (question: IReportQuestions) => void;
};

export default function QuestionAdd({ onAddQuestion, onCloseQuestion }: Props) {
  const [text, setText] = useState('');

  const defaultQuestion: IReportQuestions = useMemo(
    () => ({
      _id: createObjectId(),
      text,
      order: 1,
      input_type: "text",
      options: [],
      unique: false,
      updatedAt: new Date(),
    }),
    [text, createObjectId]
  );

  // const handleKeyUpAddQuestion = useCallback(
  //   (event: React.KeyboardEvent<HTMLInputElement>) => {
  //     if (event.key === 'Enter') {
  //       if (text) {
  //         onAddQuestion(defaultQuestion);
  //       }
  //     }
  //   },
  //   [defaultQuestion, text, onAddQuestion]
  // );

  const handleClickAddQuestion = useCallback(() => {
    if (text) {
      onAddQuestion(defaultQuestion);
      setText("")
      onCloseQuestion();
    } else {
      onCloseQuestion();
    }
  }, [defaultQuestion, text, onAddQuestion, onCloseQuestion]);

  const handleChangeText = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  }, []);

  return (
    <ClickAwayListener onClickAway={handleClickAddQuestion}>
      <Paper
        sx={{
          borderRadius: 1.5,
          bgcolor: 'background.default',
          boxShadow: (theme) => theme.customShadows.z1,
        }}
      >
        <InputBase
          autoFocus
          multiline
          fullWidth
          placeholder="Enter New Question... "
          value={text}
          onChange={handleChangeText}
          // onKeyUp={handleKeyUpAddQuestion}
          endAdornment={
            <IconButton color="success" onClick={handleClickAddQuestion}>
              <Iconify icon="mingcute:add-line" />
            </IconButton>
          }
          sx={{
            px: 2,
            height: 56,
            [`& .${inputBaseClasses.input}`]: {
              typography: 'subtitle2',
            },
          }}
        />
      </Paper>
    </ClickAwayListener>
  );
}
