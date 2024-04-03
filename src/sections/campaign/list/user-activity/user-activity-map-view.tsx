"use client"

import { MapRef } from 'react-map-gl';
import { flattenDepth } from 'lodash';
import { memo, useRef, useMemo, Fragment, useState, useEffect, useCallback } from 'react';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Radio, ListItem, Collapse, useTheme, IconButton, Pagination, RadioGroup, ButtonBase, ListSubheader, FormControlLabel } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';
import { useCampaigns } from 'src/hooks/realm/campaign/use-campaign-graphql';

import { fDate, fTime, fDateTime } from 'src/utils/format-time';

import { bgBlur } from 'src/theme/css';

import Iconify from 'src/components/iconify';

import { IUser } from 'src/types/user_realm';
import { IUserCheckinData } from 'src/types/campaign';
import { IRoute, ICheckin, ICampaignRoutes, ICheckinsSessions } from 'src/types/realm/realm-types';

import UserActivityRoutesMap from './routes/user-activity-routes-map';

// import CampaignRoutesMap from '../campaign-routes-map';
// import CampaignSearchRoute from '../campaign-search-route';

// ----------------------------------------------------------------------

type UserActivityMapViewProps = {
    handleNewRouteOpen: ({ lng, lat }: { lng: number, lat: number }) => void
    handleRemoveNewRoute: (route: number) => void;
    handleAddNewRoute: (route: IRoute) => void;
    campaignRoutes?: ICampaignRoutes[];
    startDate: Date | null;
    endDate: Date | null;
    user: IUser;
    campaignId: string;
};


const UserActivityMapView: React.FC<UserActivityMapViewProps> = ({ handleNewRouteOpen, handleRemoveNewRoute, handleAddNewRoute, campaignRoutes, user, campaignId, startDate, endDate }: UserActivityMapViewProps) => {
    const fetchDirections = useBoolean();

    const theme = useTheme();

    const mapRef = useRef<MapRef>(null)

    const [selectedRoute, setSelectedRoute] = useState<string | null>(null);

    const [routes, setRoutes] = useState<ICheckin[] | null>(null);


    const [popupInfo, setPopupInfo] = useState<IUserCheckinData | null>(null)

    const { getCampaignUserCheckins } = useCampaigns(true)

    const handleSetPopupInfo = useCallback((pInfo: IUserCheckinData | null) => {
        setPopupInfo(pInfo);
    }, [])

    // State to track expanded list item
    const [openCollapse, setOpenCollapse] = useState<string | null>(null);

    // Function to handle click to expand/collapse items
    const handleClick = (id: string) => {
        setOpenCollapse(openCollapse === id ? null : id);
    };

    const onSelectRoute = useCallback(({ longitude, latitude, addr, phoneNumber, _id }: { _id: string, longitude: number, latitude: number, addr: string, phoneNumber: string }) => {
        setSelectedRoute(_id);
        // const prds = []
        zoomToRoute(longitude, latitude);
        setPopupInfo({
            lnglat: [latitude, longitude],
            address: addr,
            phoneNumber: phoneNumber ?? "",
            products: [],
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

    useEffect(() => {
        if (startDate && endDate && user._id) {
            getCampaignUserCheckins(campaignId, startDate.toISOString(), endDate.toISOString(), user._id.toString())
                .then(res => {
                    setRoutes(res)
                })
                .catch(e => {
                    console.error(e.message, "ERROR")
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [startDate, endDate, campaignId, user._id])

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
            <List dense sx={{ maxHeight: 200, overflowY: 'auto', width: "100%" }} disablePadding>
                {Array.isArray(routes) && routes.map((route, index) => (
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
                            <IconButton >
                                {openCollapse === route._id.toString() ?
                                    <Iconify icon="eva:arrow-ios-upward-fill" width={15} height={15} /> :
                                    <Iconify icon="eva:arrow-ios-downward-fill" width={15} height={15} />
                                }
                            </IconButton>
                        </ListSubheader>

                        <Collapse in={openCollapse === route._id.toString()} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding dense >
                                {route.sessions.map((r, i) => (
                                    <ListItem key={r._id.toString()} sx={{ pl: 4 }} >
                                        <RadioGroup
                                            value={selectedRoute}
                                            onChange={(e) => {
                                                const longitude = r.location.coordinates[1];
                                                const latitude = r.location.coordinates[0];
                                                console.log(r.location, 'LOCATION')
                                                if (longitude && latitude) {
                                                    // onSelectRoute logic here
                                                    onSelectRoute({ _id: r._id.toString(), longitude, latitude, addr: "Address", phoneNumber: user.displayName })
                                                }
                                            }}
                                        >
                                            <FormControlLabel
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
                                                    <Typography variant="caption" color="text.secondary">
                                                        {fTime(r.start_time) ?? ''}
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
            <Pagination shape="rounded" count={Array.isArray(campaignRoutes) ? Math.ceil(campaignRoutes.length / 10) : 0} showFirstButton showLastButton />

            <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
                <Button variant="soft" color="error" size='small'>
                    Clear Routes
                </Button>
            </Stack>
        </Stack>
    )
    const contacts = useMemo(() => {
        if (!Array.isArray(routes)) return [];
        const mappedRoutes: ICheckinsSessions[] = flattenDepth(routes.map(x => x.sessions), 3)
        return mappedRoutes.map(r => ({
            lnglat: [r.location.coordinates[1], r.location.coordinates[0]],
            address: fDateTime(r.start_time),
            phoneNumber: user.phoneNumber,
            products: []
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
            {renderMap}
        </Grid>
    );
}

export default memo(UserActivityMapView);