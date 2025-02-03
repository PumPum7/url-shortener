import React from "react";
import { RecentLinks } from "@components/links/RecentLinks";
import { UrlShortenerForm } from "@components/Homepage/UrlShortenerForm";
import { Landingpage } from "@components/Homepage/Landing";
import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0/edge";

export default async function Home() {
    const session = await getSession();

    if (session?.user) {
        return (
            <div className="md:container">
                <UrlShortenerForm />
                <RecentLinks />
            </div>
        );
    }

    return (
        <div className="md:container">
            <Landingpage />
        </div>
    );
};
