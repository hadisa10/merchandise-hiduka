'use client';

import Grid from '@mui/material/Unstable_Grid2';

import {
    _ecommerceBestSalesman,
    _ecommerceLatestProducts,
} from 'src/_mock';

import Iconify from 'src/components/iconify';

import AnalyticsWidgetSummary from 'src/sections/overview/analytics/analytics-widget-summary';
import AnalyticsCurrentVisits from 'src/sections/overview/analytics/analytics-current-visits';
import AnalyticsConversionRates from 'src/sections/overview/analytics/analytics-conversion-rates';

import EcommerceBestSalesman from '../overview/e-commerce/ecommerce-best-salesman';
import EcommerceLatestProducts from '../overview/e-commerce/ecommerce-latest-products';


// ----------------------------------------------------------------------

export default function DashboardMerchantView() {
    return (


        <Grid container spacing={3}>
            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Total Products"
                    total={2}
                    icon={<Iconify width={48} icon="icon-park:agreement" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Active Campaigns"
                    total={2}
                    color="info"
                    icon={<Iconify width={64} icon="material-symbols-light:campaign-rounded" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Pending Reports"
                    total={50}
                    color="warning"
                    icon={<Iconify width={64} icon="heroicons:users-16-solid" />}
                />
            </Grid>

            <Grid xs={12} sm={6} md={3}>
                <AnalyticsWidgetSummary
                    title="Net Income"
                    total={20000}
                    color="error"
                    icon={<Iconify width={48} icon="icon-park:agreement" />}
                />
            </Grid>
            <Grid xs={12} md={6} lg={8}>
                <AnalyticsConversionRates
                    title="Revenue per Product"
                    subheader="(+43%) than last year"
                    chart={{
                        series: [
                            { label: 'Product 1', value: 400 },
                            { label: 'Product 2', value: 430 },
                            { label: 'Product 3', value: 448 },
                            { label: 'Product 4', value: 470 },
                            { label: 'Product 5', value: 540 },
                            { label: 'Product 6', value: 580 }
                        ],
                    }}
                />
            </Grid>
            <Grid xs={12} md={6} lg={4}>
                <AnalyticsCurrentVisits
                    title="Revenue by Region"
                    chart={{
                        series: [
                            { label: 'Nairobi', value: 4344 },
                            { label: 'Kisumu', value: 5435 },
                            { label: 'Nakuru', value: 1443 },
                            { label: 'Naivasha', value: 1443 },
                            { label: 'Narok', value: 1443 },
                        ],
                    }}
                />
            </Grid>

            <Grid xs={12} md={6} lg={8}>
                <EcommerceBestSalesman
                    title="Best Selling Shops"
                    tableData={_ecommerceBestSalesman}
                    tableLabels={[
                        { id: 'name', label: 'Seller' },
                        { id: 'category', label: 'Product' },
                        { id: 'country', label: 'Country', align: 'center' },
                        { id: 'totalAmount', label: 'Total', align: 'right' },
                        { id: 'rank', label: 'Rank', align: 'right' },
                    ]}
                />
            </Grid>

            <Grid xs={12} md={6} lg={4}>
                <EcommerceLatestProducts title="Latest Products" list={_ecommerceLatestProducts} />
            </Grid>
        </Grid>
    );
}
