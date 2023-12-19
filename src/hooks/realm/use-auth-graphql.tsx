import { BSON } from "realm-web";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMemo, useState, useEffect } from "react";
import { gql, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

import {
  getTodoIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import { useWatch } from "./use-watch";
import { useCollection } from "./use-collection";
import atlasConfig from "../../atlasConfig.json";
import { useRealmApp } from "../../components/realm";

const { baseUrl, dataSourceName } = atlasConfig;

interface Todo {
  _id: string;
  owner_id: string;
  isComplete: boolean;
  summary: string;
}

interface TodoChange {
  fullDocument: Todo;
}

interface GraphqlResponse {
  data: {
    items: Todo[];
  };
}

function useApolloClient() {
  const realmApp = useRealmApp();
  if (!realmApp.currentUser) {
    throw new Error(`You must be logged in to call useApolloClient()`);
  }

  const client = useMemo(() => {
    const graphqlUri = `${baseUrl}/api/client/v2.0/app/${realmApp.id}/graphql`;

    async function getValidAccessToken() {
      const { exp } = jwtDecode<JwtPayload>(realmApp.currentUser?.accessToken as string) || {};
      if (!exp) {
        await realmApp.currentUser?.refreshCustomData();
      }
      const isExpired = Date.now() >= (exp || 0) * 1000;
      if (isExpired) {
        await realmApp.currentUser?.refreshCustomData();
      }
      return realmApp.currentUser?.accessToken;
    }

    return new ApolloClient({
      link: new HttpLink({
        uri: graphqlUri,
        fetch: async (uri, options = {}) => {
          const accessToken = await getValidAccessToken();
          options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
          };
          try {
            const response = await fetch(uri, {
              method: options.method,
              headers: options.headers,
              body: options.body,
            });
            return response;
          } catch (err) {
            console.error(err);
            // Returning a placeholder response in case of an error
            return new Response(null, { status: 500, statusText: "Internal Server Error" });
          }
        },
      }),
      cache: new InMemoryCache(),
    });
  }, [realmApp.currentUser, realmApp.id]);

  return client;
}
export function useTodos() {
  const realmApp = useRealmApp();
  const graphql = useApolloClient();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllTodos {
        items {
          _id
          owner_id
          isComplete
          summary
        }
      }
    `;
    graphql.query<GraphqlResponse>({ query }).then(({ data }) => {
      // @ts-expect-error
      setTodos(data.items);
      setLoading(false);
    });
  }, [graphql]);

  const todoItemCollection = useCollection({
    cluster: dataSourceName,
    db: "todo",
    collection: "Item",
  });

  useWatch(todoItemCollection, {
    onInsert: (change: TodoChange) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, change.fullDocument) ?? oldTodos.length;
        return idx === oldTodos.length
          ? addValueAtIndex(oldTodos, idx, change.fullDocument)
          : oldTodos;
      });
    },
    onUpdate: (change: TodoChange) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, change.fullDocument);
        if (!idx) {
          return oldTodos;
        }
        return updateValueAtIndex(oldTodos, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: TodoChange) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, change.fullDocument);
        if (!idx) {
          return oldTodos;
        }
        return replaceValueAtIndex(oldTodos, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setTodos((oldTodos) => {
        if (loading) {
          return oldTodos;
        }
        const idx = getTodoIndex(oldTodos, { _id: change.documentKey?._id ?? '' });
        if (!idx) {
          return oldTodos;
        }
        return idx >= 0 ? removeValueAtIndex(oldTodos, idx) : oldTodos;
      });
    },
  });

  const saveTodo = async (draftTodo: Partial<Todo>) => {
    if (draftTodo.summary) {
      draftTodo.owner_id = realmApp.currentUser?.id as string;
      try {
        await graphql.mutate({
          mutation: gql`
            mutation SaveItem($todo: ItemInsertInput!) {
              insertOneItem(data: $todo) {
                _id
                owner_id
                isComplete
                summary
              }
            }
          `,
          variables: { todo: draftTodo },
        });
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a todo multiple times (i.e. an existing todo has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  const toggleTodo = async (todo: Todo) => {
    await graphql.mutate({
      mutation: gql`
        mutation ToggleItemComplete($itemId: ObjectId!) {
          updateOneItem(query: { _id: $itemId }, set: { isComplete: ${!todo.isComplete} }) {
            _id
            owner_id
            isComplete
            summary
          }
        }
      `,
      variables: { itemId: todo._id },
    });
  };

  const deleteTodo = async (todo: Todo) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteItem($itemId: ObjectId!) {
          deleteOneItem(query: { _id: $itemId }) {
            _id
          }
        }
      `,
      variables: { itemId: todo._id },
    });
  };

  return {
    loading,
    todos,
    saveTodo,
    toggleTodo,
    deleteTodo,
  };
}
