'use client';

import React, {useState, useEffect} from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { Loading } from "@components/util/Icons";
import { getLongUrl, checkPasswords } from "@functions/urlHandlers";

export default function ShortUrlPage({
  params: { shortUrl },
}: {
  params: { shortUrl: string };
}) {
    const [result, setResult] = useState<boolean | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const [data, setData] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const response = await getLongUrl({ shortUrl });
            if (response?.data) {
                setData(response.data);
                if (!response.data.protected) {
                    router.push(response.data.long.startsWith('http') ? response.data.long : `https://${response.data.long}`);
                }
            } else {
                router.push('/');
            }
        };
        fetchData();
    }, [shortUrl, router]);

    useEffect(() => {
        if (result && data) {
            router.push(data.long);
            return;
        }
        if (password !== "") {
            setError(true);
        }
    }, [result, password, data, router]);

    const passwordChecker = async () => {
        setLoading(true);
        try {
            const value = await checkPasswords(shortUrl, password);
            if (!value) {
                setError(true);
                setLoading(false);
                return;
            }
            setResult(value.success);
            setLoading(false);
        } catch {
            setError(true);
            setLoading(false);
        }
    };

    if (!data?.protected) {
        return null;
    }

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
                    <div className="flex flex-col grow justify-center ml-2 md:flex-row md:ml-0">
                        <input
                            type="password"
                            placeholder={"Password..."}
                            className={`bg-white rounded-xl md:shadow-lg border-b-5 flex-auto ${
                                error ? "border-2! border-red-500!" : ""
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
}
