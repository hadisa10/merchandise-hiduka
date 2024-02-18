
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import { useBoolean } from 'src/hooks/use-boolean';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

// ----------------------------------------------------------------------

type Props = {
  openAddQuestion: VoidFunction;
  reportName: string;
  onClearQuestions: VoidFunction;
};

export default function QuestionsColumnToolBar({
  openAddQuestion,
  reportName,
  onClearQuestions,
}: Props) {

  const confirmDialog = useBoolean();

  return (
    <>
      <Stack
        spacing={1}
        position="sticky"
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ pt: 3, px: 2 }}
      >
        <Typography>
          {reportName} Questions
        </Typography>

        <Stack direction="row" spacing={1}>
          <IconButton color="success" onClick={openAddQuestion}>
            <Iconify icon="mingcute:add-line" />
          </IconButton>
          <IconButton color="error" onClick={confirmDialog.onTrue} >
            <Iconify icon="solar:eraser-bold" />
          </IconButton>
        </Stack>
      </Stack>

      <ConfirmDialog
        open={confirmDialog.value}
        onClose={confirmDialog.onFalse}
        title="Clear"
        content={
          <>
            Are you sure want to clear all questions?
            <Box sx={{ typography: 'caption', color: 'error.main', mt: 2 }}>
              <strong> NOTE: </strong> This action is irreversible
            </Box>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onClearQuestions();
              confirmDialog.onFalse();
            }}
          >
            Clear
          </Button>
        }
      />
    </>
  );
}
