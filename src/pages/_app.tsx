import React from "react";

import { AppProps } from "next/app";

import { UserProvider } from "@auth0/nextjs-auth0";

import Layout from "@components/Layout";

import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <UserProvider>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </UserProvider>
    );
}

export default MyApp;
