'use client';

import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { IconButton } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  DataGrid,
  GridColDef,
  GridToolbarExport,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { RHFTextField } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';

import { ICampaign } from 'src/types/realm/realm-types';
import { ICampaignTableFilters, ICampaignTableFilterValue } from 'src/types/campaign';

import CampaignTableToolbar from './campaign-table-toolbar';
import CampaignReportTableFiltersResult from './campaign-table-filters-result';
import {
  // RenderCellStock,
  // RenderCellPrice,
  RenderCellCheckin,
  RenderCellCampaign,
  RenderCellCreatedAt,
} from './campaign-table-row';

// ----------------------------------------------------------------------

const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'rsm', label: 'RSM' },
  { value: 'activation', label: 'Activation' }
]

const defaultFilters: ICampaignTableFilters = {
  type: [],
  // activation: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

export default function CampaignListDataGrid() {
  const { enqueueSnackbar } = useSnackbar();

  const { loading, campaigns } = useCampaigns();

  const showLoader = useShowLoader(loading, 200);

  const confirmRows = useBoolean();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  // const debouncedQuery = useDebounce(searchQuery);

  const [tableData, setTableData] = useState<ICampaign[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (campaigns.length) {
      setTableData(campaigns);
    }
  }, [campaigns]);

  useEffect(() => {
    if (searchQuery.length < 1) {
      setTableData(campaigns)
    } else {
      setTableData(campaigns.filter(cmpg => cmpg.title.toLowerCase().includes(searchQuery.toLowerCase())));
    }
  }, [searchQuery, campaigns])

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((title: string, value: ICampaignTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [title]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row._id.toString() !== id.toString());

      enqueueSnackbar('Delete success!');

      setTableData(deleteRow);
    },
    [enqueueSnackbar, tableData]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = tableData.filter((row) => !selectedRowIds.includes(row._id.toString()));

    enqueueSnackbar('Delete success!');

    setTableData(deleteRows);
  }, [enqueueSnackbar, selectedRowIds, tableData]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.campaign.edit(id));
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(paths.dashboard.campaign.edit(id));
    },
    [router]
  );

  const handleSearch = (inputValue: string) => {
    console.log(inputValue, 'INPUT VALUE')
    setSearchQuery(inputValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'category',
      headerName: 'Category',
      filterable: false,
    },
    {
      field: 'campaign',
      headerName: 'Campaign',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellCampaign params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'totalCheckins',
      headerName: 'Total Checkins',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellCheckin params={params} />,
    },
    // {
    //   field: 'inventoryType',
    //   headerName: 'Stock',
    //   width: 160,
    //   type: 'singleSelect',
    //   valueOptions: PRODUCT_STOCK_OPTIONS,
    //   renderCell: (params) => <RenderCellStock params={params} />,
    // },
    // {
    //   field: 'price',
    //   headerName: 'Price',
    //   width: 140,
    //   editable: true,
    //   renderCell: (params) => <RenderCellPrice params={params} />,
    // },
    // {
    //   field: 'publish',
    //   headerName: 'Publish',
    //   width: 110,
    //   type: 'singleSelect',
    //   editable: true,
    //   valueOptions: PUBLISH_OPTIONS,
    //   renderCell: (params) => <RenderCellPublish params={params} />,
    // },
    {
      type: 'actions',
      field: 'actions',
      headerName: ' ',
      align: 'right',
      headerAlign: 'right',
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      getActions: (params) => [
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:eye-bold" />}
          label="View"
          onClick={() => handleViewRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:pen-bold" />}
          label="Edit"
          onClick={() => handleEditRow(params.row._id)}
        />,
        <GridActionsCellItem
          showInMenu
          icon={<Iconify icon="solar:trash-bin-trash-bold" />}
          label="Delete"
          onClick={() => {
            handleDeleteRow(params.row._id);
          }}
          sx={{ color: 'error.main' }}
        />,
      ],
    },
  ];

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);
  const defaultValues = {
    search: '',
  };

  const methods = useForm({
    defaultValues,
  });

  const {
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleSearch(data.search)
    } catch (error) {
      console.error(error);
    }
  });
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>

      <Grid container spacing={3} height="100%">

        <Card
          sx={{
            height: { xs: 800, md: 600 },
            flexGrow: { md: 1 },
            display: { md: 'flex' },
            flexDirection: { md: 'column' },
          }}
        >
          <DataGrid
            checkboxSelection
            disableRowSelectionOnClick
            rows={dataFiltered}
            columns={columns}
            loading={showLoader}
            getRowHeight={() => 'auto'}
            getEstimatedRowHeight={() => 150}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row) => row._id}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            onRowSelectionModelChange={(newSelectionModel) => {
              setSelectedRowIds(newSelectionModel);
            }}
            columnVisibilityModel={columnVisibilityModel}
            onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <CampaignTableToolbar
                      filters={filters}
                      onFilters={handleFilters}
                      typeOptions={CAMPAIGN_TYPE_OPTIONS}
                    />
                    <Stack direction="row" spacing={3} alignItems="center">
                      <RHFTextField name='search' placeholder='Search Campaigns' onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          onSubmit(); // Trigger the search function
                        }
                      }} />
                      <IconButton type='submit' sx={{ height: "max-content" }}>
                        <Iconify icon="eva:search-fill" />
                      </IconButton>
                    </Stack>

                    {/* <GridToolbarQuickFilter /> */}
                    <GridToolbarDensitySelector />
                    <Stack
                      spacing={1}
                      flexGrow={1}
                      direction="row"
                      alignItems="center"
                      justifyContent="flex-end"
                    >
                      {!!selectedRowIds.length && (
                        <Button
                          size="small"
                          color="error"
                          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                          onClick={confirmRows.onTrue}
                        >
                          Delete ({selectedRowIds.length})
                        </Button>
                      )}

                      <GridToolbarColumnsButton />
                      <GridToolbarFilterButton />
                      <GridToolbarExport />
                    </Stack>
                  </GridToolbarContainer>

                  {canReset && (
                    <CampaignReportTableFiltersResult
                      filters={filters}
                      onFilters={handleFilters}
                      onResetFilters={handleResetFilters}
                      results={dataFiltered.length}
                      sx={{ p: 2.5, pt: 0 }}
                    />
                  )}
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="No Data" />,
              noResultsOverlay: () => <EmptyContent title="No results found" />,
            }}
            slotProps={{
              columnsPanel: {
                getTogglableColumns,
              },
            }}
          />
        </Card>
        <ConfirmDialog
          open={confirmRows.value}
          onClose={confirmRows.onFalse}
          title="Delete"
          content={
            <>
              Are you sure want to delete <strong> {selectedRowIds.length} </strong> items?
            </>
          }
          action={
            <Button
              variant="contained"
              color="error"
              onClick={() => {
                handleDeleteRows();
                confirmRows.onFalse();
              }}
            >
              Delete
            </Button>
          }
        />
      </Grid>
    </FormProvider>
  );
}

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: ICampaign[];
  filters: ICampaignTableFilters;
}) {
  const { type } = filters;

  if (type.length) {
    inputData = inputData.filter((campaign) => type.map(x => x.toLowerCase()).includes(campaign.type.toLowerCase()));
  }

  return inputData;
}
