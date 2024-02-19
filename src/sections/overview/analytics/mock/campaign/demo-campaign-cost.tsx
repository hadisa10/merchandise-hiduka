'use client';


import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import ComingSoonView from 'src/sections/coming-soon/view';

import { IReport } from 'src/types/realm/realm-types';


// ----------------------------------------------------------------------

export default function CampaignCostView({ reports }: { reports: IReport[] }) {
    const settings = useSettingsContext();
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ p: 10}}>
            <ComingSoonView />
        </Container>
    );
}
