import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useRealmApp } from 'src/components/realm';
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


  const redirectTo = () => {
    const searchParams = new URLSearchParams({
      returnTo: window.location.pathname,
    }).toString();

    const loginPath = loginPaths[method];

    const href = `${loginPath}?${searchParams}`;

    router.replace(href);
  }

  const check = useCallback(() => {
    try {
      // const { exp } = jwtDecode<JwtPayload>(currentUser?.accessToken as string ?? "") || {};

      // const isExpired = Date.now() >= (exp || 0) * 1000;
      console.log(currentUser?.customData, 'CURRENT USER')
      if (!currentUser?.isLoggedIn) {
        redirectTo();
      }
      else if (!(currentUser?.customData?.isRegistered)) {
        router.replace(paths.register);
      }
      else {
        setChecked(true);
      }
    } catch (error) {
      console.log(error, "ERROR")
      redirectTo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, router, currentUser, redirectTo]);

  useEffect(() => {
    check();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!checked) {
    return null;
  }

  return <>{children}</>;
}
