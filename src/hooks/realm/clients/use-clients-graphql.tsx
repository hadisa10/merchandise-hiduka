import { BSON } from "realm-web";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useMemo, useState, useEffect } from "react";
import { gql, HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

import {
  getClientIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { useRealmApp } from "src/components/realm";
import { useRouter } from 'src/routes/hooks';


import { IClient, IClientHook, IDraftClient, IClientChange, IGraphqlResponse } from "src/types/client";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { paths } from "src/routes/paths";

const { baseUrl, dataSourceName } = atlasConfig;


function useApolloClient() {
  const router = useRouter();

  const realmApp = useRealmApp();

  if (!realmApp.currentUser) {
    router.replace(paths.auth.main.login);
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
export function useClients(): IClientHook {
  const realmApp = useRealmApp();
  const graphql = useApolloClient();
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllClients {
        clients {
          _id
          owner_id
          name
          active
        }
      }
    `;
    graphql.query<IGraphqlResponse>({ query }).then(({ data }) => {
      console.log(data, 'DATA')
      setClients(data.clients);
      setLoading(false);
    });
  }, [graphql]);

  const clientHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "clients",
  });

  useWatch(clientHidukaCollection, {
    onInsert: (change: IClientChange) => {
      setClients((oldClients) => {
        if (loading) {
          return oldClients;
        }
        const idx = getClientIndex(oldClients, change.fullDocument) ?? oldClients.length;
        return idx === oldClients.length
          ? addValueAtIndex(oldClients, idx, change.fullDocument)
          : oldClients;
      });
    },
    onUpdate: (change: IClientChange) => {
      setClients((oldClients) => {
        if (loading) {
          return oldClients;
        }
        const idx = getClientIndex(oldClients, change.fullDocument);
        if (!idx) {
          return oldClients;
        }
        return updateValueAtIndex(oldClients, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IClientChange) => {
      setClients((oldClients) => {
        if (loading) {
          return oldClients;
        }
        const idx = getClientIndex(oldClients, change.fullDocument);
        if (!idx) {
          return oldClients;
        }
        return replaceValueAtIndex(oldClients, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setClients((oldClients) => {
        if (loading) {
          return oldClients;
        }
        if (!change.documentKey) {
          return oldClients;
        }
        const idx = getClientIndex(oldClients, { _id: change.documentKey._id });
        if (!idx) {
          return oldClients;
        }
        return idx >= 0 ? removeValueAtIndex(oldClients, idx) : oldClients;
      });
    },
  });

  const saveClient = async (draftClient: IDraftClient) => {
    if (draftClient.name) {
      draftClient.owner_id = realmApp.currentUser?.id as string;
      try {
        await graphql.mutate({
          mutation: gql`
            mutation SaveClient($client: ClientInsertInput!) {
              insertOneClient(data: $client) {
                _id
                owner_id
                name
                active
              }
            }
          `,
          variables: { client: draftClient },
        });
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a client multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
      }
    }
  };

  const toggleClientStatus = async (client: IClient) => {
    await graphql.mutate({
      mutation: gql`
        mutation ToggleClientStatus($clientId: ObjectId!) {
          updateManyClients(query: { _id: $clientId }, set: { active: ${!client.active} }) {
            matchedCount
            modifiedCount
          }
        }
      `,
      variables: { clientId: client._id },
    });
  };

  const deleteClient = async (client: IClient) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteClient($clientId: ObjectId!) {
          deleteOneClient(query: { _id: $clientId }) {
            _id
          }
        }
      `,
      variables: { clientId: client._id },
    });
  };

  return {
    loading,
    clients,
    saveClient,
    toggleClientStatus,
    deleteClient,
  };
}
