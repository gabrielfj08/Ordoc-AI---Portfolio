import * as React from 'react';
import '../styles/globals.css';
import 'react-tooltip/dist/react-tooltip.css';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../queryClient';
import {
  ActionSheetProvider,
  AuthProvider,
  AwsProvider,
  DrawerProvider,
  ModalProvider,
  SnackbarProvider,
  SnackbarV3Provider,
  SessionProvider,
  ActionSheetV3Provider,
} from '../hooks';
import type { AppProps } from 'next/app';
import { NextPage } from 'next/types';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & { Component: NextPageWithLayout };

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <AwsProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SessionProvider>
            <SnackbarProvider>
              <SnackbarV3Provider>
                <DrawerProvider>
                  <ActionSheetV3Provider>
                    <ActionSheetProvider>
                      <ModalProvider>
                        {getLayout(<Component {...pageProps} />)}
                      </ModalProvider>
                    </ActionSheetProvider>
                  </ActionSheetV3Provider>
                </DrawerProvider>
              </SnackbarV3Provider>
            </SnackbarProvider>
          </SessionProvider>
        </QueryClientProvider>
      </AuthProvider>
    </AwsProvider>
  );
}

export default MyApp;
