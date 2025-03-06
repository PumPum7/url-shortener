"use server";

import { getLongUrl } from "@functions/urlHandlers";

import { redirect } from "next/navigation";
import { notFound } from "next/navigation";

export default async function ShortUrlPage({
    params,
}: {
    params: { shortUrl: string };
}) {
    const { shortUrl } = await params;
    const response = await getLongUrl({ shortUrl });

    if (response?.data) {
        if (response.data.protected) {
            redirect(`/s/${shortUrl}/protected`);
        }
        const longUrl = response.data.long;
        const targetUrl = longUrl.startsWith("http")
            ? longUrl
            : `https://${longUrl}`;
        redirect(targetUrl);
    } else {
        notFound();
    }

    // This return statement is unreachable due to the redirects above,
    // but is necessary to satisfy TypeScript
    return null;
}
