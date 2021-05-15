import React from "react";

import { AppProps } from "next/app";

import Layout from "@components/Layout";

import "../styles/tailwind.css";

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
