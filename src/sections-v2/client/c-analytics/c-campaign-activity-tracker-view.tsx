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
import { useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Box, Tab, Tabs, Stack, TextField, IconButton, Autocomplete, InputAdornment, autocompleteClasses } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { useSettingsContext } from 'src/components/settings';
import SearchNotFound from 'src/components/search-not-found';

import InvoiceListViewV2 from 'src/sections/invoice/view/invoice-list-view-v2';

import { ICampaign } from 'src/types/realm/realm-types';

import ClientCampaignActivityTracker from './campaign/c-campaign-activity-tracker';

// import CampaignCostView from './campaign/demo-campaign-cost';
// import UserDailyActivityView from './campaign/demo-user-daily-activity';

// ----------------------------------------------------------------------

export const ANALYTICS_OVERVIEW_DETAILS_TABS = [
  { value: 'active', label: 'Daily Active Users' },
  { value: 'task', label: 'Task Completion Rate' },
  { value: 'invoices', label: 'Invoices' },
];

// ----------------------------------------------------------------------

export default function ClientCampaignActivityTrackerView() {
  const settings = useSettingsContext();

  const [currentTab, setCurrentTab] = useState('active');

  // const { campaigns, loading } = useCampaigns();

  const realmApp = useRealmApp();

  const { client } = useClientContext();

  const [selectCampaign, setSelectCampaign] = useState<ICampaign | null>();

  const [searchValue, setSearchValue] = useState('');

  const debouncedSearch = useDebounce(searchValue);

  const campaignLoading = useBoolean(true);

  const showCampaignLoading = useShowLoader(campaignLoading.value, 200)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  const [searchedCampaigns, setSearchedCampaigns] = useState<ICampaign[]>([]);

  useEffect(() => {
    if (client?._id) {
      campaignLoading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.searchClientCampaigns({ client_id: client?._id.toString(), searchString: debouncedSearch }).then((data: ICampaign[]) => setSearchedCampaigns(data))
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get your clients", { variant: "error" })
        }
        )
        .finally(() => campaignLoading.onFalse())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, client?._id])


  const handleChangeSearchValue = useCallback((value: string) => {
    setSearchValue(value);
  }, [])


  // const results = useMemo(() => Array.isArray(campaigns) ? campaigns.filter(c => c.title.toLowerCase().includes(debouncedSearch)) : [], [debouncedSearch])


  const onClickhandler = (n: string) => {
    // handleClick(n)
    const cmpg = searchedCampaigns.find((r) => r._id.toString() === n)
    if (cmpg) {
      setSearchValue("")
      setSelectCampaign(cmpg)
    }
  }
  const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (debouncedSearch) {
      if (event.key === 'Enter') {
        const selectItem = searchedCampaigns[0];
        onClickhandler(selectItem._id.toString());
      }
    }
  };

  const renderSearch = (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 300 } }}
      loading={showCampaignLoading}
      autoHighlight
      popupIcon={null}
      options={searchedCampaigns}
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
      <Box>

        {/* {!selectCampaign && <>FAILED TO FETCH REPORTS</>} */}

        {selectCampaign && renderTabs}

        {currentTab === "active" && selectCampaign && !showCampaignLoading && <ClientCampaignActivityTracker campaign={selectCampaign} />}

        {currentTab === "invoices" && <InvoiceListViewV2 />}

        {currentTab === "task" && <>Campaign Task</>}



        {/* {currentTab === "engagement" && !loadingReport.value && selectCampaign && reports && <CampaignEngagmentView reports={reports} />}

      {currentTab === "conversion" && !loadingReport.value && selectCampaign && reports && <CampaignConversionView reports={reports} />}

      {currentTab === "cost" && !loadingReport.value && reports && selectCampaign && <CampaignCostView reports={reports} />}

      {currentTab === "invsetment" && !loadingReport.value && reports && selectCampaign && <CampaignInvestmentView reports={reports} />}
 */}
      </Box>
    </Container>
  );
}