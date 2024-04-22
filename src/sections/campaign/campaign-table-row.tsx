"use client"

import React, { useMemo } from "react";

import {
  Checkbox,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

import { useRouter } from 'src/routes/hooks';

import { getRolePath } from "src/utils/helpers";

import Iconify from "src/components/iconify";
import { useRealmApp } from "src/components/realm";

import { ICampaignItem } from "src/types/campaign";



export function CampaignTableRow({ campaign, campaignActions }: ICampaignItem) {
  const { currentUser } = useRealmApp();

  const role = useMemo(() => currentUser?.customData?.role as unknown as string, [currentUser?.customData?.role])

  const rolePath = getRolePath(role);

  const router = useRouter()
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
            // @ts-expect-error expected
            router.push(rolePath?.campaign.edit(campaign._id.toString()) ?? "#");
          }}
        >
          <Iconify icon="solar:pen-bold" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
