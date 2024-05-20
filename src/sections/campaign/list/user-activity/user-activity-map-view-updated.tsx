"use client"

import { MapRef } from 'react-map-gl';
import { enqueueSnackbar } from 'notistack';
import { isNumber, flattenDepth } from 'lodash';
import { memo, useRef, useMemo, Fragment, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Radio, Badge, Tooltip, ListItem, Collapse, useTheme, IconButton, Pagination, RadioGroup, ButtonBase, ListSubheader, FormControlLabel } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { bgBlur } from 'src/theme/css';

import Iconify, { SystemIcon } from 'src/components/iconify';
import { LoadingScreen } from 'src/components/loading-screen';

import { IUser } from 'src/types/user_realm';
import { IUserCheckinData } from 'src/types/campaign';
import { ISessionProduct, IExtendedCheckin, IExtendedCheckinSession } from 'src/types/realm/realm-types';

import UserActivityRoutesMap from './routes/user-activity-routes-map';

// ----------------------------------------------------------------------

type UserActivityMapViewProps = {
    handleNewRouteOpen: ({ lng, lat }: { lng: number, lat: number }) => void
    // handleRemoveNewRoute: (route: number) => void;
    // handleAddNewRoute: (route: IRoute) => void;
    // campaignRoutes?: ICampaignRoutes[];
    // startDate: Date | null;
    // endDate: Date | null;
    user: IUser;
    // campaignId: string;
    loading: boolean;
    checkins: IExtendedCheckin[]
};


const UserActivityMapViewUpdate: React.FC<UserActivityMapViewProps> = ({ handleNewRouteOpen, user, checkins, loading }: UserActivityMapViewProps) => {
    const fetchDirections = useBoolean();

    const theme = useTheme();

    const mapRef = useRef<MapRef>(null)

    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [minPageSize, setPageSize] = useState<number>(5);

    const [page, setPage] = useState(1);

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };


    const routes = useMemo<IExtendedCheckin[] | null>(() => Array.isArray(checkins) ? checkins.reverse() : [], [checkins]);
    const paginatedRoutes = useMemo<IExtendedCheckin[] | null>(() => {
        const arry = Array.isArray(routes) ? routes : []
        const startIndex = (page - 1) * minPageSize;
        const endIndex = startIndex + minPageSize
        return arry.slice(startIndex, endIndex)
    }, [routes, page, minPageSize]);


    const [popupInfo, setPopupInfo] = useState<IUserCheckinData | null>(null)

    const handleSetPopupInfo = useCallback((pInfo: IUserCheckinData | null) => {
        setPopupInfo(pInfo);
    }, [])

    // State to track expanded list item
    const [openCollapse, setOpenCollapse] = useState<string | null>(null);

    // Function to handle click to expand/collapse items
    const handleClick = (id: string) => {
        setOpenCollapse(openCollapse === id ? null : id);
    };

    const onSelectRoute = useCallback(({ longitude, latitude, addr, phoneNumber, _id, products }: { _id: string, longitude: number, latitude: number, addr: string, phoneNumber: string, products: ISessionProduct[] }) => {
        setSelectedRoute(_id);
        // const prds = []
        zoomToRoute(longitude, latitude);
        setPopupInfo({
            lnglat: [latitude, longitude],
            address: addr,
            phoneNumber: phoneNumber ?? "",
            products,
        }); // Set the selected route's info for the popup
    }, []);
    // Example usage of the ref
    const zoomToRoute = (lng: number, lat: number,) => {
        const mapInstance = mapRef.current?.getMap();
        if (mapInstance) {
            mapInstance.flyTo({
                center: [lat, lng],
                zoom: 15,
                essential: true,
            });
        }
    };



    const renderRouteForm = (
        <Stack width={250} spacing={1}>
            <Button
                variant="soft"
                size='small'
                color={fetchDirections.value ? "success" : 'inherit'}
                sx={{ mb: 1, width: "max-content" }} onClick={fetchDirections.onToggle}
                endIcon={
                    fetchDirections.value ?
                        <Iconify icon="eva:done-all-fill" width={12} />
                        :
                        <Iconify icon="mingcute:close-line" width={12} />
                }
            >
                Directions
            </Button>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    {user.displayName ?? ""} Checkins
                </Typography>
            </Stack>
            <List dense sx={{ maxHeight: 200, minWidth: 200, overflowY: 'auto', width: "100%" }} disablePadding>
                {Array.isArray(paginatedRoutes) && paginatedRoutes.map((route) => (
                    <Fragment key={typeof route._id === "string" ? route._id : route._id.toString()}>
                        <ListSubheader
                            disableGutters
                            component={ButtonBase}
                            onClick={() => handleClick(route._id.toString())}
                            sx={{
                                ...bgBlur({ color: theme.palette.grey[900] }),
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                pl: 1,
                                width: "100%",
                                '&:first-of-type': {
                                    borderTopLeftRadius: 5,
                                    borderTopRightRadius: 5,
                                },
                                '&:last-of-type': {
                                    borderBottomLeftRadius: 5,
                                    borderBottomRightRadius: 5,
                                }
                            }}
                        >
                            <Typography variant='caption' >{fDate(route.checkin)}</Typography>
                            <Stack direction="row" spacing={1}>

                                <Badge badgeContent={route?.sessions.filter(x => x.location.coordinates[0] > 0 || x.location.coordinates[1] > 0).length ?? 0} color="primary"
                                    sx={{
                                        '.MuiBadge-badge': {
                                            height: '15px', // Adjust badge height
                                            minWidth: 'auto', // Adjust badge minimum width
                                            fontSize: '0.5rem', // Adjust font size inside the badge
                                            right: -3,
                                            top: 10,
                                            border: `2px solid ${theme.palette.background.paper}`,
                                            padding: '0 4px',
                                        },
                                    }}
                                >
                                    <SystemIcon type="route" width={17} />
                                </Badge>
                                <Badge badgeContent={route.totalUnitsSold ?? 0} color="primary"
                                    sx={{
                                        '.MuiBadge-badge': {
                                            height: '15px', // Adjust badge height
                                            minWidth: 'auto', // Adjust badge minimum width
                                            fontSize: '0.5rem', // Adjust font size inside the badge
                                            right: -3,
                                            top: 10,
                                            border: `2px solid ${theme.palette.background.paper}`,
                                            padding: '0 4px',
                                        },
                                    }}
                                >
                                    <SystemIcon type='product' width={17} />
                                </Badge>
                                <Badge badgeContent={route.totalFilledReports ?? 0} color="primary"
                                    sx={{
                                        '.MuiBadge-badge': {
                                            height: '15px', // Adjust badge height
                                            minWidth: 'auto', // Adjust badge minimum width
                                            fontSize: '0.5rem', // Adjust font size inside the badge
                                            right: -3,
                                            top: 10,
                                            border: `2px solid ${theme.palette.background.paper}`,
                                            padding: '0 4px',
                                        },
                                    }}
                                >
                                    <SystemIcon type="report" width={18} />
                                </Badge>
                                <IconButton >
                                    {openCollapse === route._id.toString() ?
                                        <Iconify icon="eva:arrow-ios-upward-fill" width={15} height={15} /> :
                                        <Iconify icon="eva:arrow-ios-downward-fill" width={15} height={15} />
                                    }
                                </IconButton>
                            </Stack>

                        </ListSubheader>

                        <Collapse in={openCollapse === route._id.toString()} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense >
                                {route?.sessions?.map((r, i) => (
                                    <ListItem key={r._id.toString()} sx={{ pl: 4 }} >
                                        <RadioGroup
                                            value={selectedRoute}
                                            onChange={(e) => {
                                                console.log(r.location, "LOCATION")
                                                const longitude = r.location.coordinates[1];
                                                const latitude = r.location.coordinates[0];
                                                if (isNumber(longitude) && isNumber(latitude)) {
                                                    // onSelectRoute logic here
                                                    onSelectRoute({
                                                        _id: r._id.toString(),
                                                        longitude,
                                                        latitude,
                                                        addr: "Address",
                                                        phoneNumber: user.displayName,
                                                        products: Array.isArray(r.salesData) ? (r.salesData[0]?.products ?? []) : []
                                                    })
                                                } else {
                                                    enqueueSnackbar("Invalid Location data", { variant: "info" })
                                                }
                                            }}
                                        >

                                            <FormControlLabel
                                                disabled={
                                                    !(isNumber(r.location.coordinates[1])
                                                        && isNumber(r.location.coordinates[0])
                                                        && r.location.coordinates[1] !== 0
                                                        && r.location.coordinates[0] !== 0)
                                                }
                                                color={
                                                    !(isNumber(r.location.coordinates[1])
                                                        && isNumber(r.location.coordinates[0])
                                                        && r.location.coordinates[1] !== 0
                                                        && r.location.coordinates[0] !== 0) ? "error" : "success"
                                                }
                                                value={r._id.toString()}
                                                control={
                                                    <Radio size="small"
                                                        sx={{
                                                            '& .MuiSvgIcon-root': {
                                                                fontSize: 15,
                                                            },
                                                        }} />
                                                }
                                                label={
                                                    <Tooltip title={
                                                        !(isNumber(r.location.coordinates[1])
                                                            && isNumber(r.location.coordinates[0])
                                                            && r.location.coordinates[1] !== 0
                                                            && r.location.coordinates[0] !== 0)
                                                            ? "Invalid Location" : fTime(r.start_time)
                                                    } arrow>
                                                        <Typography variant="caption" color={
                                                            !(isNumber(r.location.coordinates[1])
                                                                && isNumber(r.location.coordinates[0])
                                                                && r.location.coordinates[1] !== 0
                                                                && r.location.coordinates[0] !== 0) ? "error" : "text.secondary"}>
                                                            {fTime(r.start_time) ?? ''}
                                                        </Typography>
                                                    </Tooltip>
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
            <Pagination shape="rounded" count={Array.isArray(routes) ? Math.ceil(routes.length / minPageSize) : 0} page={page} onChange={handleChange} showFirstButton showLastButton />

            <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" size='small'>
                    Clear Routes
                </Button>
            </Stack>
        </Stack>
    )
    const contacts = useMemo(() => {
        if (!Array.isArray(routes)) return [];
        const mappedRoutes: IExtendedCheckinSession[] = flattenDepth(routes.map(x => x.sessions), 3)
        return mappedRoutes.map(r => ({
            lnglat: [r.location.coordinates[1], r.location.coordinates[0]],
            address: fDateTime(r.start_time),
            phoneNumber: user.phoneNumber,
            products: Array.isArray(r.salesData) ? (r.salesData[0]?.products ?? []) : []
        }))
    }, [routes, user])




    const renderMap = (
        <Grid xs={12}>
            <Card sx={{ p: 0 }}>
                <UserActivityRoutesMap
                    ref={mapRef}
                    popupInfo={popupInfo}
                    handleSetPopupInfo={handleSetPopupInfo}
                    // @ts-expect-error expected
                    contacts={contacts}
                    handleNewRouteOpen={handleNewRouteOpen}
                    fetchDirections={fetchDirections.value}
                    childrenControlPanel={renderRouteForm}
                />
            </Card>
        </Grid>
    )

    return (
        <Grid container spacing={3}>
            {loading && <LoadingScreen />}
            {!loading && renderMap}
        </Grid>
    );
}

export default memo(UserActivityMapViewUpdate);