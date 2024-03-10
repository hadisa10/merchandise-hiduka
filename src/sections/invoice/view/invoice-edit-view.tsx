'use client';

import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useInvoices } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IInvoice } from 'src/types/invoice';

import InvoiceNewEditForm from '../invoice-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { getInvoice } = useInvoices()

  const [currentInvoice, setInvoice] = useState<IInvoice | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invoiceError, setOrderError] = useState<String | undefined>(undefined)
  console.log(currentInvoice, "CURRENT INVOICE")
  const orderLoading = useBoolean();

  useEffect(() => {
    orderLoading.onTrue()
    getInvoice(id).then(invoice => {
      if (invoice?.data?.invoice) {
        setInvoice(invoice?.data?.invoice)
      }
      orderLoading.onFalse()
    }).catch(e => {
      setOrderError(JSON.stringify(e))
      enqueueSnackbar("Order Not found", { variant: "error" })
      orderLoading.onFalse()
    }
    )
  }, [getInvoice, id, orderLoading])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          { name: currentInvoice?.invoiceNumber },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <InvoiceNewEditForm currentInvoice={currentInvoice} />
    </Container>
  );
}
