'use client';

import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';
import { useOrders } from 'src/hooks/realm/order/use-order-graphql';

import { ORDER_STATUS_OPTIONS } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';

import { IOrderItem } from 'src/types/order';

import OrderDetailsInfo from '../order-details-info';
import OrderDetailsItems from '../order-details-item';
import OrderDetailsToolbar from '../order-details-toolbar';
import OrderDetailsHistory from '../order-details-history';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function OrderDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { getOrder } = useOrders()

  const [currentOrder, setOrder] = useState<IOrderItem | undefined>(undefined)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [orderError, setOrderError] = useState<String | undefined>(undefined)
  const orderLoading = useBoolean();
  const [status, setStatus] = useState(currentOrder?.status);

  useEffect(() => {
    orderLoading.onTrue()
    getOrder(id).then(order => {
      if (order?.data?.order) {
        setOrder(order?.data?.order)
        setStatus(order?.data?.order?.status)
      }
      orderLoading.onFalse()
    }).catch(e => {
      setOrderError(JSON.stringify(e))
      enqueueSnackbar("Order Not found", { variant: "error" })
      orderLoading.onFalse()
    }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getOrder, id])



  const handleChangeStatus = useCallback((newValue: string) => {
    setStatus(newValue);
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {

      }
      {
        currentOrder &&
        <>
          <OrderDetailsToolbar
            backLink={paths.dashboard.order.root}
            orderNumber={currentOrder.orderNumber}
            createdAt={currentOrder.createdAt}
            status={status ?? ""}
            onChangeStatus={handleChangeStatus}
            statusOptions={ORDER_STATUS_OPTIONS}
          />

          <Grid container spacing={3}>
            <Grid xs={12} md={8}>
              <Stack spacing={3} direction={{ xs: 'column-reverse', md: 'column' }}>
                <OrderDetailsItems
                  items={currentOrder.items}
                  taxes={currentOrder.taxes}
                  shipping={currentOrder.shipping}
                  discount={currentOrder.discount}
                  subTotal={currentOrder.subTotal}
                  totalAmount={currentOrder.totalAmount}
                />

                <OrderDetailsHistory history={currentOrder.history} />
              </Stack>
            </Grid>

            <Grid xs={12} md={4}>
              <OrderDetailsInfo
                customer={currentOrder.customer}
                delivery={currentOrder.delivery}
                payment={currentOrder.payment}
                shippingAddress={currentOrder.shippingAddress}
              />
            </Grid>
          </Grid>
        </>
      }
    </Container>
  );
}
