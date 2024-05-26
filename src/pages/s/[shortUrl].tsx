import { GetServerSideProps } from "next";
import Head from "next/head";
import Router from "next/router";

import React, { useState, useEffect } from "react";

import { Loading } from "@components/util/Icons";

import { getLongUrl, checkPasswords } from "@functions/urlHandlers";

const Url = ({ data }): React.ReactElement  => {
    const [result, setResult] = useState<boolean>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");

    const passwordChecker = () => {
        setLoading(true);
        checkPasswords(data.short, password).then(
            function (value) {
                if (value === undefined) {
                    setError(true);
                    setLoading(false);
                    return;
                }
                setResult(value.confirmed);
                setLoading(false);
            },
            function (error) {
                setError(true);
                setLoading(false);
            }
        );
    };

    useEffect(() => {
        if (result) {
            Router.push(data.long);
            return;
        }
        if (password !== "") {
            setError(true);
        }
    }, [result]);

    return (
        <>
            <Head>
                <title>Protected URL</title>
            </Head>
            <div>
                <h1 className="text-center">Protected URL</h1>
                <h3 className="m-4 text-center">
                    Message from the uploader:{" "}
                    <blockquote>{data.message}</blockquote>
                </h3>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        passwordChecker();
                    }}>
                    <div className="flex flex-col flex-grow justify-center ml-2 md:flex-row md:ml-0">
                        <input
                            type="password"
                            placeholder={"Password..."}
                            className={`bg-white rounded-xl md:shadow-lg border-b-5 flex-auto ${
                                error ? "!border-2 !border-red-500" : ""
                            }`}
                            onChange={(e) => setPassword(e.target.value)}
                            required={true}
                            onClick={() => {
                                setError(false);
                                setResult(undefined);
                            }}
                        />
                        <button
                            type="submit"
                            className={`flex flex-row items-center md:ml-6 p-2 bg-blue-400 rounded-xl mt-4 md:mt-0 flex-none  ${
                                loading ? "cursor-wait" : ""
                            }`}>
                            Submit
                            {loading ? (
                                <Loading className="pl-4 rounded-xl" />
                            ) : (
                                ""
                            )}
                        </button>
                    </div>
                    {error ? (
                        <p className="mt-4 text-red-600 translate-x-2 md:translate-x-0">
                            Invalid password!
                        </p>
                    ) : (
                        ""
                    )}
                </form>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const { shortUrl } = context.params;

    // .then because it would be a promise otherwise
    const data = await getLongUrl({ shortUrl }).then((response) => {
        return response;
    });
    if (data !== undefined && data.long !== undefined) {
        if (data.protected) {
            return { props: { data } };
        }

        if (!data.long.startsWith("http")) {
            data.long = `https://${data.long}`;
        }

        return {
            redirect: {
                destination: data.long,
                permanent: true,
            },
        };
    }
    return {
        redirect: {
            destination: "/",
            permanent: true,
        },
    };
};

export default Url;
