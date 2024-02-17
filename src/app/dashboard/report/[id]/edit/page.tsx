// ----------------------------------------------------------------------

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

  return <>REPORT EDIT {id}</>;
}
