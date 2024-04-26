
import { CampaignEditView } from 'src/sections/campaign/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Campaign Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function CampaignEditPage({ params }: Props) {
  const { id } = params;

  return <CampaignEditView id={id} />;
}
