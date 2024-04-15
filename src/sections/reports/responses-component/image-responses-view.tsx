'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { Slide, SlideImage } from 'yet-another-react-lightbox';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Divider, MenuItem } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';
import { fDateTime } from 'src/utils/format-time';

import { _mock } from 'src/_mock';

import Image from 'src/components/image';
import { useRealmApp } from 'src/components/realm';
import { RHFSelect } from 'src/components/hook-form';
import { LoadingScreen } from 'src/components/loading-screen';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import FormProvider from 'src/components/hook-form/form-provider';
import { IColumn } from 'src/components/data-grid/data-grid-flexible';

import { IReport, IFilledReport, IReportQuestion } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------



const OPTIONS = [
  { value: false, label: 'Hide' },
  { value: true, label: 'Show' },
];


interface AnswerObject {
  _id: string; // The new 'id' key
  [key: string]: string | unknown; // Dynamic keys for questions with their answers
  type: string;
}

interface ResponseImages {
  src: string,
  title: string,
  description: string,
}
// ----------------------------------------------------------------------

export default function ImageResponseView({ report, questions }: { report?: IReport, questions?: IReportQuestion[] }) {

  const { currentUser } = useRealmApp();

  const loadingReport = useBoolean()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<AnswerObject[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columns, setColumns] = useState<IColumn[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportAnswersError, setReportAnswerError] = useState(null)

  const showLoader = useShowLoader(loadingReport.value, 500)

  const [fetchedImages, setFetchedImages] = useState<ResponseImages[]>([]);
  const lightbox = useLightBox(fetchedImages)

  const id = useMemo(() => report?._id.toString(), [report])

  const ResponseSchema = Yup.object().shape({
    showFiltered: Yup.boolean().typeError("Must be either true or false"),
  });

  const defaultValues = {
    showFiltered: true,
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
    if (id && questions) {
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
          field: "userName",
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

        const imgs: ResponseImages[] = [];

        const answs = resAnswers.map((x) => {
          const usrNm = Array.isArray(x) ? x[0]?.userName : "NA";
          const dt = Array.isArray(x) ? x[0]?.createdAt : new Date()
          const t: { _id: string, [key: string]: any } = {
            _id: uuidv4(),
            userName: usrNm,
            createdAt: fDateTime(dt)
          }; // Define `t` to explicitly allow string keys and any value

          d.forEach(z => {
            const val = x.find(y => y.question_id.toString() === z.field.toString())


            if (val) {
              t[`${val.question_id}:::type`] = val.type;
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
                case "image":
                  imgs.push({
                    src: answr as string,
                    description: usrNm,
                    title: fDateTime(dt)
                  })
                  break;
                default:
                  break;
              }
              t[z.field] = answr;
            }
          })
          return t
        })
        setFetchedImages(imgs)
        // @ts-expect-error expected
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
    } catch (error) {
      console.error(error);
      reset();
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Container sx={{ my: 3 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              {renderFilterRole}
            </Grid>
            {showLoader && <Grid xs={12}><LoadingScreen /></Grid>}
            {!showLoader &&
              (fetchedImages.length > 0 ?
                <Grid xs={12} >
                  <Box
                    gap={1}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                    }}
                  >
                    {fetchedImages.map((slide) => {
                      const thumbnail = (slide as SlideImage).src;
                      return (
                        <Image
                          key={thumbnail}
                          alt={thumbnail}
                          src={thumbnail}
                          ratio="1/1"
                          onClick={() => lightbox.onOpen(`${thumbnail}`)}
                          sx={{
                            borderRadius: 1,
                            cursor: 'pointer',
                          }}
                        />
                      );
                    })}
                  </Box>
                </Grid>
                :
                <Box sx={{ textAlign: 'center', width: "100%", display: "flex", justifyContent: "center", alignItems: "center", pt: 10, pb: 15 }}>NO IMAGES FOUND</Box>
              )
            }
          </Grid>
        </Card>
      </Container>

      <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        slides={fetchedImages}
        index={lightbox.selected}
        disabledZoom={false}
        disabledTotal={false}
        disabledVideo={false}
        disabledCaptions={false}
        disabledSlideshow={false}
        disabledThumbnails={false}
        disabledFullscreen={false}
      />
    </FormProvider>
  );
}
