'use client';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { _invoices } from 'src/_mock';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from '../invoice-new-edit-form';
import { useInvoices } from 'src/hooks/realm';
import { useEffect, useState } from 'react';
import { IInvoice } from 'src/types/invoice';
import { useBoolean } from 'src/hooks/use-boolean';
import { enqueueSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { getInvoice } = useInvoices()

  const [currentInvoice, setInvoice] = useState<IInvoice | undefined>(undefined)
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
  }, [getInvoice, id])

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
