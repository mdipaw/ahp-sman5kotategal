import "@/styles/globals.css";
import type { AppProps } from "next/app";
import {NotificationProvider} from "@/context/NotificationContext";
import ErrorPopup from "@/components/ErrorPopup";

export default function App({ Component, pageProps }: AppProps) {
  return (
      <NotificationProvider>
        <ErrorPopup />
        <Component {...pageProps} />;
      </NotificationProvider>
      )
}
