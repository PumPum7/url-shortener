import React from "react";
import { Toaster } from "react-hot-toast";
import { Layout } from "@components/Layout/Layout";
import { Providers } from "./providers";
import "../styles/tailwind.css";

export const metadata = {
  title: "URL Shortener ✂️",
  description: "Shorten your URLs today! A website made with NextJS, Typescript, TailwindCSS and FaunaDB"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Providers>
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
