import { saveAs } from 'file-saver';
import { isObject, isString } from 'lodash';
import React, { useMemo, useState } from 'react';

import { Box, Stack, Avatar, Button, Typography } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowParams,
  GridRowIdGetter,
  useGridApiContext,
  GridActionsCellItem,
  GridToolbarContainer,
  GridRenderCellParams,
  GridRowSelectionModel,
  GridToolbarQuickFilter,
  GridTreeNodeWithRender,
  GridToolbarFilterButton,
  GridToolbarColumnsButton,
  GridColumnVisibilityModel,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import { fDate } from 'src/utils/format-time';

import EmptyContent from 'src/components/empty-content/empty-content';

import Iconify from '../iconify';
import Label, { LabelColor } from '../label';


interface IColumnValueOption {
  value: any; // The value to match
  label: string; // The label to display
  color?: LabelColor; // Optional color for the label
}
// Updated interface for column definitions
export interface IColumn {
  field: string;
  label: string;
  order: number;
  type: string;
  minWidth?: number;
  valueOptions?: IColumnValueOption[]
  action?: IColumnActions
}

export interface IGenericColumn<T> {
  field: keyof T | "actions";
  label: string;
  type: string;
  minWidth?: number;
  valueOptions?: Array<{ value: string; label: string; color: LabelColor }>;
  action?: any; // Define this type based on your action handlers. Consider making this generic too if needed.
  order?: number;
}

export interface IColumnActions {
  view: (id: string) => void;
  edit: (id: string) => void;
  delete: (id: string) => void;
}


type IColumnsArray<T> = IGenericColumn<T>[];

// Updated props interface to include the columns array
interface DataGridFlexibleProps<RowType extends GridRowModel> {
  data: RowType[];
  getRowIdFn: GridRowIdGetter<RowType>;
  columns: IColumnsArray<RowType>;
  title: string;
  hideColumn?: Record<string, boolean>;
}

const renderActionsCell = (params: GridRowParams<any>, actions?: IColumnActions) => {
  const { id } = params
  return [

    <GridActionsCellItem
      icon={<Iconify icon="solar:eye-bold" />}
      label="View"
      onClick={() => actions?.view(id.toString())}
      showInMenu
    />,
    <GridActionsCellItem
      icon={<Iconify icon="solar:pen-bold" />}
      label="Edit"
      onClick={() => actions?.edit(id.toString())}
      showInMenu
    />,
    <GridActionsCellItem
      icon={<Iconify icon="solar:trash-bin-trash-bold" />}
      label="Delete"
      onClick={() => actions?.delete(id.toString())}
      showInMenu
      sx={{ color: 'error.main' }}
    />
  ]
};


const renderMainCell = <T,>(params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>, column?: IGenericColumn<T>) => {
  const { value } = params;
  return (
    <Stack spacing={2} direction="row" alignItems="center" sx={{ minWidth: 0 }}>
      <Avatar alt={value} sx={{ width: 36, height: 36 }} variant='rounded'>
        {isString(value) && value.charAt(0).toUpperCase()}
      </Avatar>
      <Typography component="span" variant="body2" noWrap>
        {value}
      </Typography>
    </Stack>
  )
};

const renderSelectCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>, valueOptions: IColumnValueOption[] | undefined) => {
  const { value } = params;
  if (Array.isArray(valueOptions)) {
    const matchedOption = valueOptions.find(option => option.value === value);
    if (matchedOption) {
      // If there's a matched option, you can use its label and color for rendering
      return (
        <Label
          variant="soft"
          color={matchedOption.color ?? "info"}
          sx={{ mx: 'auto' }}
        >
          {value}
        </Label>
      );
    }
  }
  return (
    <Label
      variant="soft"
      color="default"
      sx={{ mx: 'auto' }}
    >
      {value}
    </Label>
  )
};

const renderBooleanCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return (
    value ? (
      <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
    ) : (
      '-'
    )
  )
}

const renderNumberCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{value}</Typography>;
}

const renderStringCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{value}</Typography>;
}

const renderArrayCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{Array.isArray(value) && value.join(",")}</Typography>;
}

const renderDateCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{fDate(value)}</Typography>;
}
const renderObjectCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{JSON.stringify(value)}</Typography>;
}

const renderDefaultCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Typography variant='body2'>{JSON.stringify(value)}</Typography>;
}
// Function to generate dynamic columns based on the columns array
function generateDynamicColumns<RowType>(columnsArray: IColumnsArray<RowType>): GridColDef[] {
  return columnsArray
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((column) => {
      const baseColDef: GridColDef = {
        field: String(column.field),
        headerName: column.label,
        flex: 1,
        minWidth: column.minWidth ?? 200,
      };

      // Conditional rendering logic based on column.type
      switch (column.type) {

        case 'main':
          return { ...baseColDef, renderCell: (params) => renderMainCell(params, column) };
        case 'select':
          return { ...baseColDef, renderCell: (params) => renderSelectCell(params, column.valueOptions) };
        case 'boolean':
          return { ...baseColDef, renderCell: renderBooleanCell };
        case 'number':
          return { ...baseColDef, renderCell: renderNumberCell };
        case 'string':
          return { ...baseColDef, renderCell: renderStringCell };
        case 'array':
          return { ...baseColDef, renderCell: renderArrayCell };
        case 'date':
          return { ...baseColDef, renderCell: renderDateCell };
        case 'object':
          return { ...baseColDef, renderCell: renderObjectCell };
        case 'actions': // Add this case for actions
          return {
            ...baseColDef,
            type: 'actions',
            field: 'actions',
            headerName: 'Actions',
            align: 'right',
            headerAlign: 'right',
            minWidth: 80,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            getActions: (params) => renderActionsCell(params, column?.action),
          };
        default:
          return { ...baseColDef, renderCell: renderDefaultCell };
      }
    });
}


// This function handles the CSV content creation and triggers the download
const customExportCsv = (apiRef: React.MutableRefObject<GridApi>, columns: GridColDef[], title: string) => {
  const columnHeaders = apiRef.current.getAllColumns().map((col: GridColDef) => col.field);
  const csvRows = [columnHeaders.join(',')]; // First row for column headers
  console.log(columnHeaders, 'HEADERS');

  apiRef.current.getAllRowIds().forEach((id) => {
    const row = apiRef.current.getRow(id) as any;
    const csvRow = columnHeaders.filter(x => x !== "_check__").map(field => {
      console.log(field, "FIELD");
      const cellValue = row[field];
      if (cellValue === undefined) {
        return '""'; // Represent undefined values as empty strings in the CSV
      } if (Array.isArray(cellValue)) {
        // Convert array to a string representation, joined by a character like "; "
        return `"${cellValue.join('; ')}"`; // Enclose in quotes to ensure commas in values don't break CSV format
      } 
        // Handle internal quotes and enclose values in quotes, convert null or other types to string
        return `"${(cellValue ?? '').toString().replace(/"/g, '""')}"`;
      
    }).join(',');
    csvRows.push(csvRow);
  });

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'data-grid-export.csv');
};



// The DataGridFlexible component
export default function DataGridFlexible<RowType extends GridRowModel>({
  data: rows,
  getRowIdFn,
  columns: columnsArray,
  hideColumn,
  title
}: DataGridFlexibleProps<RowType>) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(isObject(hideColumn) ? hideColumn : {});

  const columns = useMemo(() => generateDynamicColumns(columnsArray), [columnsArray]);

  return (
    <DataGrid
      getRowId={getRowIdFn}
      checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      onRowSelectionModelChange={setSelectedRows}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      slots={{
        toolbar: () => <CustomToolbar columns={columns} title={title}/>,
        noRowsOverlay: () => <EmptyContent title="No Data" />,
        noResultsOverlay: () => <EmptyContent title="No results found" />,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
      }}
    />
  );
}

// CustomToolbar component
function CustomToolbar({columns, title}:{columns: GridColDef[], title: string}) {
  const gridT = useGridApiContext();
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Button
        startIcon={
          <Iconify icon="solar:export-broken" />}
        onClick={() => customExportCsv(gridT, columns, title)}
      >
        Export
      </Button>
      {/* <GridToolbarExport /> */}
    </GridToolbarContainer>
  );
}


// const baseColumns: GridColDef[] = [
//   {
//     field: 'id',
//     headerName: 'Id',
//     filterable: false,
//   },
//   {
//     field: 'name',
//     headerName: 'Name',
//     flex: 1,
//     minWidth: 160,
//     hideable: false,
//     renderCell: (params) => (
//       <Stack spacing={2} direction="row" alignItems="center" sx={{ minWidth: 0 }}>
//         <Avatar alt={params.row.name} sx={{ width: 36, height: 36 }}>
//           {params.row.name.charAt(0).toUpperCase()}
//         </Avatar>
//         <Typography component="span" variant="body2" noWrap>
//           {params.row.name}
//         </Typography>
//       </Stack>
//     ),
//   },
//   {
//     field: 'email',
//     headerName: 'Email',
//     flex: 1,
//     minWidth: 160,
//     editable: true,
//     renderCell: (params) => (
//       <Link color="inherit" noWrap>
//         {params.row.email}
//       </Link>
//     ),
//   },
//   {
//     type: 'dateTime',
//     field: 'lastLogin',
//     headerName: 'Last login',
//     align: 'right',
//     headerAlign: 'right',
//     width: 120,
//     renderCell: (params) => (
//       <Stack sx={{ textAlign: 'right' }}>
//         <Box component="span">{fDate(params.row.lastLogin)}</Box>
//         <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
//           {fTime(params.row.lastLogin)}
//         </Box>
//       </Stack>
//     ),
//   },
//   {
//     type: 'number',
//     field: 'rating',
//     headerName: 'Rating',
//     width: 140,
//     renderCell: (params) => (
//       <Rating size="small" value={params.row.rating} precision={0.5} readOnly />
//     ),
//   },
//   {
//     type: 'singleSelect',
//     field: 'status',
//     headerName: 'Status',
//     align: 'center',
//     headerAlign: 'center',
//     width: 100,
//     editable: true,
//     valueOptions: ['online', 'alway', 'busy'],
//     renderCell: (params) => (
//       <Label
//         variant="soft"
//         color={
//           (params.row.status === 'busy' && 'error') ||
//           (params.row.status === 'alway' && 'warning') ||
//           'success'
//         }
//         sx={{ mx: 'auto' }}
//       >
//         {params.row.status}
//       </Label>
//     ),
//   },
//   {
//     type: 'boolean',
//     field: 'isAdmin',
//     align: 'center',
//     headerAlign: 'center',
//     width: 80,
//     renderCell: (params) =>
//       params.row.isAdmin ? (
//         <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
//       ) : (
//         '-'
//       ),
//   },
//   {
//     type: 'number',
//     field: 'performance',
//     headerName: 'Performance',
//     align: 'center',
//     headerAlign: 'center',
//     width: 160,
//     renderCell: (params) => (
//       <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 1, width: 1, height: 1 }}>
//         <LinearProgress
//           value={params.row.performance}
//           variant="determinate"
//           color={
//             (params.row.performance < 30 && 'error') ||
//             (params.row.performance > 30 && params.row.performance < 70 && 'warning') ||
//             'primary'
//           }
//           sx={{ width: 1, height: 6 }}
//         />
//         <Typography variant="caption" sx={{ width: 80 }}>
//           {fPercent(params.row.performance)}
//         </Typography>
//       </Stack>
//     ),
//   },
//   {
//     type: 'actions',
//     field: 'actions',
//     headerName: 'Actions',
//     align: 'right',
//     headerAlign: 'right',
//     width: 80,
//     sortable: false,
//     filterable: false,
//     disableColumnMenu: true,
//     getActions: (params) => [
//       <GridActionsCellItem
//         showInMenu
//         icon={<Iconify icon="solar:eye-bold" />}
//         label="View"
//         onClick={() => console.info('VIEW', params.row.id)}
//       />,
//       <GridActionsCellItem
//         showInMenu
//         icon={<Iconify icon="solar:pen-bold" />}
//         label="Edit"
//         onClick={() => console.info('EDIT', params.row.id)}
//       />,
//       <GridActionsCellItem
//         showInMenu
//         icon={<Iconify icon="solar:trash-bin-trash-bold" />}
//         label="Delete"
//         onClick={() => console.info('DELETE', params.row.id)}
//         sx={{ color: 'error.main' }}
//       />,
//     ],
//   },
// ];