"use client"

import { enqueueSnackbar } from 'notistack'
import React, { memo, useState, useEffect } from 'react'

import { Box } from '@mui/system'
import { Stack, Button, Dialog, DialogTitle, DialogActions, DialogContent } from '@mui/material'

import { useShowLoader } from 'src/hooks/realm'
import { useBoolean } from 'src/hooks/use-boolean'

import Scrollbar from 'src/components/scrollbar'
import { useRealmApp } from 'src/components/realm'
import { useClientContext } from 'src/components/clients'
import Iconify, { SystemIcon } from 'src/components/iconify'
import { LoadingScreen } from 'src/components/loading-screen'

import { IProductItem } from 'src/types/product'

import CProductTransferList from '../c-product-transfer-list'
import ClientProductDataGrid from '../table/c-table-products-campaign'

function CFormCampaignProducts({ products, loading }: { products?: IProductItem[], loading?: boolean }) {

  const openTransfer = useBoolean();

  const productsLoading = useBoolean(true)

  const { client } = useClientContext()

  const realmApp = useRealmApp();

  const [clientProducts, setClientProducts] = useState<IProductItem[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [ error, setError ] = useState<unknown>(null)

  const showLoader = useShowLoader(false, 200)

  useEffect(() => {
    if (client?._id) {
      productsLoading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.getClientProducts(client?._id.toString()).then((prds: IProductItem[]) => {
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