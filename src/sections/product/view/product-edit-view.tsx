'use client';

import { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useProducts } from 'src/hooks/realm';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import { IProductItem } from 'src/types/product';

import ProductNewEditForm from '../product-new-edit-form';

// ----------------------------------------------------------------------

type Props = {
  id: string;
};

export default function ProductEditView({ id }: Props) {
  const settings = useSettingsContext();

  const { getProduct } = useProducts()
  
  const [currentProduct, setCurrentProduct] = useState<IProductItem | undefined>(undefined)

  useEffect(() => {
    getProduct(id).then(product => {
      if (product?.data?.product) {
        setCurrentProduct(product?.data?.product)
      }
    }).catch(e => enqueueSnackbar("Product Not found", { variant: "error" }))
  }, [getProduct, id])

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          {
            name: 'Product',
            href: paths.dashboard.product.root,
          },
          { name: currentProduct?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <ProductNewEditForm currentProduct={currentProduct} />
    </Container>
  );
}
