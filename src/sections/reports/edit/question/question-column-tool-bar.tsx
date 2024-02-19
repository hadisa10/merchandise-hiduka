// @ts-nocheck
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useMemo, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { TextField, Typography, Autocomplete, InputAdornment, autocompleteClasses } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import SearchNotFound from 'src/components/search-not-found';

import { IReportQuestions } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = {
  openAddQuestion: VoidFunction;
  questions: IReportQuestions[]
  reportName: string;
  openSearchQuestion: VoidFunction;
  openSearch: boolean;
  onClearQuestions: VoidFunction;
  handleClick: (n: number) => void;
};

export default function QuestionsColumnToolBar({
  openAddQuestion,
  reportName,
  openSearch,
  questions,
  onClearQuestions,
  openSearchQuestion,
  handleClick
}: Props) {

  const confirmDialog = useBoolean();

  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebounce(searchValue);


  const handleChangeSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, [])


  // eslint-disable-next-line
  const results = useMemo(() => questions.filter(q => q.text.toLowerCase().includes(debouncedSearch)), [debouncedSearch])

  const onClickhandler = (n: number) => {
    handleClick(n)
    setSearchValue("")
  }

  const renderSearch = (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      // loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => handleChangeSearchValue(newValue)}
      getOptionLabel={(option) => option.text}
      noOptionsText={<SearchNotFound query={searchValue} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, question, { inputValue }) => {
        const matches = match(question.text, inputValue);
        const parts = parse(question.text, matches);

        return (
          <Box component="li" {...props} onClick={() => onClickhandler(question.order)} key={question.order}>

            <div key={inputValue}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </div>
          </Box>
        );
      }}
    />
  )

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
        {
          openSearch ?
            // renderFilterQuestion
            renderSearch
            :
            <Typography>
              {reportName} Questions
            </Typography>

        }

        <Stack direction="row" spacing={1}>
          <IconButton color="success" onClick={openSearchQuestion}>
            <Iconify icon="eva:search-fill" />
          </IconButton>
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
