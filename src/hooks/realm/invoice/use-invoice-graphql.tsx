import { BSON } from "realm-web";
import { gql } from "@apollo/client";
import { useState, useEffect } from "react";

import {
  getClientIndex,
  createObjectId,
  addValueAtIndex,
  updateValueAtIndex,
  removeValueAtIndex,
  replaceValueAtIndex,
} from "src/utils/realm";

import atlasConfig from "src/atlasConfig.json";

import { IInvoice, IInvoiceHook, IInvoiceChange, IInvoiceGraphqlResponse, IInvoicesGraphqlResponse } from "src/types/invoice";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useInvoices(): IInvoiceHook {

  const graphql = useCustomApolloClient();
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllInvoices {
        invoices {
          _id
          taxes
          status
          discount
          shipping
          subTotal
          totalAmount
          items {
              id
              total
              title
              description
              price
              service
              quantity
            }
          invoiceNumber
          invoiceFrom {
            id
            primary
            name
            email
            fullAddress
            phoneNumber
            company
            addressType
          }
          invoiceTo {
            id
            primary
            name
            email
            fullAddress
            phoneNumber
            company
            addressType
          }
          sent
          createDate
          dueDate
        }
      }
    `;
    graphql.query<IInvoicesGraphqlResponse>({ query }).then(({ data }) => {
      setInvoices(data.invoices);
      setLoading(false);
    });
  }, [graphql]);

  const clientHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "invoices",
  });

  useWatch(clientHidukaCollection, {
    onInsert: (change: IInvoiceChange) => {
      setInvoices((oldInvoices) => {
        if (loading) {
          return oldInvoices;
        }
        const idx = getClientIndex(oldInvoices, change.fullDocument) ?? oldInvoices.length;
        return idx === oldInvoices.length
          ? addValueAtIndex(oldInvoices, idx, change.fullDocument)
          : oldInvoices;
      });
    },
    onUpdate: (change: IInvoiceChange) => {
      setInvoices((oldInvoices) => {
        if (loading) {
          return oldInvoices;
        }
        const idx = getClientIndex(oldInvoices, change.fullDocument);
        if (!idx) {
          return oldInvoices;
        }
        return updateValueAtIndex(oldInvoices, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IInvoiceChange) => {
      setInvoices((oldInvoices) => {
        if (loading) {
          return oldInvoices;
        }
        const idx = getClientIndex(oldInvoices, change.fullDocument);
        if (!idx) {
          return oldInvoices;
        }
        return replaceValueAtIndex(oldInvoices, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setInvoices((oldInvoices) => {
        if (loading) {
          return oldInvoices;
        }
        if (!change.documentKey) {
          return oldInvoices;
        }
        const idx = getClientIndex(oldInvoices, { _id: change.documentKey._id });
        if (!idx) {
          return oldInvoices;
        }
        return idx >= 0 ? removeValueAtIndex(oldInvoices, idx) : oldInvoices;
      });
    },
  });

  const saveInvoice = async (draftInvoice: IInvoice) => {
    const dt = new Date();
    const cpInvoice: IInvoice = {
      ...draftInvoice,
      // @ts-expect-error expected
      _id: createObjectId(),
      createdAt: dt,
      updatedAt: dt
    }
    try {
      await graphql.mutate({
        mutation: gql`
            mutation SaveInvoice($invoice: InvoiceInsertInput!) {
              insertOneInvoice(data: $invoice) {
                _id
                totalAmount
              }
            }
          `,
        variables: { invoice: cpInvoice },
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

  const getInvoice = async (id: string) => {
    try {
      const query = gql`
      query FetchInvoice($id: ObjectId!) {
        invoice(query: {_id: $id}) {
            _id
            taxes
            status
            discount
            shipping
            subTotal
            totalAmount
            items {
                id
                total
                title
                description
                price
                service
                quantity
              }
            invoiceNumber
            invoiceFrom {
              id
              primary
              name
              email
              fullAddress
              phoneNumber
              company
              addressType
            }
            invoiceTo {
              id
              primary
              name
              email
              fullAddress
              phoneNumber
              company
              addressType
            }
            sent
            createDate
            dueDate
        }
      }
    `;
      return await graphql.query<IInvoiceGraphqlResponse>({ query, variables: { id } })
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a user multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      console.error(err);
      throw new Error(err.message)
    }
  }
  const updateInvoice = async (invoice: IInvoice) => {
    await graphql.mutate({
      mutation: gql`
        mutation UpdateInvoice($id: ObjectId!, $invoiceUpdateInput: InvoiceUpdateInput!) {
          updateOneInvoice(query: { _id: $id }, set: $invoiceUpdateInput) {
              _id
              taxes
              status
              discount
              shipping
              subTotal
              totalAmount
              items {
                  id
                  total
                  title
                  description
                  price
                  service
                  quantity
                }
              invoiceNumber
              invoiceFrom {
                id
                primary
                name
                email
                fullAddress
                phoneNumber
                company
                addressType
              }
              invoiceTo {
                id
                primary
                name
                email
                fullAddress
                phoneNumber
                company
                addressType
              }
              sent
              createDate
              dueDate
          }
        }
      `,
      variables: {
        id: invoice._id,
        invoiceUpdateInput: { ...invoice }
      },
    });
  };

  const deleteInvoice = async (invoice: IInvoice) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteInvoice($invoiceId: ObjectId!) {
          deleteOneInvoice(query: { _id: $invoiceId }) {
            _id
          }
        }
      `,
      variables: { invoiceId: invoice._id },
    });
  };

  return {
    loading,
    invoices,
    saveInvoice,
    updateInvoice,
    getInvoice,
    deleteInvoice
  };
}
