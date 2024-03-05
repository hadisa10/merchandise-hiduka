"use client"

import React, { FC, memo, useMemo, useState, useEffect } from "react";

import {
    Card,
    Container
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";
import { useReports } from "src/hooks/realm/report/use-report-graphql";

import uuidv4 from "src/utils/uuidv4";

import { DataGridFlexible } from "src/components/data-grid";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";
import { IColumn } from "src/components/data-grid/data-grid-flexible";

import { IReport, IReportQuestion } from "src/types/realm/realm-types";

interface AnswerObject {
    _id: string; // The new 'id' key
    [key: string]: string | unknown; // Dynamic keys for questions with their answers
}
const ResponsesGridView: FC<{ report?: IReport, questions?: IReportQuestion[] }> = ({ report, questions }) => {
    const settings = useSettingsContext();

    const { getReportAnswers } = useReports();

    const loadingReport = useBoolean()

    const [answers, setAnswers] = useState<AnswerObject[] | null>(null);

    const [columns, setColumns] = useState<IColumn[] | null>(null);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reportAnswersError, setReportAnswerError] = useState(null)

    const showLoader = useShowLoader(loadingReport.value, 500)

    const id = useMemo(() => report?._id.toString(), [report])



    useEffect(() => {
        if (id && questions) {
            loadingReport.onTrue();
            setReportAnswerError(null);
            getReportAnswers(id).then(res => {

                const resAnswers = res.map(x => [...x.answers.map(y => ({ userName: x.userName, ...y }))]);

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
                    field: "userName",
                    label: "User",
                    order: -1,
                    type: "string"
                }, ...questions.map(z => {
                    const r = {
                        field: z._id.toString(),
                        label: z.text,
                        order: z.order,
                        type: z.input_type
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
                    const j = Array.isArray(x) ? x[0]?.userName : "NA"
                    const t: { _id: string, [key: string]: any } = {
                        _id: uuidv4(),
                        userName: j
                    }; // Define `t` to explicitly allow string keys and any value

                    d.forEach(z => {
                        const val = x.find(y => y.question_id.toString() === z.field.toString())

                        if (val) {
                            let answr: unknown = val.answer
                            switch (val.type) {
                                case "number":
                                    answr = Number(answr);
                                    break;
                                case "string":
                                    answr = String(answr);
                                    break;
                                default:
                                    break;
                            }
                            t[z.field] = answr;
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
    }, [id, questions]);


    return (
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
                {showLoader && <LoadingScreen />}
                {/* @ts-expect-error expected */}
                {!showLoader && columns && answers && <DataGridFlexible data={answers} getRowIdFn={(row) => row._id.toString()} columns={columns} title={report?.title?.split(" ").join("-")} />}
            </Card>
        </Container>
    );
}

export default memo(ResponsesGridView)