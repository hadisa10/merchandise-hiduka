'use client';

import { GuestGuard } from 'src/auth/guard';
import CompactLayout from 'src/layouts/compact';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <GuestGuard>
      <CompactLayout>{children}</CompactLayout>
    </GuestGuard>
  );
}
