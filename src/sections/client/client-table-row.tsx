"use client"

import React from "react";

import {
  Checkbox,
  ListItem,
  IconButton,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

import Iconify from "src/components/iconify";

import { IClientItem } from "src/types/client";



export function ClientTableRow({ client, clientActions }: IClientItem) {
  return (
    <ListItem>
      <ListItemIcon>
        <Checkbox
          data-testid="todo-checkbox"
          edge="start"
          color="primary"
          checked={client.active}
          onClick={() => {
            clientActions.toggleClientStatus(client);
          }}
        />
      </ListItemIcon>
      <ListItemText>{client.name}</ListItemText>

      <ListItemText>{client.active === true ? "true" : "false"}</ListItemText>

      <ListItemText>{client.client_icon}</ListItemText>

      <ListItemText>{client.client_plan}</ListItemText>

      <ListItemSecondaryAction>
        <IconButton
          data-testid="todo-delete-button"
          edge="end"
          size="small"
          onClick={() => {
            clientActions.deleteClient(client);
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
