"use client";

import { Loading } from "@components/util/Icons";
import { checkPasswords } from "@functions/urlHandlers";

import React, { Usable, use, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

export default function ProtectedUrlPage({
    params,
}: {
    params: Usable<{ shortUrl: string }>;
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [password, setPassword] = useState<string>("");
    const router = useRouter();
    const searchParams = useSearchParams();

    const { shortUrl } = use(params);
    const longUrl = searchParams.get("longUrl") || "";
    const message = searchParams.get("message") || "";

    const passwordChecker = async () => {
        setLoading(true);
        try {
            const value = await checkPasswords(shortUrl, password);
            if (!value?.success) {
                setError(true);
                setLoading(false);
                return;
            }
            const targetUrl = longUrl.startsWith("http")
                ? longUrl
                : `https://${longUrl}`;
            router.push(targetUrl);
        } catch {
            setError(true);
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-center mb-8">
                Protected URL
            </h1>
            {message && (
                <div className="mb-8">
                    <h3 className="text-xl text-center">
                        Message from the uploader:
                    </h3>
                    <blockquote className="mt-2 p-4 border-l-4 border-gray-300 bg-gray-50 rounded">
                        {message}
                    </blockquote>
                </div>
            )}
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    passwordChecker();
                }}
                className="max-w-md mx-auto">
                <div className="flex flex-col space-y-4">
                    <input
                        type="password"
                        placeholder="Enter password..."
                        className={`form-input ${error ? "border-red-500" : ""}`}
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError(false);
                        }}
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`p-3 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition-colors
                            ${loading ? "opacity-50 cursor-wait" : ""}`}>
                        {loading ? (
                            <div className="flex items-center justify-center">
                                <Loading className="w-5 h-5 mr-2" />
                                Checking...
                            </div>
                        ) : (
                            "Submit"
                        )}
                    </button>
                    {error && (
                        <p className="text-red-500 text-sm text-center">
                            Invalid password. Please try again.
                        </p>
                    )}
                </div>
            </form>
        </div>
    );
}
