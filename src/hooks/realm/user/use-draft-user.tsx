import { useState } from "react";

import { createObjectId } from "src/utils/realm";

import { IDraftUser, IDraftUsersHook } from "src/types/user_realm";

export function useDraftUsers(): IDraftUsersHook {
  const [drafts, setDrafts] = useState<IDraftUser[]>([]);

  const createDraftUser = () => {
    const draftTodo: IDraftUser = {
      _id: createObjectId(),
      email: "",
      isPublic: false,
      displayName: "",
      city: "",
      state: "",
      about: "",
      country: "",
      address: "",
      zipCode: "",
      role: "",
      phoneNumber: "",
      photoURL: "",
      isVerified: false,
      company: "",
      status: "pending",
      active: false
    };
    setDrafts((d) => [...d, draftTodo]);
  };

  const setDraftUserName = (draft: IDraftUser, displayName: string) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], displayName },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const deleteDraftUser = (draft: IDraftUser) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [...oldDrafts.slice(0, idx), ...oldDrafts.slice(idx + 1)];
    });
  };

  return {
    draftUsers: drafts,
    createDraftUser,
    setDraftUserName,
    deleteDraftUser,
  };
}
