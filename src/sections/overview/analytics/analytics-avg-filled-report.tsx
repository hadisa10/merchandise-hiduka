import { useMemo } from 'react';

import Stack from '@mui/material/Stack';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import { fShortenNumber } from 'src/utils/format-number';

import { IAdminDashboardAvgAnswersPerDay } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: IAdminDashboardAvgAnswersPerDay[];
}

export default function AnalyticsAvarageFilledReport
({ title, subheader, list, ...other }: Props) {

  const total = useMemo(() => list.reduce((accumulator, item) => accumulator + item.avgAnswersPerDay, 0)/list.length ,[list])

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={`Daily Avg ${fShortenNumber(total)}`}
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((avg) => (
          <Stack direction="row" alignItems="center" key={avg.reportId}>
            <ListItemText primary={avg.reportName} secondary={fShortenNumber(avg.avgAnswersPerDay)} />
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
