import React, { useEffect } from "react";

import { AppProps } from "next/app";

import SuperTokensReact from "supertokens-auth-react";
import SuperTokensNode from "supertokens-node";
import Session from "supertokens-auth-react/recipe/session";
import * as SuperTokensConfig from "../../config/supertokensConfig";
import { redirectToAuth } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

import Layout from "@components/Layout";

import "../styles/tailwind.css";

if (typeof window !== "undefined") {
    SuperTokensReact.init(SuperTokensConfig.frontendConfig());
} else {
    SuperTokensNode.init(SuperTokensConfig.backendConfig());
}

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        async function doRefresh() {
            if (pageProps.fromSupertokens === "needs-refresh") {
                if (await Session.attemptRefreshingSession()) {
                    location.reload();
                } else {
                    // user has been logged out
                    redirectToAuth();
                }
            }
        }
        doRefresh();
    }, [pageProps.fromSupertokens]);

    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
