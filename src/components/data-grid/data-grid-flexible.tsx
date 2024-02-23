import React, { useMemo, useState } from 'react';

import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowIdGetter,
  GridToolbarExport,
  GridToolbarContainer,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import EmptyContent from 'src/components/empty-content/empty-content';

// Additional imports remain the same

// Define generic types for rows and columns
interface DataGridFlexibleProps<RowType extends GridRowModel> {
  data: RowType[];
  getRowIdFn: GridRowIdGetter<RowType>
}

// ----------------------------------------------------------------------


function generateDynamicColumns<RowType extends GridRowModel>(data: RowType[]): GridColDef[] {
  if (data.length === 0) {
    return [];
  }

  const sampleRow = data[0];
  return Object.keys(sampleRow).map((key) => ({
    field: key,
    headerName: key.charAt(0).toUpperCase() + key.slice(1),
    flex: 1,
    minWidth: 200,
    renderCell: (params) => {
      const { value } = params;
      switch (typeof value) {
        case 'boolean':
          return <Typography variant='body2'>{value ? 'Yes' : 'No'}</Typography>;
        case 'number':
          return <Typography variant='body2'>{value}</Typography>;
        case 'object':
          if (value instanceof Date) {
            return <Typography variant='body2'>{fDate(value)}</Typography>;
          }
          return <Typography variant='body2'>{JSON.stringify(value)}</Typography>;
        default:
          return <Typography variant='body2'>{value}</Typography>;
      }
    }
  }));
}

const HIDE_COLUMNS = {
  _id: false,
};

const HIDE_COLUMNS_TOGGLABLE = ['_id', 'actions'];

// ----------------------------------------------------------------------


// Use these generic types in your component
export default function DataGridFlexible<RowType extends GridRowModel>({
  data: rows,
  getRowIdFn
}: DataGridFlexibleProps<RowType>) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] =
    useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

  const columns = useMemo(() => generateDynamicColumns(rows), [rows]);

  const getTogglableColumns = () =>
    columns
      .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
      .map((column) => column.field);

  // const selected = rows.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

  return (
    <DataGrid
      getRowId={getRowIdFn}
      checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={(newSelectionModel) => {
        setSelectedRows(newSelectionModel);
      }}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
      slots={{
        toolbar: CustomToolbar,
        noRowsOverlay: () => <EmptyContent title="No Data" />,
        noResultsOverlay: () => <EmptyContent title="No results found" />,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        columnsPanel: {
          getTogglableColumns,
        },
      }}
    />

  )

  // Component implementation remains largely the same
}

// ----------------------------------------------------------------------


function CustomToolbar() {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
    </GridToolbarContainer>
  );
}