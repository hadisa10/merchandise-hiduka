import { BSON } from "realm-web";
import { useRef, useMemo, useEffect } from "react";

type ChangeEvent<T> = {
  operationType: "insert" | "update" | "replace" | "delete";
  fullDocument: T;
  documentKey?: { _id: BSON.ObjectId };
};

const noop = () => { };
const defaultChangeHandlers = {
  onInsert: noop,
  onUpdate: noop,
  onReplace: noop,
  onDelete: noop,
};

interface ChangeHandlers<T> {
  onInsert?: (change: ChangeEvent<T>) => void;
  onUpdate?: (change: ChangeEvent<T>) => void;
  onReplace?: (change: ChangeEvent<T>) => void;
  onDelete?: (change: ChangeEvent<T>) => void;
}

export function useWatch<T>(
  collection: any, // Replace with the actual type for your collection
  changeHandlers: ChangeHandlers<T>
): void {
  const filter = useMemo(() => ({}), []);
  const handlers = { ...defaultChangeHandlers, ...changeHandlers };
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = {
      onInsert: handlers.onInsert,
      onUpdate: handlers.onUpdate,
      onReplace: handlers.onReplace,
      onDelete: handlers.onDelete,
    };
  }, [
    handlers.onInsert,
    handlers.onUpdate,
    handlers.onReplace,
    handlers.onDelete,
  ]);

  useEffect(() => {
    let stream: AsyncIterable<ChangeEvent<T>> | undefined;

    const watchSteam = async () => {
      stream = await collection?.watch({ filter });

      for await (const change of stream!) {
        switch (change.operationType) {
          case "insert": {
            handlersRef.current.onInsert?.(change);
            break;
          }
          case "update": {
            handlersRef.current.onUpdate?.(change);
            break;
          }
          case "replace": {
            handlersRef.current.onReplace?.(change);
            break;
          }
          case "delete": {
            handlersRef.current.onDelete?.(change);
            break;
          }
          default: {
            throw new Error(
              `Invalid change operation type: ${change.operationType}`
            );
          }
        }
      }
    };

    watchSteam();

    return () => {
      // Close the change stream in the effect cleanup
      (stream as any)?.return?.();
    };
  }, [collection, filter]);
}
