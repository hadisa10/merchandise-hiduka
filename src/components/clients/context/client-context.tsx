'use client';

import { useContext, createContext } from 'react';

import { ClientContextProps } from '../types';

// ----------------------------------------------------------------------

export const ClientContext = createContext({} as ClientContextProps);

export const useClientContext = () => {
  const context = useContext(ClientContext);

  if (!context) throw new Error('useClientContext must be use inside ClientProvider');

  return context;
};
