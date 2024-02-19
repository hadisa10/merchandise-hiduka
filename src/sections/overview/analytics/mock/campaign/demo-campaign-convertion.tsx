'use client';

import { useMemo } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import { IReport } from 'src/types/realm/realm-types';

import AnalyticsCurrentSubject from '../../analytics-current-subject';
import AnalyticsConversionRates from '../../analytics-conversion-rates';

// ----------------------------------------------------------------------

export default function CampaignConversionView({ reports }: { reports: IReport[] }) {
    const settings = useSettingsContext();
    // const reportsColl = useMemo(() => reports.reduce((acc, r) => acc + r.responses, 0), [reports])

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
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>

            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsConversionRates
                        title="Conversion Rates"
                        subheader="Conversion rate by report"
                        chart={{
                            series: conversionRatesSeries
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsCurrentSubject
                        title="Current Subject"
                        chart={{
                            categories: ['Nairobi', 'Kisumu', 'Nakuru', 'Mombasa'],
                            series: [
                                { name: 'Series 1', data: [80, 50, 30, 40, 100, 20] },
                                { name: 'Series 2', data: [20, 30, 40, 80, 20, 80] },
                                { name: 'Series 3', data: [44, 76, 78, 13, 43, 10] },
                            ],
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
