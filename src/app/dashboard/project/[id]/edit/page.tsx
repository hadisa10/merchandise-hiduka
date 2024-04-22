// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Project Edit',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProjectEditPage({ params }: Props) {
  // const { id } = params;

  return <>EDIT PROJECT</>;
}
export async function generateStaticParams() {
  return [{ id: 'id' }];
}
