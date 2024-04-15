import { first, isNumber } from 'lodash';
import { useMemo, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { GridCellParams } from '@mui/x-data-grid';
import ListItemText from '@mui/material/ListItemText';

import { useRouter } from 'src/routes/hooks';

import { getRolePath } from 'src/utils/helpers';
import { fTime, fDate } from 'src/utils/format-time';

import { useRealmApp } from 'src/components/realm';

import { ICampaign } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

type ParamsProps = {
  params: GridCellParams<ICampaign & { onViewRow: () => void }>;
};

export function RenderCellCheckin({ params }: ParamsProps) {
  const totalCheckins = isNumber(params.row.total_checkin) ? params.row.total_checkin : 0
  return <>{totalCheckins}</>;
}

// export function RenderCellPublish({ params }: ParamsProps) {
//   return (
//     <Label variant="soft" color={(params.row. === 'published' && 'info') || 'default'}>
//       {params.row.publish}
//     </Label>
//   );
// }

export function RenderCellCreatedAt({ params }: ParamsProps) {
  return (
    <ListItemText
      primary={fDate(params.row.createdAt)}
      secondary={fTime(params.row.createdAt)}
      primaryTypographyProps={{ typography: 'body2', noWrap: true }}
      secondaryTypographyProps={{
        mt: 0.5,
        component: 'span',
        typography: 'caption',
      }}
    />
  );
}

// export function RenderCellStock({ params }: ParamsProps) {
//   return (
//     <Stack sx={{ typography: 'caption', color: 'text.secondary' }}>
//       <LinearProgress
//         value={(params.row.available * 100) / params.row.quantity}
//         variant="determinate"
//         color={
//           (params.row.inventoryType === 'out of stock' && 'error') ||
//           (params.row.inventoryType === 'low stock' && 'warning') ||
//           'success'
//         }
//         sx={{ mb: 1, height: 6, maxWidth: 80 }}
//       />
//       {!!params.row.available && params.row.available} {params.row.inventoryType}
//     </Stack>
//   );
// }

export function RenderCellCampaign({ params }: ParamsProps) {
  const { currentUser } = useRealmApp();

  const role = useMemo(() => currentUser?.customData?.role as unknown as string, [currentUser?.customData?.role])

  const rolePath = getRolePath(role);

  const router = useRouter()

  const handleViewRow = useCallback(
    (id: string) => {
      // @ts-expect-error expected
      router.push(rolePath?.campaign?.edit(id) ?? "#");
    },
    [router]
  );

  return (
    <Stack direction="row" alignItems="center" sx={{ py: 2, width: 1 }}>
      <Avatar
        variant="rounded"
        sx={{ width: 64, height: 64, mr: 2 }}
      >{first(params.row.title)}</Avatar>

      <ListItemText
        disableTypography
        primary={
          <Link
            noWrap
            color="inherit"
            variant="subtitle2"
            onClick={() => handleViewRow(params.row._id.toString())}
            sx={{ cursor: 'pointer' }}
          >
            {params.row.title}
          </Link>
        }
        secondary={
          <Box component="div" sx={{ typography: 'body2', color: 'text.disabled' }}>
            {params.row.type}
          </Box>
        }
        sx={{ display: 'flex', flexDirection: 'column' }}
      />
    </Stack>
  );
}
