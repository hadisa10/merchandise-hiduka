'use client';

import { useMemo } from 'react';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import { IReport } from 'src/types/realm/realm-types';

// import AnalyticsConversionRates from '../../analytics-conversion-rates';

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
                    {/* <AnalyticsConversionRates
                        title="Conversion Rates"
                        subheader="Conversion rate by report"
                        chart={{
                            series: conversionRatesSeries
                        }}
                    /> */}
                </Grid>
            </Grid>
        </Container>
    );
}
