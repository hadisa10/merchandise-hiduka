'use client';

import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { PaperProps } from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { ListItem, ButtonBase } from '@mui/material';

import { RouterLink } from 'src/routes/components';

import { useBoolean } from 'src/hooks/use-boolean';
import { useRolePath } from 'src/hooks/use-path-role';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import { ICampaign } from 'src/types/realm/realm-types';
import { IAppCampaignITemActions } from 'src/types/campaign';

// ----------------------------------------------------------------------

type Props = PaperProps & {
  index: number;
  campaign: ICampaign;
  actions: IAppCampaignITemActions;
};

const AppCampaignItem = forwardRef<HTMLAnchorElement, Props>(
  ({ campaign, index, actions, sx, ...other }, ref) => {
    const theme = useTheme();

    const rolePath = useRolePath();

    const openDetails = useBoolean();

    // const handleToggleUnique = (event: React.MouseEvent<HTMLButtonElement>) => {
    //   event.stopPropagation(); // Prevent click event from bubbling up
    //   // Your toggle logic here
    // };

    const renderInputType = (
      <Iconify
        icon={
          'ic:baseline-help-outline' // Default icon if no match
        }
        sx={{
          position: 'absolute',
          top: 4,
          right: 4,
          color: (() => {
            switch (campaign.title) {
              case 'text':
              case 'number':
              case 'select':
              case 'radio':
              case 'checkbox':
              case 'date':
              case 'email':
              case 'file':
              case 'image':
              case 'range':
              case 'url':
                return 'primary.main'; // Change color based on input type if needed
              default:
                return 'action.active';
            }
          })(),
        }}
      />
    );

    const renderStartInfo = (
      <Stack
        direction="row"
        alignItems="center"
        sx={{ typography: 'caption', color: 'success.main', ml: -1 }}
        spacing={1}
      >
        <Iconify icon="ph:timer-thin" />
        <Box component="span" color="text.secodary">{`StartDate: ${fDate(
          campaign.startDate
        )}`}</Box>
      </Stack>
    );
    const renderEndDateInfo = (
      <Stack
        direction="row"
        alignItems="center"
        sx={{ typography: 'caption', color: 'warning.main', ml: -1 }}
        spacing={1}
      >
        <Iconify icon="ph:timer-thin" />
        <Box component="span" color="text.secodary">{`EndDate: ${fDate(campaign.endDate)}`}</Box>
      </Stack>
    );

    // const renderAddProducts = (
    //   <Stack
    //     direction="row"
    //     alignItems="center"
    //     sx={{ typography: 'caption', color: 'text.secondary', ml: -1 }}
    //   >
    //     <IconButton
    //       onClick={(e) => {
    //         e.stopPropagation();
    //       }}
    //       sx={{
    //         color: 'inherit',
    //       }}
    //     >
    //       <Iconify icon="mingcute:add-line" />
    //     </IconButton>
    //     <Box component="span">Products</Box>
    //   </Stack>
    // );

    return (
      <ListItem>
        <ButtonBase
          ref={ref}
          component={RouterLink}
          href={rolePath?.userApp?.edit(campaign._id.toString()) ?? rolePath?.root}
          sx={{
            width: 1,
            borderRadius: 1.5,
            p: 1,
            overflow: 'hidden',
            position: 'relative',
            bgcolor: 'background.default',
            boxShadow: theme.customShadows.z1,
            '&:hover': {
              boxShadow: theme.customShadows.z20,
            },
            ...(openDetails.value && {
              boxShadow: theme.customShadows.z20,
            }),
            ...sx,
          }}
          {...other}
        >
          {/* {!!campaign..length && renderImg} */}

          <Stack
            width={1}
            spacing={2}
            sx={{ px: 2, py: 2.5, position: 'relative', textAlign: 'left' }}
          >
            {renderInputType}

            <Typography variant="subtitle2">{campaign.title}</Typography>
            <Stack direction="row" justifyContent="space-between">
              {renderStartInfo}
              {renderEndDateInfo}
            </Stack>
          </Stack>
        </ButtonBase>
      </ListItem>
    );
  }
);

export default AppCampaignItem;
