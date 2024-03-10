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

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const { getInvoice } = useInvoices()

  const [currentInvoice, setInvoice] = useState<IInvoice | undefined>(undefined)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [invoiceError, setInvoiceError] = useState<String | undefined>(undefined)
  console.log(currentInvoice, "CURRENT INVOICE")
  const invoiceLoading = useBoolean();

  useEffect(() => {
    invoiceLoading.onTrue()
    getInvoice(id).then(invoice => {
      if (invoice?.data?.invoice) {
        setInvoice(invoice?.data?.invoice)
      }
      invoiceLoading.onFalse()
    }).catch(e => {
      setInvoiceError(JSON.stringify(e))
      enqueueSnackbar("Order Not found", { variant: "error" })
      invoiceLoading.onFalse()
    }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getInvoice, id])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentInvoice?.invoiceNumber}
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
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {currentInvoice && <InvoiceDetails invoice={currentInvoice} />}
    </Container>
  );
}
