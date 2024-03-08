import { useMemo, useCallback } from 'react';

import { Card } from '@mui/material';

import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { formatFilterAndRemoveFields } from 'src/utils/helpers';

import { DataGridFlexible } from 'src/components/data-grid';
import { LoadingScreen } from 'src/components/loading-screen';
import { IGenericColumn } from 'src/components/data-grid/data-grid-flexible';

import { IProductItem } from 'src/types/product';

function ClientProductDataGrid({ products, loading }: { products?: IProductItem[], loading?: boolean }) {
  const router = useRouter();
  const showLoader = useShowLoader(loading ?? true, 300);

  const handleViewDetails = useCallback((_id: string) => {
    // Assuming there's a path for viewing product details
    router.push(`/path/to/product/details/${_id}`);
  }, []);

  const columns: IGenericColumn<IProductItem>[] = useMemo(() => [
    { field: "_id", label: "ID", type: "string" },
    { field: "name", label: "Name", type: "main", minWidth: 300 },
    { field: "category", label: "Category", type: "string", minWidth: 150 },
    { field: "price", label: "Price", type: "number", formatter: fCurrency },
    { field: "quantity", label: "Quantity", type: "number", minWidth: 100 },
    { field: "available", label: "Available", type: "number", minWidth: 100 },
    {
      field: "actions", label: "Actions", type: "actions",
      action: {
        viewDetails: {
          label: 'Details',
          icon: 'material-symbols:visibility-outline',
          action: handleViewDetails,
        }
      }
    },
  ], [handleViewDetails]);

  // const cleanedProducts = useMemo(() => {
  //   if (!Array.isArray(products)) return [];
  //   return formatFilterAndRemoveFields(
  //     products,
  //     // Assume "formatFilterAndRemoveFields" is capable of handling the product data as needed
  //     // Add or remove any specific processing as necessary for your application
  //   );
  // }, [products]);
  const cleanedProducts = useMemo(() => {
    if (!Array.isArray(products)) return []
    const filtered = formatFilterAndRemoveFields(
      products,
      // @ts-expect-error expected
      ["__typename"],
      [
        {
          key: "_id",
          formatter: (val) => val.toString(),
        },
        {
          key: "price",
          formatter: fCurrency,
        },
        {
          key: "updatedAt",
          formatter: fDateTime,
        },
        {
          key: "createdAt",
          formatter: fDateTime,
        }
      ],
      undefined
    ) ?? []
    return filtered
  }, [products])


  return (
    <Card
      sx={{
        height: { xs: 800, md: 600 },
        flexGrow: { md: 1 },
        display: { md: 'flex' },
        flexDirection: { md: 'column' },
      }}
    >
      {showLoader && <LoadingScreen />}
      {!showLoader && cleanedProducts &&
        <DataGridFlexible
          data={cleanedProducts}
          columns={columns}
          hideColumn={{ _id: false }}
          title='Product Data Grid'
          getRowIdFn={(row) => row._id.toString()}
        />
      }
    </Card>
  );
}

export default ClientProductDataGrid;
