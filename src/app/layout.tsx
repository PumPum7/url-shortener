import React from "react";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import { Toaster } from "react-hot-toast";
import { Layout } from "@components/Layout/Layout";
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
          <UserProvider>
              <body>
                  <Layout>
                      <Toaster position="top-right" />
                      {children}
                  </Layout>
              </body>
          </UserProvider>
      </html>
  );
}
