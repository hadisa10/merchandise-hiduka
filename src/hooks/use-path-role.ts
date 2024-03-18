import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { ERole } from 'src/config-global';

import { useRealmApp } from 'src/components/realm'; // Assuming useRealmApp is where you get currentUser

// Custom hook to get the role path
export function useRolePath() {
  const { currentUser } = useRealmApp();

  const role = useMemo(() => currentUser?.customData?.role as ERole, [currentUser]);

  const rolePath = useMemo(() => paths.v2[role as keyof typeof paths.v2], [role]);

  return rolePath;
}
