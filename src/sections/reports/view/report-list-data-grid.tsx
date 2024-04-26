'use client';

import isEqual from 'lodash/isEqual';
import { useForm } from 'react-hook-form';
import { isEmpty, isString } from 'lodash';
import { FC, memo, useMemo, useState, useEffect, useCallback } from 'react';

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

import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useRolePath } from 'src/hooks/use-path-role';
import { useReports } from 'src/hooks/realm/report/use-report-graphql';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content';
import { RHFTextField } from 'src/components/hook-form';
import { ConfirmDialog } from 'src/components/custom-dialog';
import FormProvider from 'src/components/hook-form/form-provider';

import { IReport } from 'src/types/realm/realm-types';
import { IReportTableFilters, IReportTableFilterValue } from 'src/types/report';

import ReportTableToolbar from '../reports-component/report-table-toolbar';
import ReportTableFiltersResult from '../reports-component/report-table-filters-result';
import {
  // RenderCellStock,
  RenderCellReport,
  // RenderCellPrice,
  RenderCellResponses,
  RenderCellCreatedAt,
} from '../reports-component/report-table-row';

// ----------------------------------------------------------------------

const CAMPAIGN_TYPE_OPTIONS = [
  { value: 'rsm', label: 'RSM' },
  { value: 'activation', label: 'Activation' },
];

const defaultFilters: IReportTableFilters = {
  type: [],
  // activation: [],
};

const HIDE_COLUMNS = {
  category: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['category', 'actions'];

// ----------------------------------------------------------------------

const ReportListDataGrid: FC<{ id?: string }> = ({ id }) => {
  const { enqueueSnackbar } = useSnackbar();

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [callReport, setCallReport] = useState(isString(id))

  const callReport = useMemo(() => isString(id), [id]);

  const { getCampaignReport, loading: mainLoading, reports: mainReports } = useReports(callReport);

  const loadingReport = useBoolean();

  const [reports, setReports] = useState<IReport[]>([]);

  // eslint-disable-next-line
  const [reportError, setReportsError] = useState(null);

  const loading = useMemo(() => {
    if (isString(id)) {
      return loadingReport.value;
    }
    return mainLoading;
  }, [mainLoading, loadingReport.value, id]);

  useEffect(() => {
    if (isString(id) && !isEmpty(id)) {
      loadingReport.onTrue();
      setReportsError(null);
      getCampaignReport(id.toString())
        .then((res) => {
          setReportsError(null);
          setReports(res);
        })
        .catch((e) => {
          enqueueSnackbar('Failed to fetch campaign reports', { variant: 'error' });
          setReportsError(e.message);
          console.error(e, 'REPORT FETCH');
        })
        .finally(() => {
          loadingReport.onFalse();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (!isString(id)) {
      setReports(mainReports);
    }
  }, [id, mainReports]);

  const showLoader = useShowLoader(loading, 200);

  const confirmRows = useBoolean();

  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');

  const debouncedQuery = useDebounce(searchQuery);

  const [tableData, setTableData] = useState<IReport[]>([]);

  const [filters, setFilters] = useState(defaultFilters);

  const [selectedRowIds, setSelectedRowIds] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  useEffect(() => {
    if (Array.isArray(reports)) {
      console.log(debouncedQuery, 'DEBOUNCE');
      if (debouncedQuery) {
        setTableData(reports.filter((rep) => rep.title.toLowerCase().includes(debouncedQuery)));
      } else {
        setTableData(reports);
      }
    }
  }, [reports, debouncedQuery]);

  const dataFiltered = applyFilter({
    inputData: tableData,
    filters,
  });

  const canReset = !isEqual(defaultFilters, filters);

  const handleFilters = useCallback((title: string, value: IReportTableFilterValue) => {
    setFilters((prevState) => ({
      ...prevState,
      [title]: value,
    }));
  }, []);

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleDeleteRow = useCallback(
    (_id: string) => {
      const deleteRow = tableData.filter((row) => row._id.toString() !== _id.toString());

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

  const rolePath = useRolePath();

  const handleEditRow = useCallback(
    (_id: string) => {
      // @ts-expect-error expected
      router.push(rolePath?.report.edit(_id));
    },
    [router, rolePath]
  );

  const handleViewRow = useCallback(
    (_id: string) => {
      // @ts-expect-error expected
      router.push(rolePath?.report.edit(_id));
    },
    [router, rolePath]
  );

  const handleSearch = (inputValue: string) => {
    setSearchQuery(inputValue);
  };

  const columns: GridColDef[] = [
    {
      field: 'category',
      headerName: 'Category',
      filterable: false,
    },
    {
      field: 'report',
      headerName: 'Report',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellReport params={params} />,
    },
    {
      field: 'createdAt',
      headerName: 'Create at',
      width: 160,
      renderCell: (params) => <RenderCellCreatedAt params={params} />,
    },
    {
      field: 'responses',
      headerName: 'Total Responses',
      flex: 1,
      minWidth: 360,
      hideable: false,
      renderCell: (params) => <RenderCellResponses params={params} />,
    },
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

  const { handleSubmit } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      handleSearch(data.search);
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
            getRowId={(row) => row._id.toString()}
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
                    <ReportTableToolbar
                      filters={filters}
                      onFilters={handleFilters}
                      typeOptions={CAMPAIGN_TYPE_OPTIONS}
                    />
                    <Stack direction="row" spacing={3} alignItems="center">
                      <RHFTextField
                        name="search"
                        placeholder="Search Reports"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            onSubmit(); // Trigger the search function
                          }
                        }}
                      />
                      <IconButton type="submit" sx={{ height: 'max-content' }}>
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
                    <ReportTableFiltersResult
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
};

// ----------------------------------------------------------------------

function applyFilter({
  inputData,
  filters,
}: {
  inputData: IReport[];
  filters: IReportTableFilters;
}) {
  const { type } = filters;

  if (type.length) {
    inputData = inputData.filter((report) =>
      type.map((x) => x.toLowerCase()).includes(report.title.toLowerCase())
    );
  }

  return inputData;
}

export default memo(ReportListDataGrid);
