import { UserRoutesDetailsView } from 'src/sections/user-routes/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Dashboard: Route Details',
};

type Props = {
  params: {
    id: string;
  };
};

export default function UserRoutesDetailsPage({ params }: Props) {
  const { id } = params;

  return <UserRoutesDetailsView id={id} />;
}

// export async function generateStaticParams() {
//   return _userList.map((user) => ({
//     id: user.id,
//   }));
// }
