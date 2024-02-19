'use client';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import {
    _analyticTasks,
    _analyticPosts,
    _analyticTraffic,
    _analyticOrderTimeline,
} from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AnalyticsNews from '../../analytics-news';
import AnalyticsTasks from '../../analytics-tasks';
import AnalyticsCurrentVisits from '../../analytics-current-visits';
import AnalyticsOrderTimeline from '../../analytics-order-timeline';
import AnalyticsWebsiteVisits from '../../analytics-website-visits';
import AnalyticsWidgetSummary from '../../analytics-widget-summary';
import AnalyticsTrafficBySite from '../../analytics-traffic-by-site';
import AnalyticsCurrentSubject from '../../analytics-current-subject';
import AnalyticsConversionRates from '../../analytics-conversion-rates';
import { IReport } from 'src/types/realm/realm-types';
import { useMemo } from 'react';
import ComingSoonView from 'src/sections/coming-soon/view';

// ----------------------------------------------------------------------

export default function AnalyticsComingSoon({ reports }: { reports?: IReport[] }) {
    const settings = useSettingsContext();

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ p: 10}}>
            <ComingSoonView />
        </Container>
    );
}
