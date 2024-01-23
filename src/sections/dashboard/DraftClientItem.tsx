import React from "react";

import {
  Button,
  ListItem,
  TextField,
  IconButton,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";

import Iconify from "src/components/iconify";

import { IDraftClientItem } from "src/types/client";


export function DraftClientItem({ draftClient, clientActions, draftClientActions }: IDraftClientItem) {
  return (
    <ListItem>
      <ListItemText inset>
        <TextField
          style={{ width: "100%" }}
          placeholder="What needs doing?"
          size="small"
          value={draftClient.name}
          onChange={(e) => {
            draftClientActions.setDraftClientName(draftClient, e.target.value);
          }}
        />
      </ListItemText>
      <ListItemSecondaryAction>
        <Button
          variant="outlined"
          size="small"
          onClick={async () => {
            await clientActions.saveClient(draftClient);
            draftClientActions.deleteDraftClient(draftClient);
          }}
        >
          Save
        </Button>
        <IconButton
          edge="end"
          size="small"
          onClick={() => {
            draftClientActions.deleteDraftClient(draftClient);
          }}
        >
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
