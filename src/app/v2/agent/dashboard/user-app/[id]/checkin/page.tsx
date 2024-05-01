import { AppCheckinView } from 'src/sections/app/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: User App',
};
type Props = {
  params: {
    id: string;
  };
};
export default function AgentUserCheckinPage({ params }: Props) {
  const { id } = params;
  return <AppCheckinView id={id} />;
}
