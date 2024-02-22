// @ts-nocheck
import { isEmpty } from 'lodash';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import { TextField, Typography, Autocomplete, InputAdornment, autocompleteClasses } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useRealmRoutes } from 'src/hooks/realm/route/use-route-graphql';

import Iconify from 'src/components/iconify';
import SearchNotFound from 'src/components/search-not-found';

import { IRoute } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = {
    // openSearchQuestion: VoidFunction;
    // openSearch: boolean;
    // onClearQuestions: VoidFunction;
    handleClick: (route: IRoute) => void;
};

export default function CampaignSearchRoute({
    handleClick
}: Props) {


    const [searchValue, setSearchValue] = useState('');

    const [results, setResults] = useState<IRoute[]>([]);

    const loading = useBoolean();

    const debouncedSearch = useDebounce(searchValue, 1000);

    const handleChangeSearchValue = useCallback((value: string) => {
        setSearchValue(value);
    }, [])

    const { searchRoute } = useRealmRoutes();

    useEffect(() => {
        if (!isEmpty(debouncedSearch)) {
            loading.onTrue();
            searchRoute(debouncedSearch).
                then(res => {
                    setResults(res)
                })
                .catch(e => console.error(e, 'SEARCH RESULT ERROR'))
                .finally(() => {
                    loading.onFalse();
                })
        } else {
            setResults([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedSearch])



    const onClickhandler = (route: IRoute) => {
        handleClick(route)
        setSearchValue("")
    }

    const handleSelectRoute = useCallback(
        (event: React.KeyboardEvent<HTMLInputElement>) => {
            try {
                if (event.key === 'Enter') {
                    const selectItem = results[0];
                    onClickhandler(selectItem);
                }
            } catch (error) {
                console.error(error);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const renderSearch = (
        <Autocomplete
            sx={{ width: { xs: 1, sm: 260 } }}
            loading={loading.value}
            autoHighlight
            popupIcon={null}
            options={results}
            size='small'
            onInputChange={(event, newValue) => handleChangeSearchValue(newValue)}
            getOptionLabel={(option) => option.fullAddress}
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
            renderOption={(props, route, { inputValue }) => {
                const matches = match(route.fullAddress, inputValue);
                const parts = parse(route.fullAddress, matches);

                return (
                    <Box component="li" {...props} onClick={() => onClickhandler(route)} key={route._id}>

                        <div key={inputValue}>
                            {parts.map((part, index) => (
                                <Typography
                                    key={index}
                                    component="span"
                                    onKeyUp={handleSelectRoute}
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
            {renderSearch}
        </>
    );
}
