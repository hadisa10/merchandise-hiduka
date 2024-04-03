import { enqueueSnackbar } from 'notistack';
import { isAfter, isBefore } from 'date-fns';
import { memo, useMemo, useState, useEffect, useCallback } from 'react';
import { m, LazyMotion, domAnimation, AnimatePresence } from 'framer-motion';

import Grid from '@mui/system/Unstable_Grid/Grid';
import { Box, Tab, Tabs, Stack, IconButton, Typography } from '@mui/material';
import { MobileDateTimePicker, DesktopDateTimePicker } from '@mui/x-date-pickers';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import Iconify from 'src/components/iconify';
import { useRealmApp } from 'src/components/realm';

import { IUser } from 'src/types/user_realm';
import { ICampaign } from 'src/types/realm/realm-types';

import UserActivityMapView from './user-activity-map-view';
import UserActivityDataGrid from './user-activity-data-grid';

export const USER_DETAILS_TAB = [
    { value: 'checkins', label: 'Check Ins' },
    { value: 'sales', label: 'Sales' },
];

const UserActivityView = ({ campaign }: { campaign: ICampaign }) => {
    const checkInRouteView = useBoolean();

    const mdUp = useResponsive('up', 'md');

    const [currentTab, setCurrentTab] = useState('checkins');

    const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

    const [endDate, setEndDate] = useState<Date | null>(new Date());

    const [startDate, setStartDate] = useState<Date | null>(campaign?.startDate ? new Date(campaign.startDate) : new Date());

    const endDateError = useMemo(() => {
        if (!(endDate && startDate)) return false;
        return isAfter(startDate, endDate)
    }, [startDate, endDate])

    const startDateError = useMemo(() => {
        if (!(endDate && startDate)) return false;
        return isBefore(endDate, startDate)
    }, [startDate, endDate])

    const realmApp = useRealmApp();

    const metricsloading = useBoolean(true)

    const [checkinMetrics, setUserCheckinMetrics] = useState<any[] | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (!metricsloading.value && campaign?._id) {
            metricsloading.onTrue()
            setError(null);
            realmApp.currentUser?.functions.getUserCampaignCheckinMetrics(campaign._id, startDate, endDate).then((data: any[]) => setUserCheckinMetrics(data))
                .catch((e) => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get your ", { variant: "error" })
                }
                )
                .finally(() => metricsloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [metricsloading.value, campaign?._id, startDate, endDate])


    console.log(checkinMetrics, 'METRICS')


    const handleOpenCheckInRouteView = useCallback((user: IUser) => {
        if (user) {
            checkInRouteView.onTrue();
            setSelectedUser(user);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaign._id])

    const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
        setCurrentTab(newValue);
    }, []);

    // Adjusted animation parameters for smoothness
    const fadeInOut = {
        initial: { opacity: 0 },
        animate: { opacity: 1, transition: { duration: 0.5 } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    const slideIn = {
        initial: { opacity: 0, x: 100 },
        animate: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, x: +100, transition: { duration: 0.2 } }
    };

    const renderTabs = (
        <Tabs
            orientation={mdUp ? "vertical" : "horizontal"}
            variant="scrollable"
            value={currentTab}
            onChange={handleChangeTab}
            sx={{
                mb: { xs: 1, md: 2 },
                height: 500,
                borderRight: 1, borderColor: 'divider'
            }}
        >
            {USER_DETAILS_TAB.map((tab) => (
                <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                />
            ))}
        </Tabs>
    );

    const renderDesktopTime = (
        <>
            <Grid xs={12} md={4} px={2}>
                <DesktopDateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    onChange={(newValue) => {
                        if (newValue) {
                            setStartDate(newValue)
                        }
                    }}
                    label="Start date"
                    format="dd/MM/yyyy"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            error: startDateError,
                            helperText: startDateError && "End date cannot be before the start date"
                        },
                    }}
                />
            </Grid>
            <Grid xs={12} md={4} px={2}>
                <DesktopDateTimePicker
                    value={endDate ? new Date(endDate) : new Date()}
                    onChange={(newValue) => {
                        if (newValue) {
                            setEndDate(newValue)
                        }
                    }}
                    label="End date"
                    format="dd/MM/yyyy"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            error: endDateError,
                            helperText: endDateError && "Start date cannot be after end date"
                        },
                    }}
                />
            </Grid>
        </>
    )

    const renderMobileTime = (
        <>
            <Grid xs={12} md={4}>
                <MobileDateTimePicker
                    value={startDate ? new Date(startDate) : new Date()}
                    onChange={(newValue) => {
                        if (newValue) {
                            setStartDate(newValue)
                        }
                    }}
                    label="Start date"
                    format="dd/MM/yyyy"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            error: startDateError,
                            helperText: startDateError && "End date cannot be before the start date"
                        },
                    }}
                />
            </Grid>
            <Grid xs={12} md={4}>
                <MobileDateTimePicker
                    value={endDate ? new Date(endDate) : new Date()}
                    onChange={(newValue) => {
                        if (newValue) {
                            setEndDate(newValue)
                        }
                    }}
                    label="End date"
                    format="dd/MM/yyyy"
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: "small",
                            error: endDateError,
                            helperText: endDateError && "Start date cannot be after end date"
                        },
                    }}
                />
            </Grid>
        </>
    )

    return (
        <LazyMotion features={domAnimation}>

            <AnimatePresence mode='wait'>
                {!checkInRouteView.value && (
                    <m.div {...fadeInOut} key="userActivityDataGrid">
                        <UserActivityDataGrid campaign={campaign} handleOpenCheckInRouteView={handleOpenCheckInRouteView} />
                    </m.div>
                )}
                {checkInRouteView.value && selectedUser && (
                    <m.div {...slideIn} key="selectedUserActivity">
                        <Grid container spacing={1}>

                            <Grid xs={12} md={2}>
                                <Typography variant='h6' color="text.secondary">
                                    {selectedUser.displayName.toUpperCase()}
                                </Typography>
                            </Grid>
                            {mdUp && renderDesktopTime}
                            {!mdUp && renderMobileTime}

                            <Grid xs={12} md={2} component={Stack} justifyContent="center" alignItems="end">
                                <Box>
                                    <IconButton onClick={checkInRouteView.onFalse} color="error">
                                        <Iconify icon="mingcute:close-line" />
                                    </IconButton>
                                </Box>
                            </Grid>
                            <Grid xs={12} md={1.5}>
                                {renderTabs}
                            </Grid>

                            <Grid xs={12} md={10.5} px={2}>
                                {
                                    currentTab === "checkins" && campaign._id &&
                                    <UserActivityMapView
                                        user={selectedUser}
                                        startDate={startDate}
                                        endDate={endDate}
                                        campaignId={campaign._id.toString()}
                                        handleNewRouteOpen={() => console.log("OPEN")}
                                        handleAddNewRoute={() => console.log("NEW ROUTE")}
                                        handleRemoveNewRoute={() => console.log("REMOVE")}
                                    />
                                }


                            </Grid>
                        </Grid>
                    </m.div>
                )}
            </AnimatePresence>
        </LazyMotion >
    );
};

export default memo(UserActivityView);
