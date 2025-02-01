import React from "react";
import { getSession } from "@auth0/nextjs-auth0";
import { RecentLinks } from "@components/links/RecentLinks";
import { UrlShortenerForm } from "@components/Homepage/UrlShortenerForm";
import { Landingpage } from "@components/Homepage/Landing";

export default async function Home() {
    const session = await getSession();

    if (!session?.user) {
        return (
            <Landingpage />
        );
    }

    return (
        <div className="md:container">
            <UrlShortenerForm user={session.user} />
            <RecentLinks />
        </div>
    );
}
