import React, { useEffect } from "react";

import { AppProps } from "next/app";

import { UserProvider } from "@auth0/nextjs-auth0";
import { Toaster } from "react-hot-toast";

import { Layout } from "@components/Layout/Layout";

import { useModalStore } from "@functions/globalZustand";

import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
    const { showModal, currentModal } = useModalStore((state) => ({
        showModal: state.showModal,
        currentModal: state.currentModal,
    }));

    return (
        <UserProvider>
            <Layout>
                <Toaster position={"top-right"} />
                <Component {...pageProps} />
            </Layout>
            {showModal ? currentModal : ""}
        </UserProvider>
    );
}

export default MyApp;
