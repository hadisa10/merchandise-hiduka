import { isObject, isString } from 'lodash';
import React, { useMemo, useState, ReactNode } from 'react';

import { Box, Stack, Avatar, Button, Divider, Typography, ButtonOwnProps } from '@mui/material';
import {
  GridApi,
  DataGrid,
  GridColDef,
  GridRowModel,
  GridRowParams,
  GridRowIdGetter,
  useGridApiContext,
  GridFilterOperator,
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
  filterOperators?: GridFilterOperator<any>[];
  valueOptions?: Array<{ value: string; label: string; color: LabelColor }>;
  action?: IColumnActions; // Define this type based on your action handlers. Consider making this generic too if needed.
  order?: number;
}

interface IColumnAction {
  label: string;
  icon: string; // Assuming the icon is specified as a string identifier for Iconify
  color?: string;
  variant?: ButtonOwnProps["variant"];
  action: (id: string) => void;
}

interface IColumnActions {
  [actionName: string]: IColumnAction;
}

interface ISelectedColumnAction<RowType> {
  label: string;
  icon: string; // Assuming the icon is specified as a string identifier for Iconify
  color?: ButtonOwnProps["color"];
  variant?: ButtonOwnProps["variant"];
  action: (rows: RowType[]) => void;
}

interface ISelectedColumnActions<RowType> {
  [actionName: string]: ISelectedColumnAction<RowType>;
}

interface ISelectedColumnFilter {
  [actionName: string]: ReactNode;
}

type IColumnsArray<T> = IGenericColumn<T>[];

// Updated props interface to include the columns array
interface DataGridFlexibleProps<RowType extends GridRowModel> {
  data: RowType[];
  getRowIdFn: GridRowIdGetter<RowType>;
  columns: IColumnsArray<RowType>;
  title: string;
  loading?: boolean;
  hideColumn?: Record<string, boolean>;
  customActions?: ISelectedColumnActions<RowType>
  customFilters?: ISelectedColumnFilter;
}

// const renderActionsCell = (params: GridRowParams<any>, actions?: IColumnActions) => {
//   const { id } = params
//   return [

//     <GridActionsCellItem
//       icon={<Iconify icon="solar:eye-bold" />}
//       label="View"
//       onClick={() => actions?.view(id.toString())}
//       showInMenu
//     />,
//     <GridActionsCellItem
//       icon={<Iconify icon="solar:pen-bold" />}
//       label="Edit"
//       onClick={() => actions?.edit(id.toString())}
//       showInMenu
//     />,
//     <GridActionsCellItem
//       icon={<Iconify icon="solar:trash-bin-trash-bold" />}
//       label="Delete"
//       onClick={() => actions?.delete(id.toString())}
//       showInMenu
//       sx={{ color: 'error.main' }}
//     />
//   ]
// };


const renderActionsCell = (params: GridRowParams<any>, actions?: IColumnActions) => {
  const { id } = params;

  // Convert the actions object to an array of its values
  const actionItems = actions ? Object.values(actions).map((action) => (
    <GridActionsCellItem
      component={Button}
      icon={<Iconify icon={action.icon} />}
      label={action.label}
      color="error"
      onClick={() => action.action(id.toString())}
      showInMenu
    />
  )) : [];

  return actionItems;
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

const renderImageCell = (params: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => {
  const { value } = params;
  return <Avatar alt={value} src={value} sx={{ width: 36, height: 36 }} variant='rounded' />
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
        minWidth: column.minWidth ?? 200
      };
      if (column.filterOperators) {
        baseColDef.filterOperators = column.filterOperators
      }

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
        case 'image':
          return { ...baseColDef, renderCell: renderImageCell };
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



const customExportCsv = (apiRef: React.MutableRefObject<GridApi>, title: string) => {
  console.log(apiRef.current.exportDataAsCsv({ fileName: title }), 'CURRENT');
  return true;
};



// The DataGridFlexible component
export default function DataGridFlexible<RowType extends GridRowModel>({
  data: rows,
  getRowIdFn,
  columns: columnsArray,
  hideColumn,
  loading,
  title,
  customActions,
  customFilters
}: DataGridFlexibleProps<RowType>) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedRows, setSelectedRows] = useState<RowType[]>([]);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState<GridColumnVisibilityModel>(isObject(hideColumn) ? hideColumn : {});

  const columns = useMemo(() => generateDynamicColumns(columnsArray), [columnsArray]);

  const handleSelectionModelChange = (selectionModel: GridRowSelectionModel) => {
    // Map selected IDs to full row data
    const selectedData = selectionModel.map(id => rows.find(row => getRowIdFn(row) === id)).filter(Boolean) as RowType[];
    setSelectedRows(selectedData);
  };

  return (
    <DataGrid
      getRowId={getRowIdFn}
      checkboxSelection
      disableRowSelectionOnClick
      rows={rows}
      columns={columns}
      loading={loading}
      onRowSelectionModelChange={handleSelectionModelChange}
      columnVisibilityModel={columnVisibilityModel}
      onColumnVisibilityModelChange={setColumnVisibilityModel}
      slots={{
        toolbar: () => <CustomToolbar title={title} selectedRows={selectedRows} customActions={customActions} customFilters={customFilters} />,
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

function CustomToolbar<RowType>({ title, selectedRows, customActions, customFilters }: { title: string, selectedRows: RowType[], customActions?: ISelectedColumnActions<RowType>, customFilters?: ISelectedColumnFilter }) {
  const gridApiRef = useGridApiContext();
  return (
    <>
      {/* Main Toolbar Container */}
      <GridToolbarContainer>
        <Stack direction="row" spacing={2}>
          <GridToolbarQuickFilter />
          {
            customFilters &&
            Object.values(customFilters).map(customFilter => customFilter)
          }
        </Stack>
        <Box sx={{ flexGrow: 1 }} />
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <Button
          startIcon={<Iconify icon="solar:export-broken" />}
          onClick={() => customExportCsv(gridApiRef, title)}
        >
          Export
        </Button>
      </GridToolbarContainer>

      {/* Custom Actions Container */}
      {customActions && selectedRows.length > 0 && (
        <Stack sx={{ px: 2, pt: 0, pb: 1, width: "100%" }} spacing={1}> {/* Adjust the margins/padding as needed */}
          <Divider><Typography variant='caption' color="text.secondary">bulk actions</Typography></Divider>
          <Stack direction="row" spacing={1} width="100%"> {/* Ensure there's some spacing between each button */}
            {Object.values(customActions).map((customAction) => (
              <Button
                key={customAction.label}
                size='small'
                sx={{ width: "max-content" }}
                variant={customAction.variant ?? "soft"}
                color={customAction.color ?? "info"}
                startIcon={<Iconify icon={customAction.icon} />} // Ensure you have a mapping for these icons
                onClick={() => customAction.action(selectedRows)}
              >
                {customAction.label.charAt(0).toUpperCase() + customAction.label.slice(1)}
              </Button>
            ))}
          </Stack>
          <Divider />
        </Stack>
      )}
    </>
  );
}