import { useState } from "react";

import { createObjectId } from "src/utils/realm";

import { IDraftClient, IDraftClientsHook } from "src/types/client";


export function useDraftClients(): IDraftClientsHook {
  const [drafts, setDrafts] = useState<IDraftClient[]>([]);

  const createDraftClient = () => {
    const draftTodo: IDraftClient = {
      _id: createObjectId(),
      name: "",
      owner_id: "",
      active: false,
    };
    setDrafts((d) => [...d, draftTodo]);
  };

  const setDraftClientName = (draft: IDraftClient, name: string) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], name },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const deleteDraftClient = (draft: IDraftClient) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [...oldDrafts.slice(0, idx), ...oldDrafts.slice(idx + 1)];
    });
  };

  return {
    draftClients: drafts,
    createDraftClient,
    setDraftClientName,
    deleteDraftClient,
  };
}
