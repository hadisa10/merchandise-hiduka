'use client';

import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useBoolean } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IUpdateInvoice } from 'src/types/realm/realm-types';

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function InvoiceDetailsView({ id }: Props) {
  const settings = useSettingsContext();

  const [currentInvoice, setInvoice] = useState<IUpdateInvoice | undefined>(undefined)
  
  const invoiceLoading = useBoolean();

  const realmApp = useRealmApp()

  useEffect(() => {
    invoiceLoading.onTrue()
    realmApp.currentUser?.functions.getInvoice(id.toString()).then((data: IUpdateInvoice) => setInvoice(data))
      .catch(e => {
        console.error(e)
        enqueueSnackbar("Failed to get invoice", { variant: "error" })
      }
      )
      .finally(() => invoiceLoading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={currentInvoice?.invoiceNumber.toString()}
        links={[
          {
            name: 'Dashboard',
            href: paths.dashboard.root,
          },
          {
            name: 'Invoice',
            href: paths.dashboard.invoice.root,
          },
          { name: currentInvoice?.invoiceNumber.toString() },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      {currentInvoice && <InvoiceDetails invoice={currentInvoice} />}
    </Container>
  );
}
