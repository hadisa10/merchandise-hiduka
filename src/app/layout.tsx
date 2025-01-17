/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

// i18n
import 'src/locales/i18n';

// ----------------------------------------------------------------------

import ThemeProvider from 'src/theme';
import { LocalizationProvider } from 'src/locales';
import { primaryFont } from 'src/theme/typography';

import ProgressBar from 'src/components/progress-bar';
import { MotionLazy } from 'src/components/animate/motion-lazy';
import SnackbarProvider from 'src/components/snackbar/snackbar-provider';
import { SettingsDrawer, SettingsProvider } from 'src/components/settings';

import { CheckoutProvider } from 'src/sections/checkout/context';
import { RealmProvider } from "src/components/realm";


import { AuthProvider } from 'src/auth/context/jwt';
import { ClientProvider } from 'src/components/clients/context/client-provider';
import atlasConfig from "../atlasConfig.json";
// import { AuthProvider } from 'src/auth/context/auth0';
// import { AuthProvider } from 'src/auth/context/amplify';
// import { AuthProvider } from 'src/auth/context/firebase';

// ----------------------------------------------------------------------

export const viewport = {
  themeColor: '#000000',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};
export const metadata = {
  title: 'Hokela Interactive',
  description:
    'Manage your business transaction and document ans human resource all under a single app',
  keywords: 'sales,merchandising,document-management,resource-tracking',
  manifest: '/manifest.json',
  icons: [
    { rel: 'icon', url: '/favicon/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', url: '/favicon/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', url: '/favicon/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', url: '/favicon/apple-touch-icon.png' },
  ],
};

type Props = {
  children: React.ReactNode;
};

const { appId } = atlasConfig;

export default function RootLayout({ children }: Props) {
  return (
    <html lang="en" className={primaryFont.className}>
      <body>
        <AuthProvider>
          <ClientProvider>
            <LocalizationProvider>
              <SettingsProvider
                defaultSettings={{
                  themeMode: 'light', // 'light' | 'dark'
                  themeDirection: 'ltr', //  'rtl' | 'ltr'
                  themeContrast: 'default', // 'default' | 'bold'
                  themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                  themeColorPresets: 'blue', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                  themeStretch: false,
                }}
              >
                <ThemeProvider>
                  <MotionLazy>
                    <RealmProvider appId={appId}>
                      <SnackbarProvider>
                        <CheckoutProvider>
                          <SettingsDrawer />
                          <ProgressBar />
                          {children}
                        </CheckoutProvider>
                      </SnackbarProvider>
                    </RealmProvider>
                  </MotionLazy>
                </ThemeProvider>
              </SettingsProvider>
            </LocalizationProvider>
          </ClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
