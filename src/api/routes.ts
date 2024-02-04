import { useMemo } from 'react';
// import keyBy from 'lodash/keyBy';
// import useSWR, { mutate } from 'swr';
import useSWR from 'swr';

import { fetcher, endpoints } from 'src/utils/axios-routes';

import { MAPBOX_API } from 'src/config-global';

import { IMapBoxDirectionsResponse } from 'src/types/user-routes';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};
// ----------------------------------------------------------------------

export function useGetDirections(directions: number[][]) {
  const points = directions.join(";")
  const URL = points
    ? [`${endpoints.driving}/${points}`, { params: { steps: true, geometries: 'geojson', access_token: MAPBOX_API } }]
    : '';

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      directions: data?.routes as IMapBoxDirectionsResponse,
      directionsLoading: isLoading,
      directionsError: error,
      directionsValidating: isValidating,
    }),
    [data?.routes, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// // ----------------------------------------------------------------------

// export async function sendMessage(conversationId: string, messageData: IChatMessage) {
//   const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

//   const CONVERSATION_URL = [
//     endpoints.chat,
//     {
//       params: { conversationId, endpoint: 'conversation' },
//     },
//   ];

//   /**
//    * Work on server
//    */
//   // const data = { conversationId, messageData };
//   // await axios.put(endpoints.chat, data);

//   /**
//    * Work in local
//    */
//   mutate(
//     CONVERSATION_URL,
//     (currentData: any) => {
//       const { conversation: currentConversation } = currentData;

//       const conversation = {
//         ...currentConversation,
//         messages: [...currentConversation.messages, messageData],
//       };

//       return {
//         conversation,
//       };
//     },
//     false
//   );

//   /**
//    * Work in local
//    */
//   mutate(
//     CONVERSATIONS_URL,
//     (currentData: any) => {
//       const { conversations: currentConversations } = currentData;

//       const conversations: IChatConversation[] = currentConversations.map(
//         (conversation: IChatConversation) =>
//           conversation.id === conversationId
//             ? {
//                 ...conversation,
//                 messages: [...conversation.messages, messageData],
//               }
//             : conversation
//       );

//       return {
//         conversations,
//       };
//     },
//     false
//   );
// }

// // ----------------------------------------------------------------------

// export async function createConversation(conversationData: IChatConversation) {
//   const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

//   /**
//    * Work on server
//    */
//   const data = { conversationData };
//   const res = await axios.post(endpoints.chat, data);

//   /**
//    * Work in local
//    */
//   mutate(
//     URL,
//     (currentData: any) => {
//       const conversations: IChatConversation[] = [...currentData.conversations, conversationData];
//       return {
//         ...currentData,
//         conversations,
//       };
//     },
//     false
//   );

//   return res.data;
// }

// // ----------------------------------------------------------------------

// export async function clickConversation(conversationId: string) {
//   const URL = endpoints.chat;

//   /**
//    * Work on server
//    */
//   // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

//   /**
//    * Work in local
//    */
//   mutate(
//     [
//       URL,
//       {
//         params: { endpoint: 'conversations' },
//       },
//     ],
//     (currentData: any) => {
//       const conversations: IChatConversations = currentData.conversations.map(
//         (conversation: IChatConversation) =>
//           conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
//       );

//       return {
//         ...currentData,
//         conversations,
//       };
//     },
//     false
//   );
// }
