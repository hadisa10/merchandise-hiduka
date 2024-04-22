"use client"

import * as Yup from 'yup';
import { enqueueSnackbar } from "notistack";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { isEmpty, isNumber, isObject, isString } from "lodash";
import React, { useMemo, useState, useEffect, useCallback } from "react";

import { LoadingButton } from "@mui/lab";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { MobileDateTimePicker, DesktopDateTimePicker } from "@mui/x-date-pickers";
import {
    Card,
    Stack, Button, styled, useTheme, ButtonBase
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";
import { useResponsive } from "src/hooks/use-responsive";

import { fTimestamp, formatDifference } from "src/utils/format-time";

import { useRealmApp } from "src/components/realm";
import { SystemIcon } from "src/components/iconify";
import { DataGridFlexible } from "src/components/data-grid";
import FormProvider from "src/components/hook-form/form-provider";
import { IGenericColumn } from "src/components/data-grid/data-grid-flexible";

import AnalyticsWidgetSummary from "src/sections/overview/analytics/analytics-widget-summary";

import { IUser } from "src/types/user_realm";
import { IProductItem } from 'src/types/product';
import { ICampaign, ICampaignStock, ICampaignStockGridRow } from "src/types/realm/realm-types";

import AssignProductDialog from "./assign-product-dialog";

interface IUserActivityDataGridProps {
    campaign: ICampaign;
    handleOpenCheckInRouteView?: (user: IUser) => void;
}

// ----------------------------------------------------------------------

export const StyledLabel = styled('span')(({ theme }) => ({
    ...theme.typography.caption,
    width: "max-content",
    flexShrink: 0,
    color: theme.palette.text.secondary,
    fontWeight: theme.typography.fontWeightSemiBold,
}));

export default function UserStockDataGrid({ campaign, handleOpenCheckInRouteView }: IUserActivityDataGridProps) {
    // const { loading, clients } = useClients(false);

    const theme = useTheme();

    const loadingCampaignUsers = useBoolean()

    const openAssign = useBoolean();

    const realmApp = useRealmApp();

    const mdUp = useResponsive('up', 'md');

    const [campaignUsers, setCampaignUsers] = useState<ICampaignStockGridRow[]>([])

    const [snapshotDateTime, setSnapShotDateTime] = useState<Date>(new Date);


    const NewCurrectSchema = Yup.object().shape({
        snapshotDateTime: Yup.date()
            .transform((value, originalValue) => {
                // Check if the originalValue is a number (Unix timestamp in milliseconds)
                if (typeof originalValue === 'number') {
                    return new Date(originalValue);
                }
                // For string input, attempt to parse it as a date
                if (typeof originalValue === 'string') {
                    return new Date(originalValue);
                }
                return value;
            })
    })

    const defaultValues = useMemo(
        () => ({
            snapshotDateTime: new Date()
        }),
        []
    );

    const methods = useForm({
        resolver: yupResolver(NewCurrectSchema),
        defaultValues,
        mode: "all"
    });

    const {
        setValue,
        watch,
        control,
        handleSubmit,
        getFieldState,
        formState: { isSubmitting },
    } = methods;

    const { error: startDateError } = getFieldState("snapshotDateTime")

    console.log(isSubmitting, 'START DATE ERROR')

    const [selectedCampaignUsers, setSelectedCampaignUsers] = useState<ICampaignStockGridRow[] | null>(null)

    const [campaignProduct, setCampaignProducts] = useState<IProductItem[]>();

    const [productRank, setProductRank] = useState<IProductItem[]>([]);

    const campaignUserStockMetricsLoading = useBoolean();

    const showCampaignKPIMetricsLoader = useShowLoader((campaignUserStockMetricsLoading.value), 300);

    // eslint-disable-next-line
    const [campaignUsersError, setCampaignUsersError] = useState(null)

    const showLoader = useShowLoader(loadingCampaignUsers.value, 500);

    const campaignId = useMemo(() => campaign._id.toString(), [campaign._id])


    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId) && snapshotDateTime) {
            loadingCampaignUsers.onTrue()
            setCampaignUsersError(null)

            realmApp.currentUser?.functions.getCampaignStock(campaignId.toString(), snapshotDateTime.toISOString())
                .then((res: { campaignProducts: IProductItem[], usersWithStockInfo: ICampaignStock[] }) => {
                    setCampaignUsersError(null)

                    setCampaignProducts(res.campaignProducts);
                    const val: ICampaignStockGridRow[] = res.usersWithStockInfo.map(x => {
                        const t: { [key: string]: number; } = {};
                        x.stockInfo.forEach(z => {
                            t[z.productId.toString()] = z.latestStock
                            return z.productId;
                        })
                        return {
                            _id: x._id.toString(),
                            name: x.name,
                            ...t
                        }
                    })
                    setCampaignUsers(val)
                }
                )
                .catch(e => {
                    enqueueSnackbar("Failed to fetch campaign products", { variant: "error" })
                    setCampaignUsers(e.message)
                    console.error(e, "REPORT FETCH")
                })
                .finally(() => {
                    loadingCampaignUsers.onFalse()
                })
            console.log(snapshotDateTime, "SNAPSHOT CAMPAIGN 2dadsa@@@")

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId, snapshotDateTime])

    useEffect(() => {
        if (isString(campaignId) && !isEmpty(campaignId) && snapshotDateTime) {
            campaignUserStockMetricsLoading.onTrue()
            realmApp.currentUser?.functions.getCampaignStockMetrics(campaignId.toString(), snapshotDateTime.toISOString())
                .then((res: { campaignProducts: IProductItem[] }) => {
                    console.log(res, "RESP");
                    setProductRank(res.campaignProducts)
                }
                )
                .catch(e => {
                    enqueueSnackbar("Failed to fetch campaign products", { variant: "error" })
                    setCampaignUsers(e.message)
                    console.error(e, "REPORT FETCH")
                })
                .finally(() => {
                    campaignUserStockMetricsLoading.onFalse()
                })
            console.log(snapshotDateTime, "SNAPSHOT CAMPAIGN 2dadsa@@@")

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignId, snapshotDateTime])




    const handleAssignProductsToUser = useCallback((ids: string[]) => {
        openAssign.onTrue()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers])

    const handleBulkAssignProducts = useCallback((cmpUsers: ICampaignStockGridRow[]) => {
        if (cmpUsers) {
            setSelectedCampaignUsers(cmpUsers);
            openAssign.onTrue()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers])

    const handleEditRow = useCallback(
        (id: string) => {
            // const user = campaignUsers.find(campaignUser => campaignUser._id.toString() === id.toString());
            // if (user && handleOpenCheckInRouteView) {
            // handleOpenCheckInRouteView(user);
            // }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [campaignUsers]
    );

    const changedSnapshot = watch("snapshotDateTime")

    const columns: IGenericColumn<ICampaignStockGridRow>[] = useMemo(() => {
        const prds = campaignProduct?.map(x => ({
            field: x._id.toString(),
            label: x.name,
            type: "number",
            minWidth: 200
        })) ?? []
        const cols: Omit<IGenericColumn<ICampaignStock<string>>, "order">[] = [
            {
                field: "_id",
                label: "id",
                type: "string"
            },
            {
                field: "name",
                label: "Name",
                type: "main",
                minWidth: 300
            },
            // @ts-expect-error expected
            ...prds,
            {
                // @ts-expect-error expected
                field: "actions",
                label: "Actions",
                type: "actions",
                action: {
                    edit: {
                        label: 'Check Activity',
                        icon: 'material-symbols:eye-tracking-outline-rounded',
                        color: theme.palette.primary.main,
                        action: handleEditRow,
                    },
                    assignProduct: {
                        label: 'Assign Product',
                        color: theme.palette.info.main,
                        icon: 'fluent-mdl2:product-variant',
                        action: (id: string) => handleAssignProductsToUser([id]),
                    },
                }
            }


        ]
        console.log(prds, "PRDS")
        console.log(campaignProduct, "PRDS")
        return cols.map((c, i) => ({ ...c, order: i + 1 }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campaignUsers, campaignProduct])


    const cleanedUsers = useMemo(() => {
        if (!Array.isArray(campaignUsers)) return []
        return campaignUsers
    }, [campaignUsers])

    const totalStock = useMemo(() => Array.isArray(productRank) ? productRank.reduce((acc, item) => acc + ( isNumber(item.totalStock) ? item.totalStock : 0), 0) : 0 ,[productRank])
    const totalSold = useMemo(() => Array.isArray(productRank) ? productRank.reduce((acc, item) => acc + ( isNumber(item.totalSold) ? item.totalSold : 0), 0) : 0 ,[productRank])
    const topProduct = useMemo(() => Array.isArray(productRank) ? productRank[0]: null ,[productRank])


    const onSubmit = handleSubmit(async (data) => {
        console.log(data, "DATA")
        if (data.snapshotDateTime) {
            setSnapShotDateTime(data.snapshotDateTime)
        } else {
            console.log(data, "SNAPSHOT")
        }
    })

    return (
        <>
            <FormProvider methods={methods} onSubmit={onSubmit}>
                <Stack rowGap={2}>
                    <Grid container spacing={3}>
                        <Grid xs={12} display="flex" justifyContent="space-evenly" >
                            <Stack>
                                {!mdUp &&

                                    <Controller
                                        name="snapshotDateTime"
                                        control={control}
                                        render={({ field }) => <MobileDateTimePicker
                                            {...field}
                                            value={field.value ? new Date(field.value) : new Date()}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    field.onChange(fTimestamp(newValue));
                                                }
                                            }}
                                            label="Snapshot Date"
                                            format="dd/MM/yyyy hh:mm a"
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: isObject(startDateError),
                                                    helperText: isObject(startDateError) && startDateError.message,
                                                },
                                            }}
                                        />}
                                    />
                                }
                                {mdUp &&

                                    <Controller
                                        name="snapshotDateTime"
                                        control={control}
                                        render={({ field }) => <DesktopDateTimePicker
                                            {...field}
                                            value={field.value ? new Date(field.value) : new Date()}
                                            onChange={(newValue) => {
                                                if (newValue) {
                                                    field.onChange(fTimestamp(newValue));
                                                }
                                            }}
                                            label="Date"
                                            format="dd/MM/yyyy hh:mm a"
                                            slotProps={{
                                                textField: {
                                                    fullWidth: true,
                                                    error: isObject(startDateError),
                                                    helperText: isObject(startDateError) && startDateError.message,
                                                },
                                            }}
                                        />}
                                    />
                                }
                                <StyledLabel>{changedSnapshot ? formatDifference(new Date(changedSnapshot)) : formatDifference(new Date())}</StyledLabel>
                            </Stack>
                            <Stack direction="row" spacing={1} height="max-content" justifyContent="space-between">
                                <Button color="error" onClick={() => {
                                    setValue("snapshotDateTime", new Date())
                                }} variant="soft" >
                                    Clear
                                </Button>
                                <LoadingButton type="submit" loading={isSubmitting || showLoader || showCampaignKPIMetricsLoader} color="success" variant="contained">
                                    Get Snapshot
                                </LoadingButton>
                            </Stack>
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL STOCK")}
                                title="Total Stock"
                                total={totalStock}
                                color="error"
                                icon={<SystemIcon type="live" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL SOLD STOCK")}
                                title="Total Sold stock"
                                total={totalSold}
                                color="warning"
                                icon={<SystemIcon type="sale" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                        <Grid xs={12} sm={6} md={4}>
                            <AnalyticsWidgetSummary
                                sx={{ width: "100%" }}
                                component={ButtonBase}
                                onClick={() => console.log("TOTAL USERS IN CAMPAIGN")}
                                title={`Top Product in Stock: ${topProduct?.name ?? ""}`}
                                total={topProduct?.totalStock ?? 0}
                                color="info"
                                icon={<SystemIcon type="users" width={45} sx={{ color: 'info.main' }} />} // Example icon for engagement
                            />
                        </Grid>
                    </Grid>
                    <Card
                        sx={{
                            height: { xs: 800, md: 600 },
                            flexGrow: { md: 1 },
                            display: { md: 'flex' },
                            flexDirection: { md: 'column' },
                        }}
                    >

                        <DataGridFlexible
                            data={cleanedUsers}
                            getRowIdFn={(row) => row?._id?.toString()}
                            columns={columns}
                            loading={showLoader}
                            hideColumn={{ _id: false }}
                            title={`${campaign.title.split(" ").join("-")}-user-activity`}
                            customActions={{
                                routes: {
                                    label: "Assign Routes",
                                    color: "info",
                                    icon: "eos-icons:route", // Assuming the icon is specified as a string identifier for Iconify
                                    action: (selectedData: ICampaignStockGridRow[]) => console.log(selectedData, "USERS TO ASSIGN ROUTES")
                                },
                                products: {
                                    label: "Assign Product",
                                    color: "info",
                                    icon: "fluent-mdl2:product-variant", // Assuming the icon is specified as a string identifier for Iconify
                                    action: handleBulkAssignProducts
                                }
                                // delete: {
                                //     label: "Delete",
                                //     color: "error",
                                //     icon: "solar:trash-bin-trash-bold", // Assuming the icon is specified as a string identifier for Iconify
                                //     action: (selectedData: ICampaignUser[]) => console.log(selectedData, "IDS FOR DELETION")
                                // }
                            }}
                        />
                    </Card>
                </Stack>
            </FormProvider>
            {
                selectedCampaignUsers && <AssignProductDialog
                    open={openAssign.value}
                    onClose={openAssign.onFalse}
                    campaignId={campaignId}
                    users={selectedCampaignUsers}
                    handleAssignNewProduct={() => console.log("ASSIGN")}
                />
            }
        </>
    );
}
