// ----------------------------------------------------------------------

import { IClient } from "src/types/client";

export type ClientsValueProps = {
  client: IClient
};

export type ClientContextProps = ClientsValueProps & {
  // Update
  onChangeClient: (client: IClient) => void;
  reset: VoidFunction;
};
