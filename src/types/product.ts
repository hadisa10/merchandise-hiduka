// ----------------------------------------------------------------------

import { ApolloQueryResult } from "@apollo/client";

export type IProductFilterValue = string | string[] | number | number[];

export type IProductFilters = {
  rating: string;
  gender: string[];
  category: string;
  colors: string[];
  priceRange: number[];
};

// ----------------------------------------------------------------------

export type IProductReviewNewForm = {
  rating: number | null;
  review: string;
  name: string;
  email: string;
};

export type IProductReview = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  helpful: number;
  avatarUrl: string;
  isPurchased: boolean;
  attachments?: string[];
  postedAt: Date;
};

export type IProductItem = {
  _id: string;
  sku: string;
  client_id: string;
  name: string;
  code: string;
  price: number;
  taxes: number;
  tags: string[];
  gender: string;
  sizes: string[];
  publish: string;
  coverUrl: string;
  images: string[];
  colors: string[];
  quantity: number;
  stockAssigned: number;
  category: string;
  available: number;
  totalSold: number;
  description: string;
  totalRatings: number;
  totalReviews: number;
  inventoryType: string;
  subDescription: string;
  priceSale: number | null;
  reviews: IProductReview[];
  createdAt: Date;
  ratings: {
    name: string;
    starCount: number;
    reviewCount: number;
  }[];
  saleLabel: {
    enabled: boolean;
    content: string;
  };
  newLabel: {
    enabled: boolean;
    content: string;
  };
};

export type IProductTableFilterValue = string | string[];

export type IProductTableFilters = {
  stock: string[];
  publish: string[];
};



// API TYPES

export interface IProductChange {
  fullDocument: IProductItem;
}

export interface IProductsGraphqlResponse {
  products: IProductItem[];
}

export interface IGraphqlCampaignProductsResponse {
  CampaignProducts: IProductItem[];
}

export interface IGraphqlClientProductsResponse {
  ClientProducts: IProductItem[];
}

export interface IGraphqlCampaignAddProductsResponse {
  success: boolean;
  message: string;
}

export interface IProductGraphqlResponse {
  product: IProductItem;
}
export interface IProductActions {
  saveProduct: (draftUser: IProductItem) => Promise<void>;
  getProduct: (id: string) => Promise<ApolloQueryResult<IProductGraphqlResponse> | undefined>;
  deleteProduct: (product: IProductItem) => Promise<void>;
  updateProduct: (product: IProductItem) => Promise<void>;
  getCampaignProducts: (id: string) => Promise<IProductItem[]>;
  getClientProducts: (id: string) => Promise<IProductItem[]>;
  addCampaignProducts: (campaign_id: string, products: string[]) => Promise<void>;
}

export interface IProductHook extends IProductActions {
  loading: boolean;
  products: IProductItem[];
}