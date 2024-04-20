import { useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname } from 'src/routes/hooks';

import { getRolePath } from 'src/utils/helpers';

import { useRealmApp } from 'src/components/realm';
import { useClientContext } from 'src/components/clients';
import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
  auth0: paths.auth.auth0.login,
  amplify: paths.auth.amplify.login,
  firebase: paths.auth.main.login,
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? <SplashScreen /> : <Container>{children}</Container>}</>;
}

// ----------------------------------------------------------------------

function Container({ children }: Props) {
  const router = useRouter();

  const { method } = useAuthContext();

  const { currentUser } = useRealmApp();

  const [checked, setChecked] = useState(false);

  const path = usePathname();

  const role = useMemo(
    () => currentUser?.customData?.role as unknown as string,
    [currentUser?.customData?.role]
  );

  const { reset } = useClientContext();

  const redirectTo = () => {
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();

    const loginPath = loginPaths[method];

    const href = `${loginPath}?${searchParams}`;

    router.replace(href);
  };

  const redirectToRole = () => {
    const rolePath = getRolePath(role);
    setChecked(true);
    router.replace(rolePath.root);
  };
  const check = useCallback(() => {
    try {
      // const { exp } = jwtDecode<JwtPayload>(currentUser?.accessToken as string ?? "") || {};

      // const isExpired = exp ? Date.now() >= exp * 1000 : true;

      // return;
      if (!currentUser?.isLoggedIn) {
        reset();
        redirectTo();
      } else if (!currentUser?.customData?.isRegistered) {
        router.replace(paths.register);
      } else if (!path.includes(role.toLowerCase())) {
        redirectToRole();
      } else {
        setChecked(true);
      }
    } catch (error) {
      reset();
      console.log(error, 'ERROR');
      redirectTo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, router, currentUser, redirectTo, role]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
