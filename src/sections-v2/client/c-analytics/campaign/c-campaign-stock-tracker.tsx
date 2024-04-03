'use client';

import { enqueueSnackbar } from 'notistack';
import { memo, useState, Suspense, useEffect } from 'react';

import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';

import UserStockDataGrid from 'src/sections/campaign/list/user-activity/user-stock-data-grid';

import { ICampaign, ISalesByRegion, ISalesAnalyticsResponse, ITimeFrameSalesDataResponse } from 'src/types/realm/realm-types';




function ClientCampaignStockTracker({ campaign }: { campaign: ICampaign }) {


    const realmApp = useRealmApp()

    const campaignloading = useBoolean()

    const regionalSalesloading = useBoolean()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboarCampaignSalesMetrics, setDashboarCampaignSalesMetrics] = useState<ISalesAnalyticsResponse[] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboardTimeSalesMetrics, setDashboardTimeSalesMetrics] = useState<ITimeFrameSalesDataResponse[] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [dashboardSalesByRegionMetrics, setDashboardSalesByRegionMetrics] = useState<ISalesByRegion[] | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (campaign._id) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getCampaignSalesMetrics(campaign._id.toString()).then((data: ISalesAnalyticsResponse[]) => setDashboarCampaignSalesMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    useEffect(() => {
        if (campaign._id) {
            campaignloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getSalesOfProductOverTime({ campaign_id: campaign._id.toString(), timeFrame: "week" }).then((data: ITimeFrameSalesDataResponse[]) => setDashboardTimeSalesMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => campaignloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    useEffect(() => {
        if (campaign._id) {
            regionalSalesloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getCampaignSalesByRegion(campaign._id.toString()).then((data: ISalesByRegion[]) => setDashboardSalesByRegionMetrics(data))
                .catch(e => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get dashboard Metrics", { variant: "error" })
                }
                )
                .finally(() => regionalSalesloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    return (
        <Suspense fallback={<LoadingScreen />}><UserStockDataGrid campaign={campaign} /></Suspense>
    );
}


export default memo(ClientCampaignStockTracker)