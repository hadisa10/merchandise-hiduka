import * as Yup from 'yup';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Chip, Checkbox } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useProducts } from 'src/hooks/realm';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFAutocomplete } from 'src/components/hook-form';


// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  onClose: VoidFunction;
  campaignId: string;
  handleAddNewProduct: () => void;
};

const icon = <Iconify icon="fluent:checkbox-checked-16-regular" />;
const checkedIcon = <Iconify icon="fluent:checkbox-checked-16-filled" />;

export default function AddCampaignProductDialog({ campaignId, handleAddNewProduct, open, onClose }: Props) {
  const { enqueueSnackbar } = useSnackbar();
  // const { saveRoute } = useRealmRoutes();
  const { products, loading, addCampaignProducts } = useProducts(false);

  // Define the main schema for the routeAddress object
  const RouteAddressSchema = Yup.object().shape({
    products: Yup.lazy(() => Yup.array().of(Yup.string().required('Product is required').min(1, 'Select atleast one product')))
  });

  const defaultValues = useMemo(
    () => ({
      products: []
    }),
    []
  );

  const methods = useForm({
    resolver: yupResolver(RouteAddressSchema),
    defaultValues,
  });

  const {
    getValues,
    trigger,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (data.products) {

        console.log("CLICKED")
        await new Promise((resolve) => setTimeout(resolve, 500));
        // const dt = new Date();
        reset();
        // handleAddNewProduct();
        await addCampaignProducts(campaignId, data.products)

        // onClose();
        enqueueSnackbar('Products added!');
        console.info('DATA', data);
      } else {
        throw new Error("No products selected")
      }
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Product addition failed!', { variant: "error" });
    }
  });

  return (
    <Dialog
      fullWidth
      maxWidth={false}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { maxWidth: 360 },
      }}
    >
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogTitle>Add Product</DialogTitle>

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
            <RHFAutocomplete
              name="products"
              label="Products"
              placeholder="+ products"
              loading={loading}
              fullWidth
              multiple
              limitTags={2}
              freeSolo
              disableCloseOnSelect
              options={products.map(prd => prd._id)}
              getOptionLabel={(option) => {
                const product = products?.find((prd) => prd._id.toString() === option?.toString());
                if (product) {
                  return product?.name
                }
                return option
              }}
              renderOption={(props, option, { selected }) => {
                const product = products?.filter(
                  (prd) => prd._id.toString() === option.toString()
                )[0];

                if (!product?._id) {
                  return null;
                }

                return (
                  <li {...props} key={product._id.toString()}>
                    <Checkbox
                      icon={icon}
                      checkedIcon={checkedIcon}
                      style={{ marginRight: 8 }}
                      checked={selected}
                    />
                    {product?.name}
                  </li>
                );
              }}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => {
                  const product = products?.find((prd) => prd._id.toString() === option.toString());
                  return (
                    <Chip
                      {...getTagProps({ index })}
                      key={product?._id.toString() ?? ""}
                      label={product?.name ?? ""}
                      size="small"
                      color="info"
                      variant="soft"
                    />
                  )
                })
              }
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <LoadingButton onClick={async () => {
            const isValid = await trigger(); // Trigger validation for all fields
            console.log(isValid)
            if (isValid) {
              // If validation is successful, manually call your submit function with form values
              // @ts-expect-error expected
              await onSubmit(getValues());
            }

          }} variant="contained" loading={isSubmitting}>
            Add
          </LoadingButton>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
}
