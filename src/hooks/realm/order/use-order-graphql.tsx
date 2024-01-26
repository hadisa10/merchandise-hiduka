import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
  createObjectId,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";


import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";
import { IOrderChange, IOrderGraphqlResponse, IOrderHook, IOrderItem, IOrdersGraphqlResponse } from "src/types/order";

const { dataSourceName } = atlasConfig;


export function useOrders(): IOrderHook {

  const graphql = useCustomApolloClient();
  const [orders, setOrders] = useState<IOrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllOrders {
        orders {
          _id
          orderNumber
          createdAt
          taxes
          items {
              id
              sku
              quantity
              name
              coverUrl
              price
          }
          history {
            orderTime
            paymentTime
            deliveryTime
            completionTime
            timeline {
                title
                time
              }
          }
          subTotal
          shipping
          discount
          customer {
            id
            name
            email
            avatarUrl
            ipAddress
          },
          delivery {
            shipBy
            speedy
            trackingNumber
          },
          totalAmount
          totalQuantity
          shippingAddress {
            fullAddress
            phoneNumber
          },
          payment {
            cardType
            cardNumber
          }
          status
        }
      }
    `;
    graphql.query<IOrdersGraphqlResponse>({ query }).then(({ data }) => {
      setOrders(data.orders);
      setLoading(false);
    });
  }, [graphql]);

  const clientHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "orders",
  });

  useWatch(clientHidukaCollection, {
    onInsert: (change: IOrderChange) => {
      setOrders((oldOrders) => {
        if (loading) {
          return oldOrders;
        }
        const idx = getClientIndex(oldOrders, change.fullDocument) ?? oldOrders.length;
        return idx === oldOrders.length
          ? addValueAtIndex(oldOrders, idx, change.fullDocument)
          : oldOrders;
      });
    },
    onUpdate: (change: IOrderChange) => {
      setOrders((oldOrders) => {
        if (loading) {
          return oldOrders;
        }
        const idx = getClientIndex(oldOrders, change.fullDocument);
        if (!idx) {
          return oldOrders;
        }
        return updateValueAtIndex(oldOrders, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IOrderChange) => {
      setOrders((oldOrders) => {
        if (loading) {
          return oldOrders;
        }
        const idx = getClientIndex(oldOrders, change.fullDocument);
        if (!idx) {
          return oldOrders;
        }
        return replaceValueAtIndex(oldOrders, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setOrders((oldOrders) => {
        if (loading) {
          return oldOrders;
        }
        if (!change.documentKey) {
          return oldOrders;
        }
        const idx = getClientIndex(oldOrders, { _id: change.documentKey._id });
        if (!idx) {
          return oldOrders;
        }
        return idx >= 0 ? removeValueAtIndex(oldOrders, idx) : oldOrders;
      });
    },
  });

  const saveOrder = async (draftOrder: IOrderItem) => {
    const dt = new Date();
    const cpOrder: IOrderItem = {
      ...draftOrder,
      // @ts-expect-error expected
      _id: createObjectId(),
      createdAt: dt,
      updatedAt: dt
    }
    try {
      await graphql.mutate({
        mutation: gql`
            mutation SaveOrder($order: OrderInsertInput!) {
              insertOneOrder(data: $order) {
                _id
                orderNumber
              }
            }
          `,
        variables: { order: cpOrder },
      });
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a user multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      throw new Error(err);
    }
  }

  const getOrder = async (id: string) => {
    try {
      const query = gql`
      query FetchAllOrder($id: ObjectId!) {
        order(query: {_id: $id}) {
          _id
          orderNumber
          createdAt
          taxes
          items {
              id
              sku
              quantity
              name
              coverUrl
              price
          }
          history {
            orderTime
            paymentTime
            deliveryTime
            completionTime
            timeline {
                title
                time
              }
          }
          subTotal
          shipping
          discount
          customer {
            id
            name
            email
            avatarUrl
            ipAddress
          },
          delivery {
            shipBy
            speedy
            trackingNumber
          },
          totalAmount
          totalQuantity
          shippingAddress {
            fullAddress
            phoneNumber
          },
          payment {
            cardType
            cardNumber
          }
          status
        }
      }
    `;
      return await graphql.query<IOrderGraphqlResponse>({ query, variables: { id } })
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a user multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
    }
  }
  const updateOrder = async (order: IOrderItem) => {
    await graphql.mutate({
      mutation: gql`
        mutation UpdateOrder($id: ObjectId!, $orderUpdateInput: OrderUpdateInput!) {
          updateOneOrder(query: { _id: $id }, set: $orderUpdateInput) {
              orderNumber
              createdAt
              taxes
              items {
                  id
                  sku
                  quantity
                  name
                  coverUrl
                  price
              }
              history {
                orderTime
                paymentTime
                deliveryTime
                completionTime
                timeline {
                    title
                    time
                  }
              }
              subTotal
              shipping
              discount
              customer {
                id
                name
                email
                avatarUrl
                ipAddress
              },
              delivery {
                shipBy
                speedy
                trackingNumber
              },
              totalAmount
              totalQuantity
              shippingAddress {
                fullAddress
                phoneNumber
              },
              payment {
                cardType
                cardNumber
              }
              status
        }
      `,
      variables: {
        id: order._id,
        orderUpdateInput: { ...order }
      },
    });
  };

  const deleteOrder = async (order: IOrderItem) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteOrder($orderId: ObjectId!) {
          deleteOneUser(query: { _id: $orderId }) {
            _id
          }
        }
      `,
      variables: { orderId: order._id },
    });
  };

  return {
    loading,
    orders,
    saveOrder,
    updateOrder,
    getOrder,
    deleteOrder
  };
}
