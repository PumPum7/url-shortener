import { Layout } from "@components/Layout/Layout";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

import React from "react";

import "../styles/tailwind.css";
import { Providers } from "./providers";

export const metadata = {
    title: "URL Shortener ✂️",
    description:
        "Shorten your URLs today! A website made with NextJS, Typescript, TailwindCSS and FaunaDB",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <Providers>
                <Analytics />
                <body>
                    <Layout>
                        <Toaster position="top-right" />
                        {children}
                    </Layout>
                </body>
            </Providers>
        </html>
    );
}
