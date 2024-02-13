"use client"

import React from "react";

import {
  Checkbox,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";

import { ICampaignItem } from "src/types/campaign";
import Iconify from "src/components/iconify";
import { useRouter } from 'src/routes/hooks';
import { paths } from "src/routes/paths";



export function CampaignTableRow({ campaign, campaignActions }: ICampaignItem) {
  const router = useRouter();

  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          data-testid="todo-checkbox"
          edge="start"
          color="primary"
          // checked={client.active}
          onClick={() => {
            // clientActions.toggleClientStatus(client);
          }}
        />
      </ListItemIcon>
      <ListItemText>{campaign.title}</ListItemText>
      <ListItemText>{campaign.access_code}</ListItemText>


      {/* <ListItemText>{client.active === true ? "true" : "false"}</ListItemText> */}

      {/* <ListItemText>{client.client_icon}</ListItemText>

      <ListItemText>{client.client_plan}</ListItemText> */}

      <ListItemSecondaryAction>
        <IconButton
          data-testid="todo-delete-button"
          edge="end"
          size="small"
          onClick={() => {
            console.log(campaign._id.toString(), 'CAMPAIGN')
            router.push(paths.dashboard.campaign.edit(campaign._id.toString()));
          }}
        >
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
