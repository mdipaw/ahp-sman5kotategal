import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {NotificationProvider} from "@/context/NotificationContext";
import ErrorPopup from "@/components/ErrorPopup";
import SuccessPopup from "@/components/SuccessPopup";

export default function App({Component, pageProps}: AppProps) {
    return (
        <NotificationProvider>
            <SuccessPopup/>
            <ErrorPopup/>
            <Component {...pageProps} />;
        </NotificationProvider>
    )
}
