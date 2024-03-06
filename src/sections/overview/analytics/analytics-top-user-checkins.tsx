import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';

import Iconify from 'src/components/iconify';

import { ITopUserByCheckins } from 'src/types/realm/realm-types';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  list: ITopUserByCheckins[];
}

export default function AnalyticsTopUserCheckins({ title, subheader, list, ...other }: Props) {
  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        action={
          <Button
            size="small"
            color="inherit"
            endIcon={<Iconify icon="eva:arrow-ios-forward-fill" width={18} sx={{ ml: -0.5 }} />}
          >
            View All
          </Button>
        }
      />

      <Stack spacing={3} sx={{ p: 3 }}>
        {list.map((user) => (
          <Stack direction="row" alignItems="center" key={user.userId}>
            <Avatar variant='rounded'  src={user.userURL} sx={{ width: 48, height: 48, mr: 2 }} />

            <ListItemText primary={user.userName} secondary={user.totalCheckIns} />

            <Tooltip title={`${user.userName} checkins`}>
              <IconButton>
                <Iconify icon="eva:diagonal-arrow-right-up-fill" />
              </IconButton>
            </Tooltip>
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}
