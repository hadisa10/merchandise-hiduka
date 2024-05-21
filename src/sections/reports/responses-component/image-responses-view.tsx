'use client';

import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { isEmpty, isString } from 'lodash';
import { enqueueSnackbar } from 'notistack';
import { useMemo, useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { SlideImage } from 'yet-another-react-lightbox';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { Chip, Stack, Button, Divider, MenuItem, Typography } from '@mui/material';

import { useShowLoader } from 'src/hooks/realm';
import { useBoolean } from 'src/hooks/use-boolean';

import uuidv4 from 'src/utils/uuidv4';
import { fDateTime } from 'src/utils/format-time';

import Image from 'src/components/image';
import { useRealmApp } from 'src/components/realm';
import { LoadingScreen } from 'src/components/loading-screen';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import FormProvider from 'src/components/hook-form/form-provider';
import { IColumn } from 'src/components/data-grid/data-grid-flexible';
import { RHFSelect, RHFAutocomplete } from 'src/components/hook-form';
import { numericFilterOperators } from 'src/components/data-grid/ranger-slider-filter';

import MultiDownloadButton from 'src/sections/_examples/extra/dowload/image-dowload-btn';

import { ICampaignUser } from 'src/types/user_realm';
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
  src: string;
  title: string;
  description: string;
  user: string;
}
// ----------------------------------------------------------------------

export default function ImageResponseView({
  report,
  questions,
}: {
  report?: IReport;
  questions?: IReportQuestion[];
}) {
  const { currentUser } = useRealmApp();

  const loadingReport = useBoolean();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [answers, setAnswers] = useState<AnswerObject[] | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [columns, setColumns] = useState<IColumn[] | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [reportAnswersError, setReportAnswerError] = useState(null);

  const showLoader = useShowLoader(loadingReport.value, 500);

  const [fetchedImages, setFetchedImages] = useState<ResponseImages[]>([]);

  const id = useMemo(() => report?._id.toString(), [report]);

  const ResponseSchema = Yup.object().shape({
    showFiltered: Yup.boolean().typeError('Must be either true or false'),
    users: Yup.array().of(Yup.string()),
  });

  const defaultValues = {
    showFiltered: true,
    users: [],
  };

  const methods = useForm({
    resolver: yupResolver(ResponseSchema),
    defaultValues,
  });

  const { reset, watch, handleSubmit } = methods;

  const showFl = watch('showFiltered');

  const realmApp = useRealmApp();

  const filterUser = watch('users');

  const loadingCampaignUsers = useBoolean();

  const [campaignUsers, setCampaignUsers] = useState<ICampaignUser[]>([]);

  // eslint-disable-next-line
  const [campaignUsersError, setCampaignUsersError] = useState(null);

  const showUserLoader = useShowLoader(loadingCampaignUsers.value, 500);

  const campaignId = useMemo(() => report?.campaign_id.toString(), [report?.campaign_id]);

  const images = useMemo(() => {
    if (Array.isArray(filterUser) && filterUser.length > 0) {
      return fetchedImages.filter((x) => {
        console.log(filterUser, 'FILTER USER');
        console.log(x.user, 'USER IN IMAGE');
        return filterUser.includes(x.user);
      });
    }
    return fetchedImages;
  }, [fetchedImages, filterUser]);

  const lightbox = useLightBox(images);

  useEffect(() => {
    if (isString(campaignId) && !isEmpty(campaignId)) {
      loadingCampaignUsers.onTrue();
      setCampaignUsersError(null);
      realmApp.currentUser?.functions
        .getCampaignUsers(campaignId.toString())
        .then((res) => {
          setCampaignUsersError(null);
          setCampaignUsers(res);
        })
        .catch((e) => {
          enqueueSnackbar('Failed to fetch campaign products', { variant: 'error' });
          setCampaignUsersError(e.message);
          console.error(e, 'REPORT FETCH');
        })
        .finally(() => {
          loadingCampaignUsers.onFalse();
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

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
  const renderFilterUser = (
    <RHFAutocomplete
      name="users"
      label="Users"
      placeholder="+ filter by user"
      multiple
      freeSolo
      fullWidth
      limitTags={2}
      loading={showUserLoader}
      sx={{
        maxWidth: 360,
      }}
      disableCloseOnSelect
      options={campaignUsers.map((usr) => usr._id)}
      getOptionLabel={(option) => {
        const user = campaignUsers?.find((usr) => usr._id === option);
        if (user) {
          return user?.displayName;
        }
        return option;
      }}
      renderOption={(props, option) => {
        const user = campaignUsers?.filter((usr) => usr._id === option)[0];

        if (!user?._id) {
          return null;
        }

        return (
          <li {...props} key={user._id.toString()}>
            {user?.displayName}
          </li>
        );
      }}
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => {
          const user = campaignUsers?.find((usr) => usr._id === option);
          return (
            <Chip
              {...getTagProps({ index })}
              key={user?._id ?? ''}
              label={user?.displayName ?? ''}
              size="small"
              color="info"
              variant="soft"
            />
          );
        })
      }
    />
  );
  const onResetFilters = () => {
    reset({
      showFiltered: true,
      users: [],
    });
  };

  useEffect(() => {
    if (id && questions) {
      loadingReport.onTrue();
      setReportAnswerError(null);
      currentUser?.functions
        ?.getFilledReports(id, showFl)
        .then((res: IFilledReport[]) => {
          const resAnswers = res.map((x) => [
            ...x.answers.map((y) => ({
              userName: x.userName,
              userId: x.user_id,
              createdAt: x.createdAt,
              ...y,
            })),
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

          const imgs: ResponseImages[] = [];

          console.log(imgs, 'IMAGES 1');

          const answs = resAnswers.map((x) => {
            const usrNm = Array.isArray(x) ? x[0]?.userName : 'NA';
            const usrId = Array.isArray(x) ? x[0]?.userId : 'NA';

            const dt = Array.isArray(x) ? x[0]?.createdAt : new Date();
            const t: { _id: string; [key: string]: any } = {
              _id: uuidv4(),
              userName: usrNm,
              createdAt: fDateTime(dt),
            }; // Define `t` to explicitly allow string keys and any value

            d.forEach((z) => {
              const val = x.find((y) => y.question_id.toString() === z.field.toString());
              console.log(val?.type, 'TYPE');
              if (val) {
                t[`${val.question_id}:::type`] = val.type;
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
                  case 'image':
                    imgs.push({
                      src: answr as string,
                      description: `${usrNm}`,
                      title: `${val.question_text}: ${fDateTime(dt)}`,
                      user: usrId?.toString() ?? '',
                    });
                    break;
                  default:
                    break;
                }
                t[z.field] = answr;
              }
            });
            return t;
          });
          setFetchedImages(imgs);
          // @ts-expect-error expected
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
      <Container sx={{ my: 3 }}>
        <Card sx={{ p: 2 }}>
          <Grid container spacing={3}>
            <Grid xs={12}>
              <Stack direction="row" spacing={3}>
                {renderFilterRole}
                {renderFilterUser}
                <Button variant="soft" onClick={onResetFilters} color="error">
                  Clear
                </Button>

                <Stack direction="row" flexGrow={2} spacing={3} justifyContent="flex-end">
                  {images.length > 0 && (
                    <MultiDownloadButton
                      size="large"
                      urls={images.map((x) => ({
                        src: x.src,
                        name: `${x.description}${x.title}-${x.src.split('/').pop() ?? ''}`,
                      }))}
                    />
                  )}
                </Stack>
              </Stack>
            </Grid>
            {showLoader && (
              <Box
                sx={{
                  textAlign: 'center',
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  pt: 10,
                  pb: 15,
                }}
              >
                <LoadingScreen />
              </Box>
            )}
            {!showLoader &&
              (images.length > 0 ? (
                <Grid xs={12}>
                  <Box
                    gap={1}
                    display="grid"
                    gridTemplateColumns={{
                      xs: 'repeat(2, 1fr)',
                      sm: 'repeat(3, 1fr)',
                      md: 'repeat(4, 1fr)',
                    }}
                  >
                    {images.map((slide) => {
                      const thumbnail = (slide as SlideImage).src;
                      return (
                        <Stack>
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
                          <Typography
                            variant="caption"
                            color={(theme) => theme.palette.text.secondary}
                            sx={{ mt: 1, textAlign: 'start', textTransform: 'capitalize' }}
                          >
                            {slide.title?.toLocaleLowerCase()}
                          </Typography>
                          <Typography
                            variant="caption"
                            color={(theme) => theme.palette.text.secondary}
                            sx={{ mt: 1, textAlign: 'start', textTransform: 'capitalize' }}
                          >
                            {slide.description?.toLocaleLowerCase()}
                          </Typography>
                          <MultiDownloadButton
                            size="small"
                            urls={[
                              {
                                src: slide.src,
                                name: `${slide.description}-${slide.src.split('/').pop() ?? ''}`,
                              },
                            ]}
                          />
                        </Stack>
                      );
                    })}
                  </Box>
                </Grid>
              ) : (
                <Box
                  sx={{
                    textAlign: 'center',
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pt: 10,
                    pb: 15,
                  }}
                >
                  NO IMAGES FOUND
                </Box>
              ))}
          </Grid>
        </Card>
      </Container>

      <Lightbox
        open={lightbox.open}
        close={lightbox.onClose}
        slides={images}
        index={lightbox.selected}
        disabledZoom={false}
        disabledTotal={false}
        disabledVideo={false}
        disabledCaptions={false}
        disabledSlideshow={false}
        disabledThumbnails={false}
        disabledFullscreen={false}
        disabledDownload
      />
    </FormProvider>
  );
}
