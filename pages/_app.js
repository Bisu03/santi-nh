import "../styles/globals.css";
import fetcher from "../utils/fetcher";
import { SessionProvider, useSession } from "next-auth/react";
import Router from "next/router";
import { useEffect } from "react";
import { SWRConfig } from "swr";
import LodingScreen from "../components/LodingScreen";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <SessionProvider session={session}>
        <SWRConfig
          value={{
            fetcher,
            // refreshInterval: 10000,
          }}>
          {Component.adminRoute ? (
            <AdminRoute>
              <Component {...pageProps} />
            </AdminRoute>
          ) : (
            <Component {...pageProps} />
          )}
        </SWRConfig>
      </SessionProvider>
    </>
  );
}

function AdminRoute({ children }) {
  const { data: session, status } = useSession();
  const isUser = !!session?.user;


  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!isUser) Router.push("/"); // If not authenticated, force log in
  }, [isUser, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div>
      <LodingScreen />
    </div>
  );
}

export default MyApp;
