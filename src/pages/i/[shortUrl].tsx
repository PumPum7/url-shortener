import { GetServerSideProps } from "next";
import Head from "next/head";

import React, { useEffect } from "react";

import { getLongUrl } from "@functions/urlHandlers";
import { CopyIcon } from "@components/util/Icons";

import { FUNCTIONS_DOMAIN } from "@functions/urlHandlers";


const UrlInformation = ({ data }): JSX.Element => {
    return (
        <>
            <Head>
                <title>URL Information | {data.short}</title>
            </Head>
            <div className="flex flex-col">
                <h1 className="pb-4">{data.title}</h1>
                <a className="text-gray-600" rel="noreferrer" href={data.long}>
                    {data.long}
                </a>
                <div>
                    <a className="link" rel="noreferrer" href={data.long}>
                        {FUNCTIONS_DOMAIN.replace("http://", "").replace(
                            "https://",
                            ""
                        )}
                        /s/{data.short}
                    </a>
                    <button>
                        <CopyIcon />
                    </button>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { shortUrl } = context.params;

    // .then because it would be a promise otherwise
    const data = await getLongUrl({ shortUrl }).then((response) => {
        return response;
    });
    console.log(data)
    if (data !== undefined && data.long !== undefined) {
        return { props: { data } };
    }
    return {
        redirect: {
            destination: "/",
            permanent: true,
        },
    };
};

export default UrlInformation;

// TODO: implement password check