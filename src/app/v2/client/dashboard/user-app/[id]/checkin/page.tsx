import { AppCheckinView } from 'src/sections/app/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Checkin',
};
type Props = {
  params: {
    id: string;
  };
};
export default function ClientAppCheckinPage({ params }: Props) {
  const { id } = params;
  return <AppCheckinView id={id} />;
}
