"use client"

import React, { memo, useEffect, useState } from 'react'

import { IProductItem } from 'src/types/product'

import ClientProductDataGrid from '../table/c-table-products-campaign'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack } from '@mui/material'
import Scrollbar from 'src/components/scrollbar'
import { Box } from '@mui/system'
import { useBoolean } from 'src/hooks/use-boolean'
import { useShowLoader } from 'src/hooks/realm'
import EnhancedTransferList from 'src/sections/_examples/mui/transfer-list-view/enhanced-transfer-list'
import { LoadingScreen } from 'src/components/loading-screen'
import Iconify, { SystemIcon } from 'src/components/iconify'
import { useClientContext } from 'src/components/clients'
import { useRealmApp } from 'src/components/realm'
import { enqueueSnackbar } from 'notistack'
import CProductTransferList from '../c-product-transfer-list'

function CFormCampaignProducts({ products, loading }: { products?: IProductItem[], loading?: boolean }) {

  const openTransfer = useBoolean();

  const productsLoading = useBoolean(true)

  const { client } = useClientContext()

  const realmApp = useRealmApp();

  const [clientProducts, setClientProducts] = useState<IProductItem[] | null>(null);

  const [ error, setError ] = useState<unknown>(null)

  const showLoader = useShowLoader(false, 200)

  useEffect(() => {
    if (client?._id) {
      productsLoading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.getClientProducts(client._id.toString()).then((prds: IProductItem[]) => {
        setClientProducts(prds)
      })
        .catch(e => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get client products", { variant: "error" })
        }
        )
        .finally(() => productsLoading.onFalse())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client?._id])


  useEffect(() => {
    
  },[])

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={3} >
        <Button
          size='small'
          sx={{
            maxWidth: "max-content"
          }}
          color='info'
          variant='soft'
          onClick={openTransfer.onTrue}
          startIcon={
            <SystemIcon type="product" width={20} />
          }
        >
          Create a Sales Report
        </Button>
        <Button
          size='small'
          sx={{
            maxWidth: "max-content"
          }}
          color='info'
          variant='soft'
          onClick={openTransfer.onTrue}
          startIcon={
            <Iconify icon="mingcute:add-line" />
          }
        >
          Add Products
        </Button>
      </Stack>
      <ClientProductDataGrid products={products} loading={loading} />
      <Dialog
        fullWidth
        maxWidth="sm"
        open={openTransfer.value}
        onClose={() => { }}
      >
        <DialogTitle>Select Client</DialogTitle>

        <DialogContent dividers>
          <Scrollbar>
            <Box sx={{ width: 'max-content', my: 2 }}>
              {showLoader && <LoadingScreen />}
              {!showLoader && products && clientProducts && <CProductTransferList products={products} clientProducts={clientProducts} />}
            </Box>
          </Scrollbar>
        </DialogContent>
        <DialogActions>
          <Button onClick={openTransfer.onFalse} color="error">
            Cancel
          </Button>
          <Button onClick={openTransfer.onFalse} color="primary">
            Confirm
          </Button>
        </DialogActions>

      </Dialog>
    </Stack>
  )
}

export default memo(CFormCampaignProducts)