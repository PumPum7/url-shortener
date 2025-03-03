import React from "react";
import { RecentLinks } from "@components/links/RecentLinks";
import { UrlShortenerForm } from "@components/Homepage/UrlShortenerForm";
import { auth } from "@lib/auth";
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
