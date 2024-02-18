'use client';


import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useBoolean } from 'src/hooks/use-boolean';
import { useReports } from 'src/hooks/realm/report/use-report-graphql';

import { useSettingsContext } from 'src/components/settings';
import { LoadingScreen } from 'src/components/loading-screen';

import { IReport } from 'src/types/realm/realm-types';

import CampaignNewEdit from '../report-new-edit-form';

// ----------------------------------------------------------------------

export const CAMPAIGN_PUBLISH_OPTIONS = [
  {
    value: 'published',
    label: 'Published',
  },
  {
    value: 'draft',
    label: 'Draft',
  },
];


// ----------------------------------------------------------------------

export default function ReportEditView({ id }: { id: string }) {
  const settings = useSettingsContext();

  const { getReport } = useReports();

  const showLoader = useBoolean();

  const [error, setError] = useState<any>(null);
  const [report, setReport] = useState<IReport | null>(null)

  useEffect(() => {
    showLoader.onTrue();
    setError(null);
    getReport(id).then(rep => setReport(rep)).catch(e => setError(e))
      .finally(() => showLoader.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {showLoader.value && <LoadingScreen />}
      {!showLoader.value && error && <>Failed to fetch report</>}
      {report && !showLoader.value && !error && <CampaignNewEdit currentReport={report} />}
    </Container>
  );
}
