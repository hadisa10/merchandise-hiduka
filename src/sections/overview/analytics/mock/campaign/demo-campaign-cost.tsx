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

export default function CampaignCostView({ reports }: { reports: IReport[] }) {
    const settings = useSettingsContext();
    const reportsColl = useMemo(() => reports.reduce((acc, r) => { return acc + r.responses }, 0), [reports])

    // Generate series data from reports, each with a random value
    const conversionRatesSeries = useMemo(() => {
        const unsortedSeries = reports.map(report => ({
            label: report.title,
            value: Math.floor(Math.random() * (500 - 100 + 1)) + 100 // Assigning random values
        }));

        // Sort the series by value in ascending order explicitly
        const sortedSeries = unsortedSeries.sort((a, b) => a.value - b.value);

        return sortedSeries;
    }, [reports]);
    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'} sx={{ p: 10}}>
            <ComingSoonView />
        </Container>
    );
}
