// ----------------------------------------------------------------------

import { ReportEditView } from 'src/sections/reports/view';

export const metadata = {
  title: 'Dashboard: Report Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ReportEditPage({ params }: Props) {
  const { id } = params;

  return <ReportEditView id={id} />;
}
export async function generateStaticParams() {}
