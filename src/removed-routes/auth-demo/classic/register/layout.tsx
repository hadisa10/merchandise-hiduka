'use client';

import AuthClassicLayout from 'src/layouts/auth/classic';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <AuthClassicLayout title="Manage the job more effectively with Hokela">
      {children}
    </AuthClassicLayout>
  );
}
