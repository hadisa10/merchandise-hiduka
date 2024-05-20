import { ClientCampaignDetailsView } from 'src/sections-v2/client/c-management';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Client Campaign Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ClientCampaignEditPage({ params }: Props) {
  const { id } = params;

  return <ClientCampaignDetailsView id={id} />;
}
