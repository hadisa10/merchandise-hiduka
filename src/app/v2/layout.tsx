'use client';

import { enqueueSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import { Stack, alpha, useTheme } from '@mui/system';
import { Avatar, Button, Dialog, ButtonBase, Typography, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import { AuthGuard } from 'src/auth/guard';
import { bgGradient } from 'src/theme/css';
import { ColorSchema } from 'src/theme/palette';
import DashboardLayout from 'src/layouts/dashboard';

import Scrollbar from 'src/components/scrollbar';
import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { LoadingScreen } from 'src/components/loading-screen';

import { IClient } from 'src/types/client';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {

  const theme = useTheme();

  const { client, onChangeClient } = useClientContext()

  const hasClient = useBoolean(true)

  const loader = useShowLoader(hasClient.value, 500)

  useEffect(() => {
    if (!client) {
      hasClient.onTrue()
    } else {
      hasClient.onFalse();
    }
  })

  const realmApp = useRealmApp()

  const clientloading = useBoolean(true)

  const showClientLoader = useShowLoader((clientloading.value), 300);

  const [clients, setClients] = useState<IClient[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    if (!loader) {
      clientloading.onTrue()
      setError(null);
      realmApp.currentUser?.functions.getUserClients().then((data: IClient[]) => setClients(data))
        .catch((e) => {
          console.error(e)
          setError(e);
          enqueueSnackbar("Failed to get your clients", { variant: "error" })
        }
        )
        .finally(() => clientloading.onFalse())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loader])

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
      hasClient.onTrue()
    },
    [hasClient]
  );

  const color: ColorSchema = "primary"

  return (
    <AuthGuard>
      <DashboardLayout>{children}</DashboardLayout>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={loader}
        onClose={() => { }}
      >
        <DialogTitle>Select Client</DialogTitle>

        <DialogContent dividers>
          <Scrollbar>
            <Stack direction="row" spacing={3} sx={{ width: 'max-content', my: 2 }}>
              {showClientLoader && <LoadingScreen />}
              {
                Array.isArray(clients) && !showClientLoader &&
                clients.map(cl => (
                  <Stack
                    key={cl._id.toString()}
                    component={ButtonBase}
                    onClick={() => handleChangeClient(cl)}
                    alignItems="center"
                    sx={{
                      ...bgGradient({
                        direction: '135deg',
                        startColor: alpha(theme.palette[color].light, 0.2),
                        endColor: alpha(theme.palette[color].main, 0.2),
                      }),
                      py: 5,
                      width: 150,
                      borderRadius: 2,
                      textAlign: 'center',
                      color: `${color}.darker`,
                      backgroundColor: 'common.white',
                    }}
                  >
                    <Avatar alt={cl.name} src={cl.client_icon} />
                    <Typography variant='body1'>{cl.name}</Typography>
                  </Stack>
                ))

              }

            </Stack>
          </Scrollbar>
        </DialogContent>
        <DialogActions>
          <Button onClick={hasClient.onFalse} color="primary">
            Confirm
          </Button>
        </DialogActions>

      </Dialog>
    </AuthGuard>
  );
}


