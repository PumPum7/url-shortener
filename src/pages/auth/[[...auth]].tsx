import Head from "next/head";
import React, { useEffect } from "react";

import dynamic from "next/dynamic";
import SuperTokens from "supertokens-auth-react";
import { redirectToAuth } from "supertokens-auth-react/recipe/thirdpartyemailpassword";

const SuperTokensComponentNoSSR = dynamic(
    new Promise((res) => res(SuperTokens.getRoutingComponent)),
    { ssr: false }
);

export default function Auth(): JSX.Element {
    useEffect(() => {
        if (SuperTokens.canHandleRoute() === false) {
            redirectToAuth();
        }
    }, []);

    return (
        <div>
            <Head>
                <title>Login</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main>
                <SuperTokensComponentNoSSR />
            </main>
        </div>
    );
}
