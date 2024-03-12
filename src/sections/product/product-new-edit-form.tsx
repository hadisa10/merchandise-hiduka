import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import FormControlLabel from '@mui/material/FormControlLabel';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';
import { useClients, useProducts } from 'src/hooks/realm';

import { uploadImages } from 'src/utils/helpers';

import {
  _tags,
  PRODUCT_SIZE_OPTIONS,
  PRODUCT_GENDER_OPTIONS,
  PRODUCT_COLOR_NAME_OPTIONS,
  PRODUCT_CATEGORY_GROUP_OPTIONS,
} from 'src/_mock';

import { useRealmApp } from 'src/components/realm';
import { useSnackbar } from 'src/components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFUpload,
  RHFSwitch,
  RHFTextField,
  RHFMultiSelect,
  RHFAutocomplete,
  RHFMultiCheckbox,
} from 'src/components/hook-form';

import { IProductItem } from 'src/types/product';

// ----------------------------------------------------------------------

type Props = {
  currentProduct?: IProductItem;
};

export default function ProductNewEditForm({ currentProduct }: Props) {
  const router = useRouter();

  const mdUp = useResponsive('up', 'md');

  const { currentUser } = useRealmApp();

  const { updateProduct, saveProduct } = useProducts()

  const { enqueueSnackbar } = useSnackbar();

  const [includeTaxes, setIncludeTaxes] = useState(false);

  const { loading, clients } = useClients(false);
  // const showClientsLoader = useShowLoader(loading, 200);

  const NewProductSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    client_id: Yup.string().required('Client is required'),
    images: Yup.array().min(1, 'Images is required'),
    tags: Yup.array().min(2, 'Must have at least 2 tags'),
    category: Yup.string().required('Category is required'),
    price: Yup.number().moreThan(0, 'Price should not be $0.00'),
    description: Yup.string().required('Description is required'),
    // not required
    taxes: Yup.number(),
    sku: Yup.string(),
    code: Yup.string(),
    publish: Yup.boolean(),
    quantity: Yup.number().required('Quantity is required'),
    available: Yup.number().required('Available is required').max(Yup.ref('quantity'), 'Available cannot exceed Quantity'), // Validation against Quantity field
    newLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
    saleLabel: Yup.object().shape({
      enabled: Yup.boolean(),
      content: Yup.string(),
    }),
  });

  const defaultValues = useMemo(
    () => ({
      name: currentProduct?.name || '',
      description: currentProduct?.description || '',
      subDescription: currentProduct?.subDescription || '',
      client_id: currentProduct?.client_id || '',
      images: currentProduct?.images || [],
      //
      code: currentProduct?.code || '',
      sku: currentProduct?.sku || '',
      price: currentProduct?.price || 0,
      quantity: currentProduct?.quantity || 0,
      available: currentProduct?.quantity || 0,
      priceSale: currentProduct?.priceSale || 0,
      tags: currentProduct?.tags || [],
      taxes: currentProduct?.taxes || 0,
      gender: currentProduct?.gender || '',
      category: currentProduct?.category || '',
      colors: currentProduct?.colors || [],
      sizes: currentProduct?.sizes || [],
      publish: currentProduct?.publish === "published",
      newLabel: currentProduct?.newLabel || { enabled: false, content: '' },
      saleLabel: currentProduct?.saleLabel || { enabled: false, content: '' },
    }),
    [currentProduct]
  );

  const methods = useForm({
    resolver: yupResolver(NewProductSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useEffect(() => {
    if (currentProduct) {
      reset(defaultValues);
    }
  }, [currentProduct, defaultValues, reset]);

  useEffect(() => {
    if (includeTaxes) {
      setValue('taxes', 0);
    } else {
      setValue('taxes', currentProduct?.taxes || 0);
    }
  }, [currentProduct?.taxes, includeTaxes, setValue]);

  const calculateInventoryType = ({ quantity, available }: { quantity: number, available: number }) => {
    if (quantity === 0 || available === 0) {
      return 'out of stock';
    }
    const t = (available * 100) / quantity;
    if (t < 1) {
      return 'out of stock';
    } if (t < 20) {
      return 'low stock';
    }
    return 'in stock';
  }


  const onSubmit = handleSubmit(async (data) => {
    try {
      const inventoryType = calculateInventoryType({ quantity: data.quantity, available: data.available });
      // @ts-expect-error expected
      let product: IProductItem = {
        _id: currentProduct?._id || "",
        ...data,
        stockAssigned: 0,
        inventoryType,
        publish: data?.publish ? "published" : "draft",
        saleLabel: {
          enabled: data.saleLabel.enabled ?? false,
          content: data.saleLabel.content ?? ""
        },
        newLabel: {
          enabled: data.newLabel.enabled ?? false,
          content: data.newLabel.content ?? ""
        }
      }
      if (!currentUser) {
        console.error('No user is currently logged in.');
        return { error: 'You must be logged in to upload files.' };
      }

      // Check if `data.images` exists and is an array before proceeding
      if (data.images && Array.isArray(data.images)) {
        console.log(data.images, 'IMAGES')
        // @ts-expect-error expected
        const imageObj = await uploadImages({ images: data.images }, currentUser);
        product = {
          ...product,
          images: imageObj.images,
          coverUrl: imageObj.images[0]
        };
      } else {
        console.log('No images to upload');
        // Handle the case where there are no images to upload
        // Proceed with the submission of the rest of the form data as necessary
      }

      if (currentProduct) {
        await updateProduct(product)
        enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
        reset();
        router.push(paths.dashboard.product.root);
        return await new Promise((resolve) => setTimeout(resolve, 500));
      }

      await saveProduct({
        ...product,
        totalRatings: 0,
        totalReviews: 0,
        totalSold: 0,
        reviews: [],
        ratings: []
      })

      enqueueSnackbar(currentProduct ? 'Update success!' : 'Create success!');
      reset();
      router.push(paths.dashboard.product.root);
      console.info('DATA', data);
      return await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(error);
      enqueueSnackbar(currentProduct ? 'Update error!' : 'Create error!', { variant: "error" });
      return await new Promise((resolve) => setTimeout(resolve, 500));

    }
  });

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = values.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.images]
  );

  const handleRemoveFile = useCallback(
    (inputFile: File | string) => {
      const filtered = values.images && values.images?.filter((file) => file !== inputFile);
      setValue('images', filtered);
    },
    [setValue, values.images]
  );

  const handleRemoveAllFiles = useCallback(() => {
    setValue('images', []);
  }, [setValue]);

  const handleChangeIncludeTaxes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setIncludeTaxes(event.target.checked);
  }, []);

  const renderDetails = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Details
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Title, short description, image...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Details" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField name="name" label="Product Name" />

            <RHFTextField name="subDescription" label="Sub Description" multiline rows={4} />

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Content</Typography>
              <RHFEditor simple name="description" />
            </Stack>

            <Stack spacing={1.5}>
              <Typography variant="subtitle2">Images</Typography>
              <RHFUpload
                multiple
                thumbnail
                name="images"
                maxSize={3145728}
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
                onUpload={() => console.info('ON UPLOAD')}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderProperties = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Properties
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Additional functions and attributes...
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Properties" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <Box
              columnGap={2}
              rowGap={3}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
              }}
            >
              <RHFAutocomplete
                name="client_id"
                label="Client"
                placeholder="Select client"
                loading={loading}
                freeSolo
                options={clients?.map(clnt => clnt._id?.toString()) ?? []}
                getOptionLabel={(option) => {
                  const client = clients?.find((clnt) => clnt._id?.toString() === option);
                  if (client) {
                    return client?.name
                  }
                  return option
                }}
                renderOption={(props, option) => {
                  const client = clients?.filter(
                    (clnt) => clnt._id?.toString() === option
                  )[0];

                  if (!client?._id) {
                    return null;
                  }

                  return (
                    <li {...props} key={client?._id?.toString()}>
                      {client?.name}
                    </li>
                  );
                }}
                renderTags={(selected, getTagProps) =>
                  selected.map((option, index) => {
                    const user = clients?.find((clnt) => clnt._id?.toString() === option);
                    return (
                      <Chip
                        {...getTagProps({ index })}
                        key={user?._id?.toString() ?? ""}
                        label={user?.name ?? ""}
                        size="small"
                        color="info"
                        variant="soft"
                      />
                    )
                  })
                }
              />
              <RHFTextField name="code" label="Product Code" />

              <RHFTextField name="sku" label="Product SKU" />

              <RHFTextField
                name="quantity"
                label="Quantity"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFTextField
                name="available"
                label="Available"
                placeholder="0"
                type="number"
                InputLabelProps={{ shrink: true }}
              />

              <RHFSelect native name="category" label="Category" InputLabelProps={{ shrink: true }}>
                {PRODUCT_CATEGORY_GROUP_OPTIONS.map((category) => (
                  <optgroup key={category.group} label={category.group}>
                    {category.classify.map((classify) => (
                      <option key={classify} value={classify}>
                        {classify}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </RHFSelect>

              <RHFMultiSelect
                checkbox
                name="colors"
                label="Colors"
                options={PRODUCT_COLOR_NAME_OPTIONS}
              />

              <RHFMultiSelect checkbox name="sizes" label="Sizes" options={PRODUCT_SIZE_OPTIONS} />
            </Box>

            <RHFAutocomplete
              name="tags"
              label="Tags"
              placeholder="+ Tags"
              multiple
              freeSolo
              options={_tags.map((option) => option)}
              getOptionLabel={(option) => option}
              renderOption={(props, option) => (
                <li {...props} key={option}>
                  {option}
                </li>
              )}
              renderTags={(selected, getTagProps) =>
                selected.map((option, index) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    label={option}
                    size="small"
                    color="info"
                    variant="soft"
                  />
                ))
              }
            />

            <Stack spacing={1}>
              <Typography variant="subtitle2">Gender</Typography>
              <RHFMultiCheckbox row name="gender" spacing={2} options={PRODUCT_GENDER_OPTIONS} />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="saleLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="saleLabel.content"
                label="Sale Label"
                fullWidth
                disabled={!values.saleLabel?.enabled}
              />
            </Stack>

            <Stack direction="row" alignItems="center" spacing={3}>
              <RHFSwitch name="newLabel.enabled" label={null} sx={{ m: 0 }} />
              <RHFTextField
                name="newLabel.content"
                label="New Label"
                fullWidth
                disabled={!values.newLabel?.enabled}
              />
            </Stack>
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderPricing = (
    <>
      {mdUp && (
        <Grid md={4}>
          <Typography variant="h6" sx={{ mb: 0.5 }}>
            Pricing
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Price related inputs
          </Typography>
        </Grid>
      )}

      <Grid xs={12} md={8}>
        <Card>
          {!mdUp && <CardHeader title="Pricing" />}

          <Stack spacing={3} sx={{ p: 3 }}>
            <RHFTextField
              name="price"
              label="Regular Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <RHFTextField
              name="priceSale"
              label="Sale Price"
              placeholder="0.00"
              type="number"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Box component="span" sx={{ color: 'text.disabled' }}>
                      $
                    </Box>
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={<Switch checked={includeTaxes} onChange={handleChangeIncludeTaxes} />}
              label="Price includes taxes"
            />

            {!includeTaxes && (
              <RHFTextField
                name="taxes"
                label="Tax (%)"
                placeholder="0.00"
                type="number"
                InputLabelProps={{ shrink: true }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box component="span" sx={{ color: 'text.disabled' }}>
                        %
                      </Box>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          </Stack>
        </Card>
      </Grid>
    </>
  );

  const renderActions = (
    <>
      {mdUp && <Grid md={4} />}
      <Grid xs={12} md={8} sx={{
        display: 'flex', alignItems: 'center', justifyContent: "space-between"
      }}>
        < RHFSwitch
          name="publish"
          label="Publish"
          defaultChecked
          sx={{ flexGrow: 1, pl: 3 }}
        />

        <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
          {!currentProduct ? 'Create Product' : 'Save Changes'}
        </LoadingButton>
      </Grid>
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        {renderDetails}

        {renderProperties}

        {renderPricing}

        {renderActions}
      </Grid>
    </FormProvider>
  );
}
