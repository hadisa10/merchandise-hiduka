import { ApolloQueryResult } from '@apollo/client';

import { IAddressItem } from './address';

// ----------------------------------------------------------------------

export type IInvoiceTableFilterValue = string | string[] | Date | null;

export type IInvoiceTableFilters = {
  name: string;
  service: string[];
  status: string;
  startDate: Date | null;
  endDate: Date | null;
};

// ----------------------------------------------------------------------

export type IInvoiceItem = {
  id: string;
  title: string;
  price: number;
  total: number;
  service: string;
  quantity: number;
  description: string;
};

export type IInvoice = {
  _id: string;
  sent: number;
  dueDate: Date;
  taxes: number;
  status: string;
  subTotal: number;
  createDate: Date;
  discount: number;
  shipping: number;
  totalAmount: number;
  invoiceNumber: string;
  items: IInvoiceItem[];
  invoiceTo: IAddressItem;
  invoiceFrom: IAddressItem;
};

// API TYPES

export interface IInvoiceChange {
  fullDocument: IInvoice;
}

export interface IInvoicesGraphqlResponse {
  invoices: IInvoice[];
}

export interface IInvoiceGraphqlResponse {
  invoice: IInvoice;
}
export interface IInvoiceActions {
  saveInvoice: (draftInvoice: IInvoice) => Promise<void>;
  getInvoice: (id: string) => Promise<ApolloQueryResult<IInvoiceGraphqlResponse> | undefined>;
  deleteInvoice: (invoice: IInvoice) => Promise<void>;
  updateInvoice: (invoice: IInvoice) => Promise<void>;
}

export interface IInvoiceHook extends IInvoiceActions {
  loading: boolean;
  invoices: IInvoice[];
}