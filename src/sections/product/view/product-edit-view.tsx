'use client';

import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';

import Container from '@mui/material/Container';

import { useProducts } from 'src/hooks/realm';

import { getRolePath } from 'src/utils/helpers';

import { useRealmApp } from 'src/components/realm';
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

  const { getProduct } = useProducts();

  const [currentProduct, setCurrentProduct] = useState<IProductItem | undefined>(undefined);

  const { currentUser } = useRealmApp();

  const role = useMemo(
    () => currentUser?.customData?.role as unknown as string,
    [currentUser?.customData?.role]
  );

  const rolePath = getRolePath(role);

  useEffect(() => {
    getProduct(id)
      .then((product) => {
        if (product?.data?.product) {
          setCurrentProduct(product?.data?.product);
        }
      })
      .catch((e) => enqueueSnackbar('Product Not found', { variant: 'error' }));
  }, [getProduct, id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Edit"
        links={[
          // @ts-expect-error expected
          { name: 'Dashboard', href: rolePath?.dashboard.root },
          {
            name: 'Product',
            // @ts-expect-error expected
            href: rolePath?.dashboard.product.root,
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
