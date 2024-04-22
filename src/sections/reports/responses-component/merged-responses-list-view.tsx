"use client"

import * as Yup from 'yup';
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from "@hookform/resolvers/yup";
import React, { FC, memo, useMemo, useState, useEffect } from "react";

import {
    Card,
    Chip,
    Divider,
    MenuItem,
    Container
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";

import uuidv4 from "src/utils/uuidv4";
import { fDateTime } from "src/utils/format-time";

import { useRealmApp } from "src/components/realm";
import { DataGridFlexible } from "src/components/data-grid";
import { useSettingsContext } from "src/components/settings";
import FormProvider from "src/components/hook-form/form-provider";
import { RHFSelect, RHFAutocomplete } from "src/components/hook-form";
import { IColumn } from "src/components/data-grid/data-grid-flexible";
import { numericFilterOperators } from "src/components/data-grid/ranger-slider-filter";

import { IReport, IFilledReport, IReportQuestion } from "src/types/realm/realm-types";

const OPTIONS = [
    { value: false, label: 'Hide' },
    { value: true, label: 'Show' },
];
interface AnswerObject {
    _id: string; // The new 'id' key
    [key: string]: string | unknown; // Dynamic keys for questions with their answers
}
const MergedResponsesGridView: FC<{ report?: IReport, questions?: IReportQuestion[] }> = ({ report, questions: q }) => {
    const settings = useSettingsContext();

    const { currentUser } = useRealmApp();

    const loadingReport = useBoolean()

    const [answers, setAnswers] = useState<AnswerObject[] | null>(null);

    const [columns, setColumns] = useState<IColumn[] | null>(null);

    const reportsloading = useBoolean(true)

    const [campaignReports, setCampaignReports] = useState<IReport[] | null>([]);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        if (report?.campaign_id) {
            reportsloading.onTrue()
            setError(null);
            currentUser?.functions.getCampaignReports(report?.campaign_id).then((data: IReport[]) => {
                if (Array.isArray(data)) setCampaignReports(data.filter(x => x._id.toString() !== report._id.toString()));
            })
                .catch((e) => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get your clients", { variant: "error" })
                }
                )
                .finally(() => reportsloading.onFalse())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [report?.campaign_id])

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reportAnswersError, setReportAnswerError] = useState(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [questions, setQuestions] = useState<IReportQuestion[] | undefined>(q)

    const showLoader = useShowLoader(loadingReport.value, 500)

    const id = useMemo(() => report?._id.toString(), [report])

    const ResponseSchema = Yup.object().shape({
        showFiltered: Yup.boolean().typeError("Must be either true or false"),
        reports: Yup.array().of(Yup.string()).nullable(),

    });

    const defaultValues = {
        showFiltered: true,
        reports: []
    };

    const methods = useForm({
        resolver: yupResolver(ResponseSchema),
        defaultValues,
    });

    const {
        reset,
        watch,
        handleSubmit
    } = methods;

    const showFl = watch("showFiltered")
    const reportsMg = watch("reports")
    console.log(campaignReports, "CAMPAIGN REPORTS")
    const renderMergeReport = (
        <RHFAutocomplete
            name="reports"
            label="Mergable Reports"
            placeholder="+ campaignReports"
            multiple
            freeSolo
            fullWidth
            sx={{
                maxWidth: 200,
                maxHeight: 100
            }}
            disableCloseOnSelect
            options={campaignReports?.map(rpt => rpt._id.toString()) ?? []}
            getOptionLabel={(option) => {
                const campaignReport = campaignReports?.find((usr) => usr._id.toString() === option);
                if (campaignReport) {
                    return campaignReport?.title
                }
                return option
            }}
            renderOption={(props, option) => {
                const campaignReport = campaignReports?.filter(
                    (usr) => usr._id.toString() === option
                )[0];

                if (!campaignReport?._id) {
                    return null;
                }

                return (
                    <li {...props} key={campaignReport._id.toString()}>
                        {campaignReport?.title}
                    </li>
                );
            }}
            renderTags={(selected, getTagProps) => (
                selected.map((option, index) => {
                    const campaignReport = campaignReports?.find((usr) => usr._id.toString() === option);
                    return (
                        <Chip
                            {...getTagProps({ index })}
                            key={campaignReport?._id.toString() ?? ""}
                            label={campaignReport?.title ?? ""}
                            size="small"
                            color="info"
                            variant="soft"
                        />
                    )
                })
            )
            }
        />
    )

    const renderFilterRole = (
        <RHFSelect name="showFiltered" label="Show Filtered Data" sx={{ maxWidth: 120 }}>
            <Divider sx={{ borderStyle: 'dashed' }} />
            {OPTIONS.map((option) => (
                // @ts-expect-error expected
                <MenuItem key={String(option.value)} value={option.value}>
                    {option.label}
                </MenuItem>
            ))}
        </RHFSelect>
    )

    useEffect(() => {
        if (q && report && Array.isArray(campaignReports) && campaignReports.length > 0 && Array.isArray(reportsMg) && reportsMg?.length > 0) {
            const qs = campaignReports?.filter(x => [...reportsMg]?.includes(x._id.toString())).map((x, i) => x.questions?.map((z) => ({ ...z, _id: `${x._id.toString()}:::${z._id.toString()}` }))).flat(1)
            const qUp = q.map((z) => ({ ...z, _id: `${report._id.toString()}:::${z._id.toString()}` }))
            const qsss = ([...qUp, ...qs]).filter((value, index, self) =>
                index === self.findIndex((t) => (
                    t.text.toLowerCase() === value.text.toLowerCase()
                ))
            );

            const d: IColumn[] = [{
                field: "user",
                label: "User",
                order: -2,
                type: "string"
            },
            {
                field: "createdAt",
                label: "Date Filled",
                order: -1,
                type: "date"
            }
                , ...qsss.map(z => {

                    const r = {
                        field: z._id.toString(),
                        label: z.text,
                        order: z.order,
                        type: z.input_type
                    }
                    if (z.input_type === "number") {
                        // @ts-expect-error expected
                        r.filterOperators = numericFilterOperators
                    }
                    return r;
                }
                ), {
                field: "actions",
                label: "Actions",
                order: Number.MAX_SAFE_INTEGER,
                type: "actions",
                action: {
                    view: {
                        label: 'View',
                        icon: 'solar:eye-bold',
                        action: (_id) => console.log(_id),
                    },
                    edit: {
                        label: 'Edit',
                        icon: 'solar:pen-bold',
                        action: (_id) => console.log(_id),
                    },
                    delete: {
                        label: 'Delete',
                        icon: 'solar:trash-bin-trash-bold',
                        action: (_id) => console.log(_id),
                    },
                }
            }]

            setColumns(d);
            console.log(d, "D")
            currentUser?.functions.getMergedFilledReports({ reports: [report._id.toString(), ...reportsMg] }).then((res: IFilledReport[]) => {
                const resAnswers = res.map(x => [...x.answers.map(y => ({ userName: x.userName, createdAt: x.createdAt, ...y }))]);
                const answs = resAnswers.map((x) => {
                    const usrNm = Array.isArray(x) ? x[0]?.userName : "NA";
                    const dt = Array.isArray(x) ? x[0]?.createdAt : new Date()
                    const t: { _id: string, [key: string]: any } = {
                        _id: uuidv4(),
                        user: usrNm,
                        createdAt: fDateTime(dt)
                    }; // Define `t` to explicitly allow string keys and any value
                    d.filter(a => a.field !== "user" && a.field !== "createdAt" && a.field !== "action").forEach(z => {
                        const val = x.find(y => {
                            const comp = `${y.report_id?.toString()}:::${y.question_id.toString()}` === z.field.toString();
                            if (comp) {
                                console.log(`${y.report_id?.toString()}:::${y.question_id.toString()} === ${z.field.toString()} => ${comp}`)
                            }
                            return `${y.report_id?.toString()}:::${y.question_id.toString()}` === z.field.toString()
                        })

                        if (val) {
                            let answr: unknown = val.answer
                            switch (val.type) {
                                case "number":
                                    answr = Number(answr ?? 0);
                                    break;
                                case "text":
                                case "select":
                                case "geopoint": ;
                                    if (typeof answr === "string" && answr.includes('"')) {
                                        answr = answr.replace(/"/g, '');
                                    } else {
                                        answr = String(answr);
                                    }
                                    break;
                                default:
                                    answr = "0"
                                    break;
                            }
                            t[z.field] = answr ?? 0;
                        } else {
                            if (z.type === "number") {
                                t[z.field] = 0
                            }
                            if (z.type === "text") {
                                t[z.field] = "0"
                            }
                            if (z.type === "geopoint") {
                                t[z.field] = "Failed to fetch location"
                            }
                            if (z.type === "select") {
                                t[z.field] = "0"
                            }
                        }
                    })
                    return t
                })
                setAnswers(answs)
            })
                .catch((e) => {
                    console.error(e)
                    setError(e);
                    enqueueSnackbar("Failed to get your merged reports", { variant: "error" })
                }
                )
                .finally(() => reportsloading.onFalse())
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reportsMg, campaignReports, report])

    useEffect(() => {
        if (id && questions && !(Array.isArray(reportsMg) && reportsMg?.length > 0)) {
            loadingReport.onTrue();
            setReportAnswerError(null);
            currentUser?.functions?.getFilledReports(id, showFl).then((res: IFilledReport[]) => {
                const resAnswers = res.map(x => [...x.answers.map(y => ({ userName: x.userName, createdAt: x.createdAt, ...y }))]);

                // const qObj: { [key: string]: { text: string, order: number } } = {}

                // questions.forEach(x => {
                //     qObj[x._id.toString()] = {

                //         field: x._id,
                //         label: x.text,
                //         order: x.order,
                //         type: x.input_type
                //     }
                // })
                const d: IColumn[] = [{
                    field: "user",
                    label: "User",
                    order: -2,
                    type: "string"
                },
                {
                    field: "createdAt",
                    label: "Date Filled",
                    order: -1,
                    type: "date"
                }
                    , ...questions.map(z => {

                        const r = {
                            field: z._id.toString(),
                            label: z.text,
                            order: z.order,
                            type: z.input_type
                        }
                        if (z.input_type === "number") {
                            // @ts-expect-error expected
                            r.filterOperators = numericFilterOperators
                        }
                        return r;
                    }
                    ), {
                    field: "actions",
                    label: "Actions",
                    order: Number.MAX_SAFE_INTEGER,
                    type: "actions",
                    action: {
                        view: {
                            label: 'View',
                            icon: 'solar:eye-bold',
                            action: (_id) => console.log(_id),
                        },
                        edit: {
                            label: 'Edit',
                            icon: 'solar:pen-bold',
                            action: (_id) => console.log(_id),
                        },
                        delete: {
                            label: 'Delete',
                            icon: 'solar:trash-bin-trash-bold',
                            action: (_id) => console.log(_id),
                        },
                    }
                }]

                setColumns(d);

                const answs = resAnswers.map((x) => {
                    const usrNm = Array.isArray(x) ? x[0]?.userName : "NA";
                    const dt = Array.isArray(x) ? x[0]?.createdAt : new Date()
                    const t: { _id: string, [key: string]: any } = {
                        _id: uuidv4(),
                        user: usrNm,
                        createdAt: fDateTime(dt)
                    }; // Define `t` to explicitly allow string keys and any value

                    d.forEach(z => {
                        const val = x.find(y => y.question_id.toString() === z.field.toString())

                        if (val) {
                            let answr: unknown = val.answer
                            switch (val.type) {
                                case "number":
                                    answr = Number(answr ?? 0);
                                    break;
                                case "text":
                                case "select":
                                case "geopoint": ;
                                    if (typeof answr === "string" && answr.includes('"')) {
                                        answr = answr.replace(/"/g, '');
                                    } else {
                                        answr = String(answr);
                                    }
                                    break;
                                default:
                                    break;
                            }
                            t[z.field] = answr ?? 0;
                        }
                    })
                    return t
                })
                setAnswers(answs)

            }).catch(e => {
                setReportAnswerError(e.message);
                console.error("FAILED TO FETCH ANSWERS", e.message);
            }).finally(() => {
                loadingReport.onFalse();
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, questions, showFl]);



    const onSubmit = handleSubmit(async (data) => {
        try {
            console.log(data, "DATA")
        } catch (e) {
            console.error(e);
            reset();
        }
    });

    return (
        <FormProvider methods={methods} onSubmit={onSubmit}>
            <Container
                maxWidth={settings.themeStretch ? false : 'lg'}
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Card
                    sx={{
                        height: { xs: 800, md: 600 },
                        flexGrow: { md: 1 },
                        display: { md: 'flex' },
                        flexDirection: { md: 'column' },
                    }}
                >
                    <DataGridFlexible
                        loading={showLoader}
                        data={answers ?? []}
                        getRowIdFn={(row) => row._id.toString()}
                        // @ts-expect-error expected
                        columns={columns ?? []}
                        // @ts-expect-error expected
                        title={report?.title?.split(" ").join("-")}
                        customFilters={{ filter: renderFilterRole, mergeFilter: renderMergeReport }} />
                </Card>
            </Container>
        </FormProvider>
    );
}

export default memo(MergedResponsesGridView)