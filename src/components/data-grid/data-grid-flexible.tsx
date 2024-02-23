// import React, { useMemo, useState } from 'react';

// import { Box } from '@mui/system';
// import { Typography } from '@mui/material';
// import {
//   DataGrid,
//   GridColDef,
//   GridRowModel,
//   GridRowIdGetter,
//   GridToolbarExport,
//   GridToolbarContainer,
//   GridRowSelectionModel,
//   GridToolbarQuickFilter,
//   GridToolbarFilterButton,
//   GridToolbarColumnsButton,
//   GridColumnVisibilityModel,
//   GridToolbarDensitySelector,
// } from '@mui/x-data-grid';

// import { fDate } from 'src/utils/format-time';

// import EmptyContent from 'src/components/empty-content/empty-content';

// // Additional imports remain the same

// // Define generic types for rows and columns
// interface DataGridFlexibleProps<RowType extends GridRowModel> {
//   data: RowType[];
//   getRowIdFn: GridRowIdGetter<RowType>
// }

// // ----------------------------------------------------------------------


// function generateDynamicColumns<RowType extends GridRowModel>(data: RowType[]): GridColDef[] {
//   if (data.length === 0) {
//     return [];
//   }

//   const sampleRow = data[0];
//   return Object.keys(sampleRow).map((key) => ({
//     field: key,
//     headerName: key.charAt(0).toUpperCase() + key.slice(1),
//     flex: 1,
//     minWidth: 200,
//     renderCell: (params) => {
//       const { value } = params;
//       switch (typeof value) {
//         case 'boolean':
//           return <Typography variant='body2'>{value ? 'Yes' : 'No'}</Typography>;
//         case 'number':
//           return <Typography variant='body2'>{value}</Typography>;
//         case 'object':
//           if (value instanceof Date) {
//             return <Typography variant='body2'>{fDate(value)}</Typography>;
//           }
//           return <Typography variant='body2'>{JSON.stringify(value)}</Typography>;
//         default:
//           return <Typography variant='body2'>{value}</Typography>;
//       }
//     }
//   }));
// }

// const HIDE_COLUMNS = {
//   _id: false,
// };

// const HIDE_COLUMNS_TOGGLABLE = ['_id', 'actions'];

// // ----------------------------------------------------------------------


// // Use these generic types in your component
// export default function DataGridFlexible<RowType extends GridRowModel>({
//   data: rows,
//   getRowIdFn
// }: DataGridFlexibleProps<RowType>) {
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [selectedRows, setSelectedRows] = useState<GridRowSelectionModel>([]);

//   const [columnVisibilityModel, setColumnVisibilityModel] =
//     useState<GridColumnVisibilityModel>(HIDE_COLUMNS);

//   const columns = useMemo(() => generateDynamicColumns(rows), [rows]);

//   const getTogglableColumns = () =>
//     columns
//       .filter((column) => !HIDE_COLUMNS_TOGGLABLE.includes(column.field))
//       .map((column) => column.field);

//   // const selected = rows.filter((row) => selectedRows.includes(row.id)).map((_row) => _row.id);

//   return (
//     <DataGrid
//       getRowId={getRowIdFn}
//       checkboxSelection
//       disableRowSelectionOnClick
//       rows={rows}
//       columns={columns}
//       onRowSelectionModelChange={(newSelectionModel) => {
//         setSelectedRows(newSelectionModel);
//       }}
//       columnVisibilityModel={columnVisibilityModel}
//       onColumnVisibilityModelChange={(newModel) => setColumnVisibilityModel(newModel)}
//       slots={{
//         toolbar: CustomToolbar,
//         noRowsOverlay: () => <EmptyContent title="No Data" />,
//         noResultsOverlay: () => <EmptyContent title="No results found" />,
//       }}
//       slotProps={{
//         toolbar: {
//           showQuickFilter: true,
//         },
//         columnsPanel: {
//           getTogglableColumns,
//         },
//       }}
//     />

//   )

//   // Component implementation remains largely the same
// }

// // ----------------------------------------------------------------------


// function CustomToolbar() {
//   return (
//     <GridToolbarContainer>
//       <GridToolbarQuickFilter />
//       <Box sx={{ flexGrow: 1 }} />
//       <GridToolbarColumnsButton />
//       <GridToolbarFilterButton />
//       <GridToolbarDensitySelector />
//       <GridToolbarExport />
//     </GridToolbarContainer>
//   );
// }



import { isObject, isString } from 'lodash';
import React, { useMemo, useState } from 'react';

import { Box, Stack, Avatar, Typography } from '@mui/material';
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
}

type IColumnsArray = IColumn[];

// Updated props interface to include the columns array
interface DataGridFlexibleProps<RowType extends GridRowModel> {
  data: RowType[];
  getRowIdFn: GridRowIdGetter<RowType>;
  columns: IColumnsArray;
  hideColumn?: Record<string, boolean>;
}

// Function to generate dynamic columns based on the columns array
function generateDynamicColumns(columnsArray: IColumnsArray): GridColDef[] {
  return columnsArray
    .sort((a, b) => a.order - b.order)
    .map((column) => ({
      field: column.field,
      headerName: column.label,
      valueOptions: Array.isArray(column.valueOptions) ? column.valueOptions.map(c => c.value) : [],
      flex: 1,
      minWidth: column.minWidth ?? 200,
      renderCell: (params) => {
        const { value } = params;
        switch (column.type) {
          case 'main':
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
          case 'select':
            if (Array.isArray(column.valueOptions)) {
              const matchedOption = column.valueOptions.find(option => option.value === value);
              if (matchedOption) {
                // If there's a matched option, you can use its label and color for rendering
                return (
                  <Label
                    variant="soft"
                    color={matchedOption.color}
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
          case 'boolean':
            return (
              value ? (
                <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
              ) : (
                '-'
              )
            )
          case 'number':
            return <Typography variant='body2'>{value}</Typography>;
          case 'array':
            return <Typography variant='body2'>{Array.isArray(value) && value.join(",")}</Typography>;
          case 'date':
            return <Typography variant='body2'>{fDate(new Date(value))}</Typography>;
          case 'object':
            return <Typography variant='body2'>{JSON.stringify(value)}</Typography>;
          default:
            return <Typography variant='body2'>{value}</Typography>;
        }
      },
    }));
}

// The DataGridFlexible component
export default function DataGridFlexible<RowType extends GridRowModel>({
  data: rows,
  getRowIdFn,
  columns: columnsArray,
  hideColumn
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
        toolbar: CustomToolbar,
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