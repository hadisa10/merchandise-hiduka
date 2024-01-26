// ----------------------------------------------------------------------

import { ApolloQueryResult } from "@apollo/client";

export type IOrderTableFilterValue = string | Date | null;

export type IOrderTableFilters = {
  name: string;
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IOrderHistory = {
  orderTime: Date;
  paymentTime: Date;
  deliveryTime: Date;
  completionTime: Date;
  timeline: {
    title: string;
    time: Date;
  }[];
};

export type IOrderShippingAddress = {
  fullAddress: string;
  phoneNumber: string;
};

export type IOrderPayment = {
  cardType: string;
  cardNumber: string;
};

export type IOrderDelivery = {
  shipBy: string;
  speedy: string;
  trackingNumber: string;
};

export type IOrderCustomer = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  ipAddress: string;
};

export type IOrderProductItem = {
  id: string;
  sku: string;
  name: string;
  price: number;
  coverUrl: string;
  quantity: number;
};

export type IOrderItem = {
  _id: string;
  taxes: number;
  status: string;
  shipping: number;
  discount: number;
  subTotal: number;
  orderNumber: string;
  totalAmount: number;
  totalQuantity: number;
  history: IOrderHistory;
  customer: IOrderCustomer;
  delivery: IOrderDelivery;
  payment: IOrderPayment;
  shippingAddress: IOrderShippingAddress;
  items: IOrderProductItem[];
  createdAt: Date;
};


// API TYPES

export interface IOrderChange {
  fullDocument: IOrderItem;
}

export interface IOrdersGraphqlResponse {
  orders: IOrderItem[];
}

export interface IOrderGraphqlResponse {
  order: IOrderItem;
}
export interface IOrderActions {
  saveOrder: (draftOrder: IOrderItem) => Promise<void>;
  getOrder: (id: string) => Promise<ApolloQueryResult<IOrderGraphqlResponse> | undefined>;
  deleteOrder: (product: IOrderItem) => Promise<void>;
  updateOrder: (product: IOrderItem) => Promise<void>;
}

export interface IOrderHook extends IOrderActions {
  loading: boolean;
  orders: IOrderItem[];
}