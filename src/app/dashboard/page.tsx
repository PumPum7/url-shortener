import { UrlShortenerForm } from "@components/Homepage/UrlShortenerForm";
import { RecentLinks } from "@components/links/RecentLinks";
import { auth } from "@lib/auth";

import React from "react";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        redirect("/");
    }

    return (
        <div className="md:container">
            <UrlShortenerForm />
            <RecentLinks />
        </div>
    );
}
