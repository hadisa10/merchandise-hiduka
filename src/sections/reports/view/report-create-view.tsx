'use client';


import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import ReportNewEdit from '../report-new-edit-form';

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

export default function ReportCreateView() {
  const settings = useSettingsContext();


  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <ReportNewEdit />
    </Container>
  );
}
