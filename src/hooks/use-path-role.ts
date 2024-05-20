import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useRealmApp } from 'src/components/realm';

import { ERole } from 'src/types/client'; // Assuming useRealmApp is where you get currentUser

// Custom hook to get the role path
export function useRolePath(): (typeof paths.v2)[ERole] {
  const { currentUser } = useRealmApp();

  // Compute the role, default to 'AGENT' if not found or invalid
  const role = useMemo(() => {
    const userRole = currentUser?.customData?.role;
    return Object.values(ERole).includes(userRole as ERole) ? (userRole as ERole) : ERole.AGENT;
  }, [currentUser]);

  // Compute the path based on the role
  const rolePath = useMemo(
    () =>
      // Access the path using the role, which is guaranteed to be a valid ERole
      paths?.v2?.[role],
    [role]
  );

  return rolePath ?? {};
}

export function getPathsForRole<Role extends ERole>(role: Role): (typeof paths.v2)[Role] {
  return paths.v2[role];
}
