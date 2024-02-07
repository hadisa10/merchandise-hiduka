"use client";
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import { List, Avatar, Divider, ListItem, IconButton, Pagination, ListItemText, ListItemAvatar } from '@mui/material';
import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';
import { IRoute } from './campaign-new-edit-form';

export function RoutesList({ routes }: { routes: IRoute[]; }) {
  const count = 5;

  return <Grid xs={12} md={4}>
    <Card sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h6">
          Routes
        </Typography>

        <IconButton color='success' size="small">
          <Iconify icon="mingcute:add-line" />
        </IconButton>
      </Stack>
      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
        List of routes
      </Typography>
      <RHFTextField name="search" label="Search" size="small" />
      <List dense sx={{ maxHeight: 250, overflowY: 'auto', }}>
        {Array.isArray(routes) && routes.map(route => (
          <>
            <ListItem
              secondaryAction={<Stack direction="row" justifyContent="space-between">
                <IconButton edge="end" aria-label="details" size="small">
                  <Iconify icon="solar:pen-bold" width={18} />
                </IconButton>
                <IconButton edge="end" aria-label="delete" color="error" size='small'>
                  <Iconify icon="solar:trash-bin-trash-bold" width={18} />
                </IconButton>
              </Stack>}
            >
              <ListItemAvatar>
                <Avatar variant='rounded'>
                  R
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary="Route item"
                secondary="details" />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
      <Pagination shape="rounded" count={count} showFirstButton showLastButton />


      <Stack justifyContent="center" alignItems="start" sx={{ mt: 3 }}>
        <Button variant="soft" color="error" size='small'>
          Clear Routes
        </Button>
      </Stack>
    </Card>
  </Grid>;
}
