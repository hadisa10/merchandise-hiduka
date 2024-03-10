import { Stack } from "@mui/system";
import { GridColDef, GridActionsCellItem } from "@mui/x-data-grid";
import { Box, Link, Avatar, Rating, Typography, LinearProgress } from "@mui/material";

import { fPercent } from "src/utils/format-number";
import { fDate, fTime } from "src/utils/format-time";

import Label from "src/components/label";
import Iconify from "src/components/iconify";

export const clientColumnDef: GridColDef[] = [
  {
    field: 'id',
    headerName: 'Id',
    filterable: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    flex: 1,
    minWidth: 160,
    hideable: false,
    renderCell: (params) => (
      <Stack spacing={2} direction="row" alignItems="center" sx={{ minWidth: 0 }}>
        <Avatar alt={params.row.name} sx={{ width: 36, height: 36 }}>
          {params.row.name.charAt(0).toUpperCase()}
        </Avatar>
        <Typography component="span" variant="body2" noWrap>
          {params.row.name}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 160,
    editable: true,
    renderCell: (params) => (
      <Link color="inherit" noWrap>
        {params.row.email}
      </Link>
    ),
  },
  {
    type: 'dateTime',
    field: 'lastLogin',
    headerName: 'Last login',
    align: 'right',
    headerAlign: 'right',
    width: 120,
    renderCell: (params) => (
      <Stack sx={{ textAlign: 'right' }}>
        <Box component="span">{fDate(params.row.lastLogin)}</Box>
        <Box component="span" sx={{ color: 'text.secondary', typography: 'caption' }}>
          {fTime(params.row.lastLogin)}
        </Box>
      </Stack>
    ),
  },
  {
    type: 'number',
    field: 'rating',
    headerName: 'Rating',
    width: 140,
    renderCell: (params) => (
      <Rating size="small" value={params.row.rating} precision={0.5} readOnly />
    ),
  },
  {
    type: 'singleSelect',
    field: 'status',
    headerName: 'Status',
    align: 'center',
    headerAlign: 'center',
    width: 100,
    editable: true,
    valueOptions: ['online', 'alway', 'busy'],
    renderCell: (params) => (
      <Label
        variant="soft"
        color={
          (params.row.status === 'busy' && 'error') ||
          (params.row.status === 'alway' && 'warning') ||
          'success'
        }
        sx={{ mx: 'auto' }}
      >
        {params.row.status}
      </Label>
    ),
  },
  {
    type: 'boolean',
    field: 'isAdmin',
    align: 'center',
    headerAlign: 'center',
    width: 80,
    renderCell: (params) =>
      params.row.isAdmin ? (
        <Iconify icon="eva:checkmark-circle-2-fill" sx={{ color: 'primary.main' }} />
      ) : (
        '-'
      ),
  },
  {
    type: 'number',
    field: 'performance',
    headerName: 'Performance',
    align: 'center',
    headerAlign: 'center',
    width: 160,
    renderCell: (params) => (
      <Stack spacing={1} direction="row" alignItems="center" sx={{ px: 1, width: 1, height: 1 }}>
        <LinearProgress
          value={params.row.performance}
          variant="determinate"
          color={
            (params.row.performance < 30 && 'error') ||
            (params.row.performance > 30 && params.row.performance < 70 && 'warning') ||
            'primary'
          }
          sx={{ width: 1, height: 6 }}
        />
        <Typography variant="caption" sx={{ width: 80 }}>
          {fPercent(params.row.performance)}
        </Typography>
      </Stack>
    ),
  },
  {
    type: 'actions',
    field: 'actions',
    headerName: 'Actions',
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
        onClick={() => console.info('VIEW', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:pen-bold" />}
        label="Edit"
        onClick={() => console.info('EDIT', params.row.id)}
      />,
      <GridActionsCellItem
        showInMenu
        icon={<Iconify icon="solar:trash-bin-trash-bold" />}
        label="Delete"
        onClick={() => console.info('DELETE', params.row.id)}
        sx={{ color: 'error.main' }}
      />,
    ],
  },
];