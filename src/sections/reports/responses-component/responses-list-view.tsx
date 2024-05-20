'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { FC, memo, useMemo, useState, useEffect } from 'react';

import { Card, Divider, MenuItem, Container } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';
import { fDateTime } from 'src/utils/format-time';

import { useRealmApp } from 'src/components/realm';
import { RHFSelect } from 'src/components/hook-form';
import { DataGridFlexible } from 'src/components/data-grid';
import { useSettingsContext } from 'src/components/settings';
import FormProvider from 'src/components/hook-form/form-provider';
import { IColumn } from 'src/components/data-grid/data-grid-flexible';
import { numericFilterOperators } from 'src/components/data-grid/ranger-slider-filter';

import { IReport, IFilledReport, IReportQuestion } from 'src/types/realm/realm-types';

const OPTIONS = [
  { value: false, label: 'Hide' },
  { value: true, label: 'Show' },
];
export interface AnswerObject {
  _id: string; // The new 'id' key
  [key: string]: string | unknown; // Dynamic keys for questions with their answers
}
const ResponsesGridView: FC<{ report?: IReport; questions?: IReportQuestion[] }> = ({
  report,
  questions,
}) => {
  const settings = useSettingsContext();

  const { currentUser } = useRealmApp();

  const loadingReport = useBoolean();

  const [answers, setAnswers] = useState<AnswerObject[] | null>(null);

  const [columns, setColumns] = useState<IColumn[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportAnswersError, setReportAnswerError] = useState(null);

  const showLoader = useShowLoader(loadingReport.value, 500);

  const id = useMemo(() => report?._id.toString(), [report]);

  const ResponseSchema = Yup.object().shape({
    showFiltered: Yup.boolean().typeError('Must be either true or false'),
  });

  const defaultValues = {
    showFiltered: true,
  };

  const methods = useForm({
    resolver: yupResolver(ResponseSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const showFl = watch('showFiltered');

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
  );

  useEffect(() => {
    if (id && questions) {
      loadingReport.onTrue();
      setReportAnswerError(null);
      currentUser?.functions
        ?.getFilledReports(id, showFl)
        .then((res: IFilledReport[]) => {
          const resAnswers = res.map((x) => [
            ...x.answers.map((y) => ({ userName: x.userName, createdAt: x.createdAt, ...y })),
          ]);

          // const qObj: { [key: string]: { text: string, order: number } } = {}

          // questions.forEach(x => {
          //     qObj[x._id.toString()] = {

          //         field: x._id,
          //         label: x.text,
          //         order: x.order,
          //         type: x.input_type
          //     }
          // })
          const d: IColumn[] = [
            {
              field: 'userName',
              label: 'User',
              order: -2,
              type: 'string',
            },
            {
              field: 'createdAt',
              label: 'Date Filled',
              order: -1,
              type: 'date',
            },
            ...questions.map((z) => {
              const r = {
                field: z._id.toString(),
                label: z.text,
                order: z.order,
                type: z.input_type,
              };
              if (z.input_type === 'number') {
                // @ts-expect-error expected
                r.filterOperators = numericFilterOperators;
              }
              return r;
            }),
            {
              field: 'actions',
              label: 'Actions',
              order: Number.MAX_SAFE_INTEGER,
              type: 'actions',
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
              },
            },
          ];

          setColumns(d);

          const answs = resAnswers.map((x) => {
            const usrNm = Array.isArray(x) ? x[0]?.userName : 'NA';
            const dt = Array.isArray(x) ? x[0]?.createdAt : new Date();
            const t: { _id: string; [key: string]: any } = {
              _id: uuidv4(),
              userName: usrNm,
              createdAt: fDateTime(dt),
            }; // Define `t` to explicitly allow string keys and any value

            d.forEach((z) => {
              const val = x.find((y) => y.question_id.toString() === z.field.toString());

              if (val) {
                let answr: unknown = val.answer;
                switch (val.type) {
                  case 'number':
                    answr = Number(answr ?? 0);
                    break;
                  case 'text':
                  case 'select':
                  case 'geopoint':
                    if (typeof answr === 'string' && answr.includes('"')) {
                      answr = answr.replace(/"/g, '');
                    } else {
                      answr = String(answr);
                    }
                    break;
                  default:
                    break;
                }
                t[z.field] = answr;
              }
            });
            return t;
          });
          setAnswers(answs);
        })
        .catch((e) => {
          setReportAnswerError(e.message);
          console.error('FAILED TO FETCH ANSWERS', e.message);
        })
        .finally(() => {
          loadingReport.onFalse();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, questions, showFl]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      console.log(data, 'DATA');
    } catch (error) {
      console.error(error);
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
            title={report?.title?.split(' ').join('-')}
            customFilters={{ filter: renderFilterRole }}
          />
        </Card>
      </Container>
    </FormProvider>
  );
};

export default memo(ResponsesGridView);
