import { useState } from "react";
import * as Realm from "realm-web";

import { createObjectId } from "src/utils/realm";


interface DraftTodo {
  _id: Realm.BSON.ObjectId;
  summary: string;
  isComplete: boolean;
}

interface DraftTodosHook {
  draftTodos: DraftTodo[];
  createDraftTodo: () => void;
  setDraftTodoSummary: (draft: DraftTodo, summary: string) => void;
  deleteDraftTodo: (draft: DraftTodo) => void;
}

export function useDraftTodos(): DraftTodosHook {
  const [drafts, setDrafts] = useState<DraftTodo[]>([]);

  const createDraftTodo = () => {
    const draftTodo: DraftTodo = {
      _id: createObjectId(),
      summary: "",
      isComplete: false,
    };
    setDrafts((d) => [...d, draftTodo]);
  };

  const setDraftTodoSummary = (draft: DraftTodo, summary: string) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [
        ...oldDrafts.slice(0, idx),
        { ...oldDrafts[idx], summary },
        ...oldDrafts.slice(idx + 1),
      ];
    });
  };

  const deleteDraftTodo = (draft: DraftTodo) => {
    setDrafts((oldDrafts) => {
      const idx = oldDrafts.findIndex((d) => d._id === draft._id);
      return [...oldDrafts.slice(0, idx), ...oldDrafts.slice(idx + 1)];
    });
  };

  return {
    draftTodos: drafts,
    createDraftTodo,
    setDraftTodoSummary,
    deleteDraftTodo,
  };
}
