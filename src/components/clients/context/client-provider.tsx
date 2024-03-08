'use client';

import { useMemo, useCallback } from 'react';

import { useLocalStorage } from 'src/hooks/use-local-storage';

import { IClient } from 'src/types/client';

import { ClientContext } from './client-context';

// ----------------------------------------------------------------------

const STORAGE_KEY = 'clients';

type ClientProviderProps = {
  children: React.ReactNode;
};


const initialState = {
  client: null,
};


export function ClientProvider({ children }: ClientProviderProps) {
  const { state, update, reset } = useLocalStorage(STORAGE_KEY, initialState);

  // Direction by lang
  const onChangeClient = useCallback(
    (client: IClient) => {
      update('client', client);
    },
    [update]
  );
  

  const memoizedValue = useMemo(
    () => ({
      ...state,
      reset,
      onChangeClient,

    }),
    [
      state,
      reset,
      onChangeClient
    ]
  );

  return <ClientContext.Provider value={memoizedValue}>{children}</ClientContext.Provider>;
}
