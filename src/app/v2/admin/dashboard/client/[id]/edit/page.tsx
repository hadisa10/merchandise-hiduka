import { ClientEditView } from 'src/sections/client/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Client Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ClientEditPage({ params }: Props) {
  const { id } = params;

  return <ClientEditView id={id} />;
}
export async function generateStaticParams() {}
