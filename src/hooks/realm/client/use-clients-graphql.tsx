import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { IClient, IClientHook, IDraftClient, IClientChange, IGraphqlResponse, IGraphqlClientResponse } from "src/types/client";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useClients(lazy: boolean = true): IClientHook {
  const graphql = useCustomApolloClient();
  const [clients, setClients] = useState<IClient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lazy) {
      const query = gql`
      query FetchAllClients {
        clients {
          _id
          creator{
            name
            email
          }
          users{
            name
            email
          }
          name
          active
          client_plan
          client_icon
          createdAt
          updatedAt
        }
      }
    `;
      graphql.query<IGraphqlResponse>({ query }).then(({ data }) => {
        console.log(data, 'DATA')
        setClients(data.clients);
        setLoading(false);
      });
    }
  }, [graphql, lazy]);

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
      const dt = new Date();
      const cpClient: IDraftClient & { createdAt: Date, updatedAt: Date } = {
        ...draftClient,
        createdAt: dt,
        updatedAt: dt
      }
      try {
        await graphql.mutate({
          mutation: gql`
            mutation SaveClient($client: ClientInsertInput!) {
              insertOneClient(data: $client) {
                _id
                creator {
                name
                }
                name
                active
              }
            }
          `,
          variables: { client: cpClient },
        });
      } catch (err) {
        if (err.message.match(/^Duplicate key error/)) {
          console.warn(
            `The following error means that this app tried to insert a client multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
          );
        }
        console.error(err);
        throw err;
      }
    }
  };

  const getClient = async (id: string) => {
    const resp = await graphql.query<IGraphqlClientResponse>({
      query: gql`
        query FetchClient($id: ObjectId!) {
          client(query: { _id: $id }) {
              _id
              creator{
                name
                email
              }
              users{
                name
                email
              }
              name
              active
              client_plan
              client_icon
              createdAt
              updatedAt
            }
        }
      `,
      variables: {
        id
      },
    });
    return resp.data.client;
  }

  const toggleClientStatus = async (client: IClient) => {
    await graphql.mutate({
      mutation: gql`
        mutation ToggleClientStatus($clientId: ObjectId!) {
          updateManyClients(query: { _id: $clientId }, set: { active: ${!client.active}, updatedAt: "${new Date().toISOString()}" }) {
            matchedCount
            modifiedCount
          }
        }
      `,
      variables: { clientId: client?._id },
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
      variables: { clientId: client?._id },
    });
  };

  return {
    loading,
    clients,
    saveClient,
    getClient,
    toggleClientStatus,
    deleteClient,
  };
}
