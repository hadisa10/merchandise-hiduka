// 'use client';

// import { useState, useCallback } from 'react';

// import { Tab, Tabs } from '@mui/material';
// import Container from '@mui/material/Container';
// import Typography from '@mui/material/Typography';

// import { useSettingsContext } from 'src/components/settings';
// import AnalyticsComingSoon from './campaign/coming-soon';

// // ----------------------------------------------------------------------

// export const ANALYTICS_OVERVIEW_DETAILS_TABS = [
//   { value: 'active', label: 'Daily Active Users' },
//   { value: 'task', label: 'Task Completion Rate' },
//   { value: 'engagement', label: 'User Engagement Score' },
// ];

// // ----------------------------------------------------------------------

// export default function UserPerformanceAnalyticsView() {
//   const settings = useSettingsContext();

//   const [currentTab, setCurrentTab] = useState('active');

//   const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
//     setCurrentTab(newValue);
//   }, []);


//   const renderTabs = (
//     <Tabs
//       value={currentTab}
//       onChange={handleChangeTab}
//       sx={{
//         mb: { xs: 3, md: 5 },
//       }}
//     >
//       {ANALYTICS_OVERVIEW_DETAILS_TABS.map((tab) => (
//         <Tab
//           key={tab.value}
//           iconPosition="end"
//           value={tab.value}
//           label={tab.label}
//         />
//       ))}
//     </Tabs>
//   );
//   return (
//     <Container maxWidth={settings.themeStretch ? false : 'xl'}>
//       <Typography
//         variant="h4"
//         sx={{
//           mb: { xs: 3, md: 5 },
//         }}
//       >
//         Hi, Welcome back 👋
//       </Typography>


//       {renderTabs}
//       {currentTab === "active" && <AnalyticsComingSoon />}
//       {currentTab === "task" && <AnalyticsComingSoon />}
//       {currentTab === "engagement" && <AnalyticsComingSoon />}

//     </Container>
//   );
// }

'use client';

import { enqueueSnackbar } from 'notistack';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Tab, Tabs, Stack, TextField, IconButton, Autocomplete, InputAdornment, autocompleteClasses } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useReports } from 'src/hooks/realm/report/use-report-graphql';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import SearchNotFound from 'src/components/search-not-found';
import { LoadingScreen } from 'src/components/loading-screen';

import { IReport, ICampaign } from 'src/types/realm/realm-types';

import CampaignCostView from './campaign/demo-campaign-cost';
import CampaignEngagmentView from './campaign/demo-campaign-engagement';
import CampaignConversionView from './campaign/demo-campaign-convertion';
import { useUsers } from 'src/hooks/realm/user/use-user-graphql';
import UserDailyActivityView from './campaign/demo-user-daily-activity';
import AnalyticsComingSoon from './campaign/coming-soon';

// ----------------------------------------------------------------------

export const ANALYTICS_OVERVIEW_DETAILS_TABS = [
  { value: 'active', label: 'Daily Active Users' },
  { value: 'task', label: 'Task Completion Rate' },
  { value: 'engagement', label: 'User Engagement Score' },
];

// ----------------------------------------------------------------------

export default function SalesRevenueAnalyticsView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('active');

  const { campaigns, loading } = useCampaigns();

  const { users, loading: usersLoading } = useUsers();

  const { getCampaignReport } = useReports();

  const loadingReport = useBoolean()

  const [reports, setReports] = useState<IReport[] | null>(null)

  const [reportError, setReportsError] = useState(null)

  const [selectCampaign, setSelectCampaign] = useState<ICampaign | null>();

  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebounce(searchValue);


  useEffect(() => {
    if (selectCampaign) {
      loadingReport.onTrue()
      setReportsError(null)
      getCampaignReport(selectCampaign?._id.toString())
        .then(res => {
          setReportsError(null)
          setReports(res)
        }
        )
        .catch(e => {
          enqueueSnackbar("Failed to fetch campaign reports", { variant: "error" })
          setReportsError(e.message)
          console.error(e, "REPORT FETCH")
        })
        .finally(() => {
          loadingReport.onFalse()
        })

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectCampaign])

  const handleChangeSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, [])

  // eslint-disable-next-line
  const results = useMemo(() => Array.isArray(campaigns) ? campaigns.filter(c => c.title.toLowerCase().includes(debouncedSearch)) : [], [debouncedSearch])


  const onClickhandler = (n: string) => {
    // handleClick(n)
    const cmpg = results.find((r) => r._id.toString() === n)
    if (cmpg) {
      setSearchValue("")
      setSelectCampaign(cmpg)
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (debouncedSearch) {
      if (event.key === 'Enter') {
        const selectItem = results[0];
        onClickhandler(selectItem._id.toString());
      }
    }
  };

  const renderSearch = (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 300 } }}
      loading={loading}
      autoHighlight
      popupIcon={null}
      options={results}
      onInputChange={(event, newValue) => handleChangeSearchValue(newValue)}
      getOptionLabel={(option) => option.title}
      noOptionsText={<SearchNotFound query={searchValue} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option._id === value._id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 400,
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
          onKeyUp={handleKeyUp}
          placeholder="Search for campaign..."
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
      renderOption={(props, c, { inputValue }) => {
        const matches = match(c.title, inputValue);
        const parts = parse(c.title, matches);

        return (
          <Box component="li" {...props} onClick={() => onClickhandler(c._id.toString())} key={c._id.toString()}>

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

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);


  const renderTabs = (
    <Tabs
      value={currentTab}
      onChange={handleChangeTab}
      sx={{
        mb: { xs: 3, md: 5 },
      }}
    >
      {ANALYTICS_OVERVIEW_DETAILS_TABS.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
        />
      ))}
    </Tabs>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h4"
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        >
          Hi, Welcome back 👋
        </Typography>
        <IconButton color="error" edge="start" onClick={() => setSelectCampaign(null)}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Stack>
      {!selectCampaign &&
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          {renderSearch}
        </Box>
      }
      {selectCampaign && loadingReport.value && <LoadingScreen />}
      {selectCampaign && !loadingReport.value && reportError && <>FAILED TO FETCH REPORTS</>}

      {selectCampaign && !loadingReport.value && renderTabs}


      {currentTab === "active" && !loadingReport.value && selectCampaign && reports && <UserDailyActivityView reports={reports} />}

      {currentTab === "task" && !loadingReport.value && selectCampaign && reports && <AnalyticsComingSoon reports={reports} />}

      {currentTab === "engagement" && !loadingReport.value && reports && selectCampaign && <CampaignCostView reports={reports} />}


    </Container>
  );
}
