import { useMemo } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {  HttpLink, ApolloClient, InMemoryCache } from "@apollo/client";

import { paths } from "src/routes/paths";
import { useRouter } from 'src/routes/hooks';

import atlasConfig from "src/atlasConfig.json";

import { useRealmApp } from "src/components/realm";

const { baseUrl } = atlasConfig;


export function useCustomApolloClient() {
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

