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

import { IProductHook, IProductItem, IProductChange, IProductGraphqlResponse, IProductsGraphqlResponse } from "src/types/product";

import { useWatch } from "../use-watch";
import { useCollection } from "../use-collection"
import { useCustomApolloClient } from "../use-apollo-client";

const { dataSourceName } = atlasConfig;


export function useProducts(): IProductHook {

  const graphql = useCustomApolloClient();
  const [products, setProducts] = useState<IProductItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = gql`
      query FetchAllProducts {
        products {
          _id
          name
          price
          coverUrl
          totalRatings
          gender
          publish
          category
          available
          priceSale
          taxes
          quantity
          sizes
          inventoryType
          images
          ratings{
            name
            starCount
            reviewCount
          }
          reviews{
            name
            postedAt
            comment
            isPurchased
            rating
            avatarUrl
            helpful
          }
          tags
          code
          colors
          description
          newLabel{
            enabled
            content
          }
          sku
          createdAt
          updatedAt
          saleLabel{
           enabled
           content
          }
        }
      }
    `;
    graphql.query<IProductsGraphqlResponse>({ query }).then(({ data }) => {
      setProducts(data.products);
      setLoading(false);
    });
  }, [graphql]);

  const clientHidukaCollection = useCollection({
    cluster: dataSourceName,
    db: "hiduka",
    collection: "products",
  });

  useWatch(clientHidukaCollection, {
    onInsert: (change: IProductChange) => {
      setProducts((oldProdutcs) => {
        if (loading) {
          return oldProdutcs;
        }
        const idx = getClientIndex(oldProdutcs, change.fullDocument) ?? oldProdutcs.length;
        return idx === oldProdutcs.length
          ? addValueAtIndex(oldProdutcs, idx, change.fullDocument)
          : oldProdutcs;
      });
    },
    onUpdate: (change: IProductChange) => {
      setProducts((oldProdutcs) => {
        if (loading) {
          return oldProdutcs;
        }
        const idx = getClientIndex(oldProdutcs, change.fullDocument);
        if (!idx) {
          return oldProdutcs;
        }
        return updateValueAtIndex(oldProdutcs, idx, () => change.fullDocument);
      });
    },
    onReplace: (change: IProductChange) => {
      setProducts((oldProdutcs) => {
        if (loading) {
          return oldProdutcs;
        }
        const idx = getClientIndex(oldProdutcs, change.fullDocument);
        if (!idx) {
          return oldProdutcs;
        }
        return replaceValueAtIndex(oldProdutcs, idx, change.fullDocument);
      });
    },
    onDelete: (change: { documentKey?: { _id: BSON.ObjectId } }) => {
      setProducts((oldProdutcs) => {
        if (loading) {
          return oldProdutcs;
        }
        if (!change.documentKey) {
          return oldProdutcs;
        }
        const idx = getClientIndex(oldProdutcs, { _id: change.documentKey._id });
        if (!idx) {
          return oldProdutcs;
        }
        return idx >= 0 ? removeValueAtIndex(oldProdutcs, idx) : oldProdutcs;
      });
    },
  });

  const saveProduct = async (draftProduct: IProductItem) => {
    const dt = new Date();
    const cpProduct: IProductItem = {
      ...draftProduct,
      // @ts-expect-error expected
      _id: createObjectId(),
      createdAt: dt,
      updatedAt: dt
    }
    try {
      await graphql.mutate({
        mutation: gql`
            mutation SaveProduct($product: ProductInsertInput!) {
              insertOneProduct(data: $product) {
                _id
                name
              }
            }
          `,
        variables: { product: cpProduct },
      });
    } catch (err) {
      if (err.message.match(/^Duplicate key error/)) {
        console.warn(
          `The following error means that this app tried to insert a user multiple times (i.e. an existing client has the same _id). In this app, we just catch the error and move on. In your app, you might want to debounce the save input or implement an additional loading state to avoid sending the request in the first place.`
        );
      }
      throw new Error(err.message);
    }
  }

  const getProduct = async (id: string) => {
    try {
      const query = gql`
      query FetchAllProduct($id: ObjectId!) {
        product(query: {_id: $id}) {
          _id
          name
          subDescription
          price
          coverUrl
          totalRatings
          gender
          publish
          category
          available
          priceSale
          taxes
          quantity
          sizes
          inventoryType
          images
          ratings{
            name
            starCount
            reviewCount
          }
          reviews{
            name
            postedAt
            comment
            isPurchased
            rating
            avatarUrl
            helpful
          }
          tags
          code
          colors
          description
          newLabel{
            enabled
            content
          }
          sku
          createdAt
          updatedAt
          saleLabel{
           enabled
           content
          }
        }
      }
    `;
      return await graphql.query<IProductGraphqlResponse>({ query, variables: { id } })
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
  const updateProduct = async (product: IProductItem) => {
    await graphql.mutate({
      mutation: gql`
        mutation UpdateProduct($id: ObjectId!, $productUpdateInput: ProductUpdateInput!) {
          updateOneProduct(query: { _id: $id }, set: $productUpdateInput) {
            name
          }
        }
      `,
      variables: {
        id: product._id,
        productUpdateInput: { ...product }
      },
    });
  };

  const deleteProduct = async (user: IProductItem) => {
    await graphql.mutate({
      mutation: gql`
        mutation DeleteUser($userId: ObjectId!) {
          deleteOneUser(query: { _id: $userId }) {
            _id
          }
        }
      `,
      variables: { userId: user._id },
    });
  };

  return {
    loading,
    products,
    saveProduct,
    updateProduct,
    getProduct,
    deleteProduct
  };
}