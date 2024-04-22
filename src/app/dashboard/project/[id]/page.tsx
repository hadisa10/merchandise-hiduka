// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Project Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function ProjectDetailsPage({ params }: Props) {
  // const { id } = params;

  return <>PROJECT DETAILS</>;
}

export async function generateStaticParams() {
  return [{ id: 'id' }];
}
