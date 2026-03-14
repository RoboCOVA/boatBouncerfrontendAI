import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/react";
import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "next-auth/react";
import { Provider as RWBProvider } from "react-wrap-balancer";
import { Provider } from "react-redux";
import cx from "classnames";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import localFont from "@next/font/local";
import { Inter } from "@next/font/google";
import { store } from "@/components/shared/store";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import ErrorBoundary from "@/components/error";
import { MapContext } from "features/context/mapContext";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";
import { Box, Button, Typography } from "@mui/material";
// import { HelpCircle } from "lucide-react";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import { ToastContainer } from "react-toastify";
import SyncLoading from "@/components/shared/syncLoading";

const sfPro = localFont({
  src: "../styles/SF-Pro-Display-Medium.otf",
  variable: "--font-sf",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

if (!process.browser) React.useLayoutEffect = React.useEffect;

export default function MyApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const router = useRouter();
  const queryClient = new QueryClient();

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  );

  useEffect(() => {
    // START VALUE - WHEN LOADING WILL START
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });

    // COMPLETE VALUE - WHEN LOADING IS FINISHED
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
  }, [router.events]);

  return (
    <SessionProvider session={pageProps.session}>
      <QueryClientProvider client={queryClient}>
        <RWBProvider>
          <Elements stripe={stripePromise}>
            <Provider store={store}>
              <ErrorBoundary>
                <MapContext.Provider value={{ map, setMap }}>
                  <div
                    className={`${cx(
                      sfPro.variable,
                      inter.variable,
                    )} overflow-x-clip`}
                  >
                    <LoadingBar
                      color="rgb(8 145 178)"
                      progress={progress}
                      waitingTime={400}
                      onLoaderFinished={() => {
                        setProgress(0);
                      }}
                    />

                    {progress !== 0 && router.pathname === "/" && (
                      <SyncLoading size={20} sx={{ color: "cyan" }} />
                    )}

                    <Toaster />
                    <ToastContainer />
                    <Component {...pageProps} />
                  </div>
                  {/* {session && (
                  <Button
                    onClick={() => setOpen((val) => !val)}
                    className="fixed bottom-1 right-1 rounded-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 px-4 py-2 font-bold text-white transition duration-300 hover:from-blue-500 hover:via-blue-600 hover:to-blue-700"
                  >
                    <HelpCircle />
                  </Button>
                )} */}

                  {session && open && (
                    <Box
                      className="fixed bottom-0 left-0 right-0 top-0 h-screen w-screen"
                      onClick={() => setOpen(false)}
                    >
                      <Box
                        onClick={(event) => event.stopPropagation()}
                        className="fixed bottom-12 right-1 rounded-md bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-7 py-2 font-bold text-white shadow-2xl drop-shadow-2xl transition duration-300"
                      >
                        <Typography>Call for help</Typography>
                        <Typography className="mt-1.5 font-mono underline">
                          <Link href="tel:253-495-3139">253-495-3139</Link>
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </MapContext.Provider>
              </ErrorBoundary>
            </Provider>
          </Elements>
        </RWBProvider>
      </QueryClientProvider>
      <Analytics />
    </SessionProvider>
  );
}
