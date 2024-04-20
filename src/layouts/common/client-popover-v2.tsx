import { m } from 'framer-motion';
import { isEmpty, isObject } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import {
  useMemo,
  useState,
  Fragment,
  useEffect,
  MouseEvent,
  useCallback,
  ChangeEvent,
} from 'react';

import { Stack } from '@mui/system';
import {
  List,
  alpha,
  Radio,
  Avatar,
  Button,
  Collapse,
  ListItem,
  useTheme,
  TextField,
  IconButton,
  Typography,
  RadioGroup,
  ListSubheader,
  FormControlLabel,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useDebounce } from 'src/hooks/use-debounce';
import { useResponsive } from 'src/hooks/use-responsive';

import { findRootClient, deepSearchGeneric } from 'src/utils/helpers';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';
import { varHover } from 'src/components/animate';
import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useClientContext } from 'src/components/clients/context/client-context';

import { ERole , IClient, IUpdatedClient, IGetClientsResponse } from 'src/types/client';

// ----------------------------------------------------------------------

export default function ClientPopover() {
  const theme = useTheme();

  const router = useRouter();

  const popover = usePopover();

  const realmApp = useRealmApp();

  const clientloading = useBoolean(true);

  const mdUp = useResponsive('up', 'md');

  const showClientLoader = useShowLoader(clientloading.value, 300);

  const [clients, setClients] = useState<IUpdatedClient[] | null>(null);
  const [nestedClients, setNestedClients] = useState<IClient[]>([]);

  // State to track expanded list item
  const [openCollapse, setOpenCollapse] = useState<string | null>(null);

  // Function to handle click to expand/collapse items
  const handleClick = (id: string) => {
    setOpenCollapse(openCollapse === id ? null : id);
  };

  // @ts-expect-error expected
  const role: ERole = useMemo(
    () => realmApp.currentUser?.customData.role as unknown,
    [realmApp.currentUser?.customData.role]
  );

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<unknown>(null);

  const { onChangeClient, client } = useClientContext();

  useEffect(() => {
    clientloading.onTrue();
    setError(null);
    realmApp.currentUser?.functions
      .getUserClientsUpdated()
      .then((data: IGetClientsResponse) => {
        console.log(data?.clients, 'CLIENTS');
        setClients(data.clients ?? []);
        setNestedClients(data?.nestedClients ?? []);
      })
      .catch((e) => {
        console.error(e);
        setError(e);
        enqueueSnackbar('Failed to get your clients', { variant: 'error' });
      })
      .finally(() => clientloading.onFalse());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [clObj, setClientObj] = useState<IClient | undefined>(undefined);
  const combined = useMemo(() => {
    if (Array.isArray(nestedClients) && Array.isArray(clients)) {
      const objClt: Record<string, IClient> = {};
      const arr = structuredClone(
        [...clients, ...nestedClients].map((x) => ({
          ...x,
          _id: x._id.toString(),
          parent: x?.parent?.toString(),
        }))
      );
      for (const i of arr) {
        const id = i?._id?.toString();
        // @ts-expect-error
        objClt[id] = i;
      }
      return objClt;
    }
    return null;
  }, [clients, nestedClients]);

  useEffect(() => {
    if (isObject(combined) && !isEmpty(combined) && client) {
      const c = combined?.[client?._id.toString() ?? ''];
      if (c) {
        setClientObj(c);
      }
    }
  }, [combined, client]);

  useEffect(() => {
    if (clObj) onChangeClient(clObj);
  }, [clObj, onChangeClient]);

  const handleChangeClient = useCallback(
    (
      e: MouseEvent<HTMLElement, globalThis.MouseEvent> | ChangeEvent<HTMLInputElement>,
      cl: IUpdatedClient
    ) => {
      e.stopPropagation();
      setClientObj(cl);
      router.replace(paths.v2[role].root);
    },
    [role, router]
  );

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const filteredClients = useMemo(() => {
    if (Array.isArray(clients) && debouncedSearch?.length > 0) {
      const { results } = deepSearchGeneric(
        clients,
        new RegExp(`^${debouncedSearch}`, 'im'),
        'name'
      );
      return results.map((x) => x.client);
    }
    return clients;
  }, [debouncedSearch, clients]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setSearch(e.target.value as string);

  const getSelected = useCallback(
    (id: string) => {
      if (client?._id?.toString() === id) return true;
      if (combined) {
        // @ts-expect-error expected
        const root = findRootClient(combined, client?._id.toString(), 'parent');
        if (root?._id?.toString() === id) return true;
      }
      return false;
    },
    [client, combined]
  );
  console.log(clients?.map((x) => x.name));

  return (
    <>
      {mdUp && (
        <Button
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          onClick={popover.onOpen}
          variant="soft"
          color={clObj?.name ? 'success' : 'error'}
          size="small"
          sx={{
            textOverflow: 'ellipsis',
            md: { maxWidth: 200 },
            xs: { maxWidth: 50 },
          }}
          startIcon={(() => {
            switch (client?.type) {
              case 'agency':
                return <Iconify icon="tabler:hierarchy" width={15} />;
              default:
                return <Iconify icon="fluent:flash-flow-16-filled" width={15} />;
            }
          })()}
          endIcon={
            <Iconify icon={popover.open ? 'ph:caret-up-bold' : 'ph:caret-down-bold'} width={15} />
          }
        >
          {showClientLoader ? (
            <LoadingScreen sx={{ width: 16, height: 16 }} />
          ) : (
            <span>{clObj?.name ?? 'no client'}</span>
          )}
        </Button>
      )}
      {!mdUp && (
        <IconButton
          component={m.button}
          whileTap="tap"
          whileHover="hover"
          variants={varHover(1.05)}
          onClick={popover.onOpen}
          color="success"
          sx={{
            width: 40,
            height: 40,
            background: alpha(theme.palette.success.main, 0.08),
            ...(popover.open && {
              background: `linear-gradient(135deg, ${theme.palette.success.light} 0%, ${theme.palette.success.main} 100%)`,
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
              border: `solid 2px ${theme.palette.background.default}`,
            }}
          >
            {client?.name.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      )}

      <CustomPopover
        hiddenArrow
        open={popover.open}
        onClose={() => {
          popover.onClose();
          setSearch('');
        }}
        sx={{ width: 250, maxHeight: 300, overflowY: 'auto' }}
      >
        <Stack rowGap={1}>
          <TextField
            fullWidth
            title="Search"
            size="small"
            onChange={handleChange}
            placeholder="Search client..."
          />
          {showClientLoader && <LoadingScreen />}
          {!showClientLoader && (
            <List sx={{ height: 200, overflowY: 'auto', width: '100%' }} disablePadding>
              {Array.isArray(filteredClients) &&
                filteredClients.map((clt) => (
                  <Fragment key={typeof clt._id === 'string' ? clt._id : clt._id.toString()}>
                    <ListSubheader
                      disableGutters
                      onClick={(e) => handleChangeClient(e, clt)}
                      sx={{
                        ...bgBlur({
                          color: getSelected(clt._id.toString())
                            ? theme.palette.grey[300]
                            : theme.palette.grey[900],
                        }),
                        ...(getSelected(clt._id.toString())
                          ? {
                              color: theme.palette.getContrastText(theme.palette.grey[300]),
                            }
                          : {}),
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pl: 1,
                        width: '100%',
                        height: 35,
                        pointerEvents: 'auto',
                        '&:hover': {
                          cursor: 'pointer',
                          background: getSelected(clt._id.toString())
                            ? theme.palette.grey[300]
                            : alpha(theme.palette.primary.main, 0.08),
                        },
                        '&:first-of-type': {
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                        },
                        '&:last-of-type': {
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                        },
                      }}
                    >
                      <Typography variant="caption" noWrap>
                        {clt.name}
                      </Typography>

                      <Stack direction="row" spacing={1} height="100%" alignItems="center">
                        {clt?.nestedClients?.length > 0 && (
                          <>
                            <Stack
                              borderRadius={0.5}
                              bgcolor={theme.palette.info.main}
                              color={theme.palette.getContrastText(theme.palette.info.main)}
                              alignItems="center"
                              justifyContent="center"
                              height={20}
                              width={20}
                              p={0.3}
                            >
                              <Typography variant="caption">
                                {clt?.nestedClients?.length ?? ''}
                              </Typography>
                            </Stack>
                            <IconButton
                              color={
                                client?._id.toString() === clt._id.toString() ? 'inherit' : 'info'
                              }
                              size="small"
                              sx={{ mr: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClick(clt._id.toString());
                              }}
                            >
                              {openCollapse === clt._id.toString() ? (
                                <Iconify
                                  icon="eva:arrow-ios-upward-fill"
                                  width={17}
                                  height={17}
                                  color={
                                    client?._id.toString() === clt._id.toString()
                                      ? theme.palette.getContrastText(theme.palette.grey[300])
                                      : theme.palette.info.main
                                  }
                                />
                              ) : (
                                <Iconify
                                  icon="eva:arrow-ios-downward-fill"
                                  width={17}
                                  height={17}
                                  color={
                                    client?._id.toString() === clt._id.toString()
                                      ? theme.palette.getContrastText(theme.palette.grey[300])
                                      : theme.palette.info.main
                                  }
                                />
                              )}
                            </IconButton>
                          </>
                        )}
                      </Stack>
                    </ListSubheader>

                    <Collapse in={openCollapse === clt._id.toString()} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding dense>
                        {clt?.nestedClients?.map((r: IUpdatedClient) => (
                          <ListItem key={r._id.toString()} sx={{ pl: 4 }}>
                            <RadioGroup
                              value={client?._id.toString()}
                              onChange={(e) => {
                                handleChangeClient(e, r);
                              }}
                            >
                              <FormControlLabel
                                sx={{ width: '100%' }}
                                value={r._id.toString()}
                                control={
                                  <Radio
                                    size="small"
                                    sx={{
                                      '& .MuiSvgIcon-root': {
                                        fontSize: 15,
                                      },
                                    }}
                                  />
                                }
                                label={
                                  <Typography variant="caption" color="text.secondary" noWrap>
                                    {r.name ?? ''}
                                  </Typography>
                                }
                              />
                            </RadioGroup>
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  </Fragment>
                ))}
            </List>
          )}
        </Stack>
      </CustomPopover>
    </>
  );
}

// clients &&
// (() =>
//   clients?.map((cl) => (
//     <Fragment key={cl._id.toString()}>
//       {/* <MenuItem
//         selected={cl._id.toString() === clObj?._id.toString()}
//         onClick={(e) => handleChangeClient(e, cl)}
//         sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
//       >
//         <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
//           <Iconify icon={client?.client_icon} sx={{ borderRadius: 0.65, width: 28 }} />
//           <Typography variant="caption" noWrap>
//             {client?.name}
//           </Typography>
//         </Box>
//         {cl?.nestedClients &&
//           cl?.nestedClients?.map((nestedClient) => (
//             <MenuItem
//               key={nestedClient?._id.toString()}
//               selected={nestedClient?._id.toString() === clObj?._id.toString()}
//               onClick={(e) => handleChangeClient(e, nestedClient)}
//               sx={{ ml: 4 }}
//             >
//               <Iconify
//                 icon={nestedClient.client_icon}
//                 sx={{ borderRadius: 0.65, width: 28 }}
//               />
//               <Typography variant="caption" noWrap>
//                 {nestedClient.name}
//               </Typography>
//             </MenuItem>
//           ))}
//       </MenuItem> */}
//     </Fragment>
//   )))()}
