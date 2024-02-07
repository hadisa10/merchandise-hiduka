"use client"

import React from "react";

import {
  Checkbox,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { ICampaignItem } from "src/types/campaign";



export function CampaignTableRow({ campaign, campaignActions }: ICampaignItem) {
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

      {/* <ListItemText>{client.active === true ? "true" : "false"}</ListItemText> */}

      {/* <ListItemText>{client.client_icon}</ListItemText>

      <ListItemText>{client.client_plan}</ListItemText> */}

      {/* <ListItemSecondaryAction>
        <IconButton
          data-testid="todo-delete-button"
          edge="end"
          size="small"
          onClick={() => {
            campaignActions.deleteClient(campaign);
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </ListItemSecondaryAction> */}
    </ListItem>
  );
}
