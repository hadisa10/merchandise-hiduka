"use client"

import React, { useMemo, useState, useEffect } from "react";

import {
    Card,
    Container
} from "@mui/material";

import { useShowLoader } from "src/hooks/realm";
import { useBoolean } from "src/hooks/use-boolean";
import { useReports } from "src/hooks/realm/report/use-report-graphql";

import { fDateTime } from "src/utils/format-time";
import { formatFilterAndRemoveFields } from "src/utils/helpers";

import { DataGridFlexible } from "src/components/data-grid";
import { useSettingsContext } from "src/components/settings";
import { LoadingScreen } from "src/components/loading-screen";

import { IReportQuestion } from "src/types/realm/realm-types";

interface AnswerObject {
    _id: string; // The new 'id' key
    [key: string]: string | unknown; // Dynamic keys for questions with their answers
}

interface IColumnsObject {
    [key: string]: { text: string, order: number, value: any | null, type: string }
}
export default function AnswersGridView({ id, questions }: { id?: string, questions?: IReportQuestion[] }) {
    const settings = useSettingsContext();


    const { getReportAnswers } = useReports();

    const loadingReport = useBoolean()
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [answers, setAnswers] = useState<AnswerObject[] | null>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [reportAnswersError, setReportAnswerError] = useState(null)

    const showLoader = useShowLoader(loadingReport.value, 500)

    const cleanedReports = useMemo(() => {
        if (!Array.isArray(answers)) return []
        const filtered = formatFilterAndRemoveFields(
            answers,
            // @ts-expect-error expected
            ["__typename"],
            [
                {
                    key: "updatedAt",
                    formatter: fDateTime,
                },
                {
                    key: "createdAt",
                    formatter: fDateTime,
                }
            ],
            undefined,
            ["name", "creator"]
        ) ?? []
        return filtered
    }, [answers])


    // useEffect(() => {
    //     console.log("TEST")
    //     if (id && questions) {
    //         loadingReport.onTrue();
    //         setReportAnswerError(null);
    //         getReportAnswers(id.toString()).then(res => {
    //             const flattenedAnswers = flatten(res.map(x => x.answers));
    //             // First, sort the questions based on their 'order' key
    //             const sortedQuestions = questions.slice().sort((a, b) => {
    //                 // Treat undefined order as greater than any number
    //                 const orderA = a.order === undefined ? Number.MAX_SAFE_INTEGER : a.order;
    //                 const orderB = b.order === undefined ? Number.MAX_SAFE_INTEGER : b.order;

    //                 return orderA - orderB;
    //             });

    //             // Define the type for the accumulator and the objects it will contain
    //             type AnswerObject = { [key: string]: string };

    //             const matchedAnswers = flattenedAnswers.reduce<AnswerObject[]>((acc, answer) => {
    //                 const matchedQuestion = sortedQuestions.find(question => question._id.toString() === answer.question_id.toString());
    //                 if (matchedQuestion) {
    //                     // Add the matched question-answer pair to the accumulator array
    //                     acc.push({ [matchedQuestion.text]: answer.answer });
    //                 }
    //                 return acc;
    //             }, []); // Initialize the accumulator as an empty array of AnswerObjects

    //             setAnswers(matchedAnswers);
    //         }).catch(e => {
    //             setReportAnswerError(e.message)
    //             console.error("FAILED TO FETCH ANSWERS", e.message)
    //         }).finally(() => {
    //             loadingReport.onFalse()
    //         })
    //     }
    // }, [id])
    useEffect(() => {
        if (id && questions) {
            loadingReport.onTrue();
            setReportAnswerError(null);
            getReportAnswers(id.toString()).then(res => {

                const resAnswers = res.map(x => x.answers);
                console.log(res, 'RES')

                const qObj: IColumnsObject = {}

                questions.forEach(x => {
                    if (x._id && x.text) {
                        qObj[x._id.toString()] = {
                            text: x.text,
                            order: x.order,
                            type: x.input_type,
                            value: null
                        }
                    }

                })

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const answs = resAnswers.forEach((x) => {
                    const n: IColumnsObject = Object.assign(qObj);
                    // const t: { _id: string, [key: string]: any } = {
                    //     _id: uuidv4(),
                    // }; // Define `t` to explicitly allow string keys and any value

                    x.forEach(z => {
                        const o = n[z.question_id.toString()];
                        o.value = z.answer;
                    })

                    // return t
                })
                // setAnswers(answs)

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
                {!showLoader && <DataGridFlexible data={cleanedReports} getRowIdFn={(row) => row._id.toString()} />}
            </Card>
        </Container>
    );
}
