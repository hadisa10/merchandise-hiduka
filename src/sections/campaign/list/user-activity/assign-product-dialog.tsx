import * as Yup from 'yup';
import { isEmpty, isString } from 'lodash';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';

import Box from '@mui/material/Box';
import { Stack } from '@mui/system';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import {
  List,
  Badge,
  Avatar,
  ListItem,
  Typography,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';

import { useBoolean, BooleanHookReturnType } from 'src/hooks/use-boolean';

import { useRealmApp } from 'src/components/realm';
import { SystemIcon } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { LoadingScreen } from 'src/components/loading-screen';
import FormProvider, { RHFTextField } from 'src/components/hook-form';

import { IProductItem } from 'src/types/product';
import { IChangeStock, IStockChangeProduct } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  campaignId: string;
  // eslint-disable-next-line react/no-unused-prop-types
  users: { _id: string; name: string }[];
  // eslint-disable-next-line react/no-unused-prop-types
  handleAssignNewProduct: () => void;
  loadingStock: BooleanHookReturnType;
};

// const icon = <Iconify icon="fluent:checkbox-checked-16-regular" />;
// const checkedIcon = <Iconify icon="fluent:checkbox-checked-16-filled" />;

export default function AssignProductDialog({
  campaignId,
  open,
  onClose,
  users,
  loadingStock,
}: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const realmApp = useRealmApp();

  const loadingReport = useBoolean();

  const [products, setProducts] = useState<IProductItem[]>([]);

  // eslint-disable-next-line
  const [productError, setProductsError] = useState(null);

  const loading = useMemo(() => loadingReport.value, [loadingReport.value]);

  // Define the main schema for the routeAddress object
  const AssignedUserProductsSchema = Yup.object().shape({
    assignedUserProducts: Yup.lazy(() =>
      Yup.array().of(
        Yup.object({
          product_id: Yup.string().required('Product is required'),
          coverUrl: Yup.string(),
          name: Yup.string(),
          quantity: Yup.number()
            .nullable()
            .transform((value, originalValue) => {
              // Ensure originalValue is a string before calling trim()
              if (typeof originalValue === 'string') {
                // If originalValue is an empty string, return null; otherwise, return the value unmodified
                return originalValue.trim() === '' ? null : value;
              }
              // If originalValue is not a string, return it unmodified
              return value;
            })
            .min(1, 'Minimum of one product')
            .typeError('Quantity must be a number'),
        })
      )
    ),
  });
  // products: Yup.lazy(() => Yup.array().of(Yup.string().required('Product is required').min(1, 'Select atleast one product')))

  const defaultValues = useMemo(
    () => ({
      assignedUserProducts: products.map((x) => ({
        product_id: x._id.toString(),
        coverUrl: x.coverUrl,
        name: x.name,
        quantity: null,
      })),
    }),
    [products]
  );

  const methods = useForm({
    resolver: yupResolver(AssignedUserProductsSchema),
    defaultValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { fields } = useFieldArray({
    control,
    name: 'assignedUserProducts',
  });

  useEffect(() => {
    if (isString(campaignId) && !isEmpty(campaignId)) {
      loadingReport.onTrue();
      setProductsError(null);
      realmApp.currentUser?.functions
        .getCampaignsProducts(campaignId.toString())
        .then((res: IProductItem[]) => {
          setProductsError(null);
          setProducts(res);
          const newDefaultValues = {
            assignedUserProducts: res.map((product) => ({
              product_id: product._id.toString(),
              coverUrl: product.coverUrl,
              name: product.name,
              quantity: null, // Or any other default value for quantity
            })),
          };
          reset(newDefaultValues);
        })
        .catch((e) => {
          enqueueSnackbar('Failed to fetch campaign products', { variant: 'error' });
          setProductsError(e.message);
          console.error(e, 'REPORT FETCH');
        })
        .finally(() => {
          loadingReport.onFalse();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const onSubmit = handleSubmit(async (data) => {
    loadingStock.onTrue();
    try {
      if (data.assignedUserProducts) {
        const prds: IStockChangeProduct[] = data.assignedUserProducts
          .filter((x) => x.quantity)
          .map((z) => ({
            product_id: z.product_id,
            type: 'assign',
            quantity: z.quantity as number,
            notes: `${realmApp.currentUser?.customData?.firstname} ${realmApp.currentUser?.customData?.lastname} assigned ${z.quantity} to`,
            images: [],
          }));
        const merchantProducts = users.map((x) => ({
          merchant_id: x._id.toString(),
          products: prds.map((z) => ({ ...z, notes: `${z.notes} ${x.name}` })),
        }));

        const changeStockArray: IChangeStock = {
          campaign_id: campaignId,
          merchantProducts,
        };
        const stockChangeResult =
          await realmApp.currentUser?.functions.changeStock(changeStockArray);
        console.log(stockChangeResult, 'CHANGE RESULT');
        reset();
        onClose();
        enqueueSnackbar(stockChangeResult?.success ?? 'Stock movements processed successfully');
        console.info('DATA', data);
      } else {
        throw new Error('No products selected');
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Product addition failed!', { variant: 'error' });
    } finally {
      loadingStock.onFalse();
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      onClose={onClose}
      // PaperProps={{
      //   sx: { maxWidth: theme => theme.spacing(4) },
      // }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>
          <Stack direction="row" spacing={1}>
            Assign Product
            <Badge badgeContent={users?.length ?? 0} color="secondary">
              <SystemIcon type="users" width={30} />
            </Badge>
          </Stack>
        </DialogTitle>

        <DialogContent>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              // sm: 'repeat(2, 1fr)',
            }}
          >
            {productError && !loading && (
              <Typography variant="caption" color="error.light">
                Failed to get products for campaign client
              </Typography>
            )}
            {Array.isArray(products) && isEmpty(products) && !loading && (
              <Typography variant="caption" color="error.light">
                The selected client does not have any products, go the products module and add a
                product
              </Typography>
            )}
            {loading && <LoadingScreen />}
            {Array.isArray(products) && !isEmpty(products) && !loading && (
              <List sx={{ width: '100%', overflowY: 'auto', maxHeight: 200 }}>
                {fields.map((prd, index) => (
                  <ListItem
                    key={prd.product_id.toString()}
                    secondaryAction={
                      <RHFTextField
                        sx={{ maxWidth: 200 }}
                        size="small"
                        type="number"
                        name={`assignedUserProducts[${index}].quantity`}
                        label="Quantity"
                        InputLabelProps={{ shrink: true }}
                      />
                    }
                  >
                    <ListItemAvatar>
                      <Avatar variant="rounded" alt={prd.name} src={prd.coverUrl} />
                    </ListItemAvatar>
                    <ListItemText id={prd.product_id} primary={prd.name} />
                  </ListItem>
                ))}
                {/* {
                  products.map(product => (
                    <ListItem
                      key={product._id.toString()}
                      secondaryAction={
                        <IconButton color="error">
                          <SystemIcon type="campaign" />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="rounded"
                          alt={product.name}
                          src={product.coverUrl}
                        />
                      </ListItemAvatar>
                      <ListItemText id={product._id.toString()} primary={product.name} />
                    </ListItem>
                  ))
                } */}
              </List>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
            Assign Stock
          </LoadingButton>
          {/* <LoadingButton onClick={async () => {
            const isValid = await trigger(); // Trigger validation for all fields
            console.log(isValid)
            if (isValid) {
              // If validation is successful, manually call your submit function with form values
              // @ts-expect-error expected
              await onSubmit(getValues());
            }

          }} variant="contained" loading={isSubmitting}>
            Assign Stock
          </LoadingButton> */}
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
