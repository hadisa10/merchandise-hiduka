'use client';

import { first, shuffle } from 'lodash';

import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

import { useUsers } from 'src/hooks/realm/user/use-user-graphql';

import { _mock } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import AppWidgetSummary from 'src/sections/overview/app/app-widget-summary';
import EcommerceBestSalesman from 'src/sections/overview/e-commerce/ecommerce-best-salesman';

import { IReport } from 'src/types/realm/realm-types';


// ----------------------------------------------------------------------

export default function UserDailyActivityView({ reports }: { reports: IReport[] }) {
    const settings = useSettingsContext();
// 
    const { users } = useUsers();

    // const reportsColl = useMemo(() => reports.reduce((acc, r) => acc + r.responses, 0), [reports])

    const merchant = Array.isArray(users) ? shuffle(users).map((user, i) => {
        const category = ['CAP', 'Branded Shoes', 'Headphone', 'Cell Phone', 'Earings'][i];

        return {
            id: user._id,
            flag: "ke",
            category,
            rank: `Top ${i + 1}`,
            email: user.email,
            name: user.displayName,
            totalAmount: _mock.number.price(i),
            avatarUrl: first(user.displayName) as unknown as string ?? "",
        }
    }) : []
    const sales = Array.isArray(users) ? shuffle(users).map((user, i) => {
        const category = ['CAP', 'Branded Shoes', 'Headphone', 'Cell Phone', 'Earings', 'CAP'][i];

        return {
            id: user._id,
            flag: "ke",
            category,
            rank: `Top ${i + 1}`,
            email: user.email,
            name: user.displayName,
            totalAmount: _mock.number.price(i),
            avatarUrl: first(user.displayName) as unknown as string ?? "",
        }
    }) : []

    return (
        <Container maxWidth={settings.themeStretch ? false : 'xl'}>
            <Grid container spacing={3}>
                <Grid xs={12} md={6} lg={8}>
                    <EcommerceBestSalesman
                        title="Best Merchant"
                        tableData={merchant}
                        tableLabels={[
                            { id: 'name', label: 'Seller' },
                            { id: 'category', label: 'Product' },
                            { id: 'country', label: 'Country', align: 'center' },
                            { id: 'totalAmount', label: 'Total', align: 'right' },
                            { id: 'rank', label: 'Rank', align: 'right' },
                        ]}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Active Users"
                        percent={0.6}
                        total={users.length ?? 0}
                        chart={{
                            series: [8],
                        }}
                    />
                </Grid>
                <Grid xs={12} md={6} lg={8}>
                    <EcommerceBestSalesman
                        title="Best Brand Ambassador"
                        tableData={sales}
                        tableLabels={[
                            { id: 'name', label: 'Brand Ambassador' },
                            { id: 'category', label: 'Product' },
                            { id: 'country', label: 'Country', align: 'center' },
                            { id: 'totalAmount', label: 'Total', align: 'right' },
                            { id: 'rank', label: 'Rank', align: 'right' },
                        ]}
                    />
                </Grid>

                <Grid xs={12} md={4}>
                    <AppWidgetSummary
                        title="Total Active Users"
                        percent={2.6}
                        total={users.length}
                        chart={{
                            series: [2, 3],
                        }}
                    />
                </Grid>
            </Grid>
        </Container>
    );
}
