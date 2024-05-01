'use client';

import { enqueueSnackbar } from 'notistack';
import React, { useRef, useState, useEffect, useCallback } from 'react';

import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { List, Paper, useTheme } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { bgBlur } from 'src/theme/css';

import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';

import { ICampaignExtended } from 'src/types/realm/realm-types';

import AppCampaignItem from './app-campaign-item';
import AppCampaignColumnToolBar from './app-campaign-column-tool-bar';

function AppCampaignList() {
  const campaignLoader = useBoolean();

  const theme = useTheme();

  const openSearchQuestion = useBoolean();

  const realmApp = useRealmApp();

  // eslint-disable-next-line
  const [campaignError, setCampaignError] = useState(null);

  const [campaigns, setCampaigns] = useState<ICampaignExtended[]>([]);

  const showLoader = useShowLoader(campaignLoader.value, 500);

  useEffect(() => {
    campaignLoader.onTrue();
    setCampaignError(null);
    realmApp.currentUser?.functions
      .getCampaigns()
      .then((res: ICampaignExtended[]) => {
        setCampaignError(null);
        console.log(res, 'RESPONSE');
        setCampaigns(res.map((x, i) => ({ ...x, order: i })));
      })
      .catch((e) => {
        enqueueSnackbar('Failed to fetch campaigns', { variant: 'error' });
        setCampaignError(e.message);
        console.error(e, 'REPORT FETCH');
      })
      .finally(() => {
        campaignLoader.onFalse();
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const campaignRefs = useRef<Array<HTMLElement | null>>([]);

  const [selectedSearch, setSelectedSearch] = useState<ICampaignExtended | null>(null);

  const scrollToQuestion = useCallback(
    (index: number) => {
      const ref = campaignRefs.current[index];
      const camp = campaigns.find((c) => c.order === index);

      if (ref && camp) {
        setSelectedSearch(camp);
        ref.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    },
    [campaigns]
  );

  const renderCampaigns = (
    <Grid xs={12} md={8}>
      <Paper
        sx={{
          p: { md: 0.5, xs: 0.1 },
          borderRadius: 2,
          position: 'relative',
          bgcolor: 'background.neutral',
        }}
      >
        <AppCampaignColumnToolBar
          title={<>My Campaigns</>}
          handleClick={scrollToQuestion}
          openSearch={openSearchQuestion.value}
          campaigns={campaigns}
          openSearchQuestion={openSearchQuestion.onToggle}
        />

        <List sx={{ maxHeight: '70vh', overflowY: 'auto', minHeight: '60vh' }}>
          {showLoader && <LoadingScreen />}

          {Array.isArray(campaigns) &&
            !showLoader &&
            campaigns.map((q, index) => (
              <AppCampaignItem
                ref={(el: HTMLElement | null) => {
                  // eslint-disable-next-line no-multi-assign
                  const t = (campaignRefs.current[index] = el);
                  return t;
                }}
                sx={{
                  ...(q._id?.toString() === selectedSearch?._id?.toString()
                    ? bgBlur({
                        opacity: 0.18,
                        color: theme.palette.warning.main,
                      })
                    : {}),
                }}
                key={q._id?.toString()}
                index={index}
                actions={{}}
                campaign={q}
              />
            ))}
        </List>
      </Paper>
    </Grid>
  );
  return (
    <Grid container spacing={3} minHeight="70vh">
      {renderCampaigns}
    </Grid>
  );
}

export default AppCampaignList;
