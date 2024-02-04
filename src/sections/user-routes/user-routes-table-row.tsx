import { last, first } from 'lodash';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { useBoolean } from 'src/hooks/use-boolean';

import { fCurrency } from 'src/utils/format-number';
import { fDate, fTime } from 'src/utils/format-time';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

import { IUserRouteItem, IUserRouteShippingAddress } from 'src/types/user-routes';


// ----------------------------------------------------------------------

type Props = {
  row: IUserRouteItem;
  selected: boolean;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
};

export default function UserRouteTableRow({
  row,
  selected,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const { status, orderNumber, createdAt, shippingAddress, totalQuantity, subTotal } = row;

  const confirm = useBoolean();

  const collapse = useBoolean();

  const [openTertiaryCollapse, setOpenTertiaryCollapse] = useState<IUserRouteShippingAddress[]>([]);

  const checkIfOpen = useCallback((addrs: IUserRouteShippingAddress) => openTertiaryCollapse.some(op => op.id === addrs.id), [openTertiaryCollapse])

  const popover = usePopover();

  const tertiaryCollapse = (addrs: IUserRouteShippingAddress) => {
    const exits = openTertiaryCollapse.some(op => op.id === addrs.id)
    if (!exits) return setOpenTertiaryCollapse([addrs, ...openTertiaryCollapse]);
    return setOpenTertiaryCollapse(openTertiaryCollapse.filter(op => op.id !== addrs.id))
  }

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell padding="checkbox">
        <Checkbox checked={selected} onClick={onSelectRow} />
      </TableCell>

      <TableCell>
        <Box
          onClick={onViewRow}
          sx={{
            cursor: 'pointer',
            '&:hover': {
              textDecoration: 'underline',
            },
          }}
        >
          {orderNumber}
        </Box>
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <Avatar alt={customer.name} src={customer.avatarUrl} sx={{ mr: 2 }} /> */}

        <ListItemText
          primary={first(shippingAddress)?.fullAddress}
          secondary={last(shippingAddress)?.fullAddress}
          primaryTypographyProps={{ typography: 'body2' }}
          secondaryTypographyProps={{
            component: 'span',
            color: 'text.disabled',
          }}
        />
      </TableCell>

      <TableCell>
        <ListItemText
          primary={fDate(createdAt)}
          secondary={fTime(createdAt)}
          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
          secondaryTypographyProps={{
            mt: 0.5,
            component: 'span',
            typography: 'caption',
          }}
        />
      </TableCell>

      <TableCell align="center"> {totalQuantity} </TableCell>

      <TableCell> {fCurrency(subTotal)} </TableCell>

      <TableCell>
        <Label
          variant="soft"
          color={
            (status === 'active' && 'success') ||
            (status === 'pending' && 'warning') ||
            (status === 'cancelled' && 'error') ||
            'default'
          }
        >
          {status}
        </Label>
      </TableCell>

      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton
          color={collapse.value ? 'inherit' : 'default'}
          onClick={collapse.onToggle}
          sx={{
            ...(collapse.value && {
              bgcolor: 'action.hover',
            }),
          }}
        >
          <Iconify icon="eva:arrow-ios-downward-fill" />
        </IconButton>

        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );

  const renderSecondary = (
    <TableRow>
      <TableCell sx={{ p: 0, border: 'none' }} colSpan={8}>
        <Collapse
          in={collapse.value}
          timeout="auto"
          unmountOnExit
          sx={{ bgcolor: 'background.neutral' }}
        >
          <Stack component={Paper} sx={{ m: 1.5 }}>
            {shippingAddress.map((addrs: IUserRouteShippingAddress) => (
              <Stack key={`${addrs.id}:${addrs.latitude}`}>
                <Stack
                  direction="row"
                  alignItems="center"
                  sx={{
                    p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
                    '&:not(:last-of-type)': {
                      borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
                    },
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{ width: 48, height: 48, mr: 2 }}
                  >{first(addrs.fullAddress)}</Avatar>

                  <ListItemText
                    primary={addrs.fullAddress}
                    secondary={addrs.road}
                    primaryTypographyProps={{
                      typography: 'body2',
                    }}
                    secondaryTypographyProps={{
                      component: 'span',
                      color: 'text.disabled',
                      mt: 0.5,
                    }}
                  />

                  <Box>x{addrs.products.reduce((accumulator, item) => accumulator + item.quantity, 0)}</Box>

                  <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(addrs.products.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0))}</Box>
                  <IconButton
                    color={checkIfOpen(addrs) ? 'inherit' : 'default'}
                    onClick={() => tertiaryCollapse(addrs)}
                  sx={{
                    ...(checkIfOpen(addrs) && {
                      bgcolor: 'action.hover',
                    }),
                  }}
                  >
                    <Iconify icon="eva:arrow-ios-downward-fill" />
                  </IconButton>
                </Stack>
                <RenderTertiary addrs={addrs} checkIfOpen={checkIfOpen} />
              </Stack>
            ))}
          </Stack>
        </Collapse>
      </TableCell>

    </TableRow>
  );



  return (
    <>
      {renderPrimary}

      {renderSecondary}

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onViewRow();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}

const RenderTertiary = ({ addrs, checkIfOpen }: { addrs: IUserRouteShippingAddress, checkIfOpen: (addrs: IUserRouteShippingAddress) => boolean }) => {
  const open = checkIfOpen(addrs)
  return (
    <Collapse
      in={open}
      timeout="auto"
      unmountOnExit
      sx={{ bgcolor: 'background.neutral' }}
    >
      <Stack component={Paper} sx={{ m: 1.5 }}>
        {addrs.products.map((product) => (
          <Stack
            key={product.id}
            direction="row"
            alignItems="center"
            sx={{
              p: (theme) => theme.spacing(1.5, 2, 1.5, 1.5),
              '&:not(:last-of-type)': {
                borderBottom: (theme) => `solid 2px ${theme.palette.background.neutral}`,
              },
            }}
          >
            <Avatar
              src={product.coverUrl}
              variant="rounded"
              sx={{ width: 48, height: 48, mr: 2 }}
            >{first(product.name)}</Avatar>

            <ListItemText
              primary={product.name}
              secondary={product.sku}
              primaryTypographyProps={{
                typography: 'body2',
              }}
              secondaryTypographyProps={{
                component: 'span',
                color: 'text.disabled',
                mt: 0.5,
              }}
            />

            <Box>x{product.quantity}</Box>

            <Box sx={{ width: 110, textAlign: 'right' }}>{fCurrency(product.price * product.quantity)}</Box>
          </Stack>
        ))}
      </Stack>
    </Collapse>
  )
};
