import { m } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect, useCallback } from 'react';

import MenuItem from '@mui/material/MenuItem';
import { Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { ERole } from 'src/config-global';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useClientContext } from 'src/components/clients/context/client-context';

import { IClient } from 'src/types/client';


// ----------------------------------------------------------------------

export default function ClientPopover() {

  const router = useRouter();

  const popover = usePopover();

  const realmApp = useRealmApp()

  const clientloading = useBoolean(true)

  const showClientLoader = useShowLoader((clientloading.value), 300);

  const [clients, setClients] = useState<IClient[] | null>(null);

  // @ts-expect-error expected
  const role: ERole = useMemo(() => realmApp.currentUser?.customData.role as unknown, [realmApp.currentUser?.customData.role])


  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    clientloading.onTrue()
    setError(null);
    realmApp.currentUser?.functions.getUserClients().then((data: IClient[]) => setClients(data))
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
      const c = clients.find(x => x._id.toString() === client?._id.toString())
      if (c) {
        setClientObj(c)
      }
    }
  }, [clients, client])


  useEffect(() => {
    if (clObj) onChangeClient(clObj)
  }, [clObj, onChangeClient])


  const handleChangeClient = useCallback(
    (cl: IClient) => {
      setClientObj(cl)
      router.replace(paths.v2[role].root);
      popover.onClose();
    },
    [popover, role, router]
  );

  return (
    <>
      <Button
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        onClick={popover.onOpen}
        variant='soft'
        color={clObj?.name ? 'success' : 'error'}
        size='small'
        endIcon={
          <Iconify icon={popover.open ? "ph:caret-up-bold" : "ph:caret-down-bold"} width={15} />
        }
      >
        {clObj?.name ?? "no client"}
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 160 }}>
        {showClientLoader && <LoadingScreen />}
        {!showClientLoader && clients && clients.map((option) => (
          <MenuItem
            key={option._id.toString()}
            selected={option._id.toString() === clObj?._id.toString()}
            onClick={() => handleChangeClient(option)}

          >
            <Iconify icon={option.client_icon} sx={{ borderRadius: 0.65, width: 28 }} />

            <Typography variant='caption' noWrap>{option.name}</Typography>
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}
