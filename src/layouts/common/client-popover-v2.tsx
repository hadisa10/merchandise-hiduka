import { m } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect, useCallback, Fragment, MouseEvent } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { alpha, Avatar, Button, IconButton, TextField, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { ERole } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useClientContext } from 'src/components/clients/context/client-context';

import { IClient, IUpdatedClient } from 'src/types/client';
import { Box } from '@mui/system';


// ----------------------------------------------------------------------

export default function ClientPopover() {

  const router = useRouter();

  const popover = usePopover();

  const realmApp = useRealmApp()

  const clientloading = useBoolean(true)

  const mdUp = useResponsive('up', 'md');

  const showClientLoader = useShowLoader((clientloading.value), 300);

  const [clients, setClients] = useState<IUpdatedClient[] | null>(null);

  // @ts-expect-error expected
  const role: ERole = useMemo(() => realmApp.currentUser?.customData.role as unknown, [realmApp.currentUser?.customData.role])

  // Create a Set of all nested client IDs for quick lookup
  const nestedClientIds = useMemo(() => Array.isArray(clients) ? new Set(clients?.flatMap(client => client.nestedClients?.map(nestedClient => nestedClient._id.toString()) || [])) : [], [clients]);

  // Filter out top-level clients that are also listed as nested clients
  const topLevelClients = useMemo(() => {
    return Array.isArray(clients) ? clients.filter(client => {
      // Ensure client exists and has an _id before checking against nestedClientIds
      const clientId = client?._id?.toString();
        // @ts-expect-error expected
      return clientId && nestedClientIds && !nestedClientIds.has(clientId);
    }) : [];
  }, [clients, nestedClientIds]);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  console.log(nestedClientIds, "CLIENTS");

  useEffect(() => {
    clientloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getUserClientsUpdated().then((data: IUpdatedClient[]) => setClients(data))
      .catch(e => {
        console.error(e)
        setError(e);
        enqueueSnackbar("Failed to get your clients", { variant: "error" })
      }
      )
      .finally(() => clientloading.onFalse())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const { onChangeClient, client } = useClientContext()

  const [clObj, setClientObj] = useState<IClient | undefined>(undefined);

  useEffect(() => {
    if (Array.isArray(clients) && client) {
      const c = clients.find(x => x?._id.toString() === client?._id.toString())
      if (c) {
        setClientObj(c)
      }
    }
  }, [clients, client])


  useEffect(() => {
    if (clObj) onChangeClient(clObj)
  }, [clObj, onChangeClient])


  const handleChangeClient = useCallback(
    (e: MouseEvent<HTMLLIElement, globalThis.MouseEvent>, cl: IClient) => {
      e.stopPropagation();
      setClientObj(cl)
      router.replace(paths.v2[role].root);
      popover.onClose();
    },
    [popover, role, router]
  );

  return (
    <>
      {mdUp && <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        onClick={popover.onOpen}
        variant='soft'
        color={clObj?.name ? 'success' : 'error'}
        size='small'
        sx={{
          textOverflow: "ellipsis",
          md: { maxWidth: 200 }, xs: { maxWidth: 50 }
        }}
        startIcon={
          client?.type === "agency" &&
          <Iconify icon="solar:star-bold" width={15} />

        }
        endIcon={
          <Iconify icon={popover.open ? "ph:caret-up-bold" : "ph:caret-down-bold"} width={15} />
        }
      >
        <span>{clObj?.name ?? "no client"}</span>
      </Button>}
      {!mdUp &&
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          color='success'
          sx={{
            width: 40,
            height: 40,
            background: (theme) => alpha(theme.palette.success.main, 0.08),
            ...(popover.open && {
              background: (theme) =>
                `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
            }),
          }}
        >
          <Avatar
            src={client?.name as string}
            alt={client?.name}
            variant="rounded"
            sx={{
              width: 36,
              height: 36,
              border: (theme) => `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {client?.name.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      }

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160, maxHeight: 300, overflowY: "auto" }}>
        <TextField title='Search' size='small' placeholder='Search client' />
        {showClientLoader && <LoadingScreen />}
        {!showClientLoader && clients && (() => {
          return topLevelClients.map((client) => (
            <Fragment key={client._id.toString()}>
              <MenuItem
                selected={client._id.toString() === clObj?._id.toString()}
                onClick={(e) => handleChangeClient(e, client)}
                sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Iconify icon={client.client_icon} sx={{ borderRadius: 0.65, width: 28 }} />
                  <Typography variant='caption' noWrap>{client.name}</Typography>
                </Box>
                {client.nestedClients && client.nestedClients.map((nestedClient) => (
                  <MenuItem
                    key={nestedClient._id.toString()}
                    selected={nestedClient._id.toString() === clObj?._id.toString()}
                    onClick={(e) => handleChangeClient(e, nestedClient)}
                    sx={{ ml: 4 }}
                  >
                    <Iconify icon={nestedClient.client_icon} sx={{ borderRadius: 0.65, width: 28 }} />
                    <Typography variant='caption' noWrap>{nestedClient.name}</Typography>
                  </MenuItem>
                ))}
              </MenuItem>
            </Fragment>
          ));
        })()}
      </CustomPopover>
    </>
  );
}
