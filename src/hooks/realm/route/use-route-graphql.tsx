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

import { IRoute } from "src/types/realm/realm-types";
import { IRouteHook, IRouteChange, IGraphqlRoutesResponse, IGraphqlSearchRoutesResponse } from "src/types/routes";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useRealmRoutes(lazy: boolean = true): IRouteHook {
  const graphql = useCustomApolloClient();
  const [routes, setRoutes] = useState<IRoute[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!lazy) {
      const query = gql`
        query FetchRoutes {
          routes {
            _id
            businessSector
            campaigns
            createdAt
            fullAddress
            location {
              coordinates
              type
            }
            phoneNumber
            products {
              name
              product_id
              quantity
            }
            road
            updatedAt
            users
          }
        }
    `;
      graphql.query<IGraphqlRoutesResponse>({ query }).then(({ data }) => {
        console.log(data, 'DATA')
        setRoutes(data.routes);
        setLoading(false);
      });
    }

  }, [graphql, lazy]);

  const routesHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "routes",
  });

  useWatch(routesHidukaCollection, {
    onInsert: (change: IRouteChange) => {
      setRoutes((oldRoutes) => {
        if (loading) {
          return oldRoutes;
        }
        const idx = getClientIndex(oldRoutes, change.fullDocument) ?? oldRoutes.length;
        return idx === oldRoutes.length
          ? addValueAtIndex(oldRoutes, idx, change.fullDocument)
          : oldRoutes;
      });
    },
    onUpdate: (change: IRouteChange) => {
      setRoutes((oldRoutes) => {
        if (loading) {
          return oldRoutes;
        }
        const idx = getClientIndex(oldRoutes, change.fullDocument);
        if (!idx) {
          return oldRoutes;
        }
        return updateValueAtIndex(oldRoutes, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IRouteChange) => {
      setRoutes((oldRoutes) => {
        if (loading) {
          return oldRoutes;
        }
        const idx = getClientIndex(oldRoutes, change.fullDocument);
        if (!idx) {
          return oldRoutes;
        }
        return replaceValueAtIndex(oldRoutes, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setRoutes((oldRoutes) => {
        if (loading) {
          return oldRoutes;
        }
        if (!change.documentKey) {
          return oldRoutes;
        }
        const idx = getClientIndex(oldRoutes, { _id: change.documentKey._id });
        if (!idx) {
          return oldRoutes;
        }
        return idx >= 0 ? removeValueAtIndex(oldRoutes, idx) : oldRoutes;
      });
    },
  });

  const saveRoute = async (draftRoute: IRoute) => {
    const cpRoute: Omit<IRoute, "_id"> = {
      ...draftRoute
    }
    try {
      await graphql.mutate({
        mutation: gql`
            mutation SaveRoute($route: RouteInsertInput!) {
              insertOneRoute(data: $route) {
                _id
                fullAddress
              }
            }
          `,
        variables: { route: cpRoute },
      });
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a route multiple times (i.e. an existing route has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
      throw err;
    }
  };

  const searchRoute = async (searchQuery: string): Promise<IRoute[]> => {
    try {
      const resp = await graphql.query<IGraphqlSearchRoutesResponse>({
        query: gql`
          query SearchRoute($searchQuery: String!) {
            SearchRoutes(input: $searchQuery) {
                _id
                businessSector
                campaigns
                createdAt
                fullAddress
                location {
                  coordinates
                  type
                }
                phoneNumber
                products {
                  name
                  product_id
                  quantity
                }
                road
                updatedAt
                users
              }
          }
        `,
        variables: {
          searchQuery: `.*${searchQuery}.*`
        },
      });
      return resp.data.SearchRoutes;
    } catch (error) {
      console.log(error, "REPORT FETCH ERROR")
      throw new Error("Failed to get report")
    }
  };

  return {
    loading,
    routes,
    saveRoute,
    searchRoute
  };
}
