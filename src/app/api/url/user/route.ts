import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import {
    withApiAuthRequired,
    getSession,
    type Session,
} from "@auth0/nextjs-auth0";
import { Client, fql } from "fauna";

const client = new Client({
    secret: process.env.FAUNA_SECRET,
});

export const GET = withApiAuthRequired(async (request: NextRequest) => {
    const res = new NextResponse();
    const { user } = (await getSession(request, res)) as Session;

    const searchParams = request.nextUrl.searchParams;
    const amount = searchParams.get("amount") || "10";
    const skip = searchParams.get("skip") || "0";
    const search = searchParams.get("search") || "";

    try {
        const query = fql`
        urls.where(arg => arg.user == ${user.sub})
      `;

        const result = await client.query<any>(query);

        const totalLinks = await getUrlCount(client, user.sub);
        let recentLinks: {
            ref: string;
            long: string;
            short: string;
            usage: number;
            timeStamp: number;
        }[] = [];

        result.data.data
            .slice(parseInt(skip), parseInt(skip) + parseInt(amount))
            .forEach((link: any) => {
                if (search) {
                    if (
                        !link.short.includes(search) &&
                        !link.long.includes(search)
                    ) {
                        return;
                    }
                }
                recentLinks.push({
                    ref: link.id,
                    long: link.long,
                    short: link.short,
                    usage: link.usage,
                    timeStamp: link.ts.isoString,
                });
            });

        return NextResponse.json(
            { links: recentLinks, total: totalLinks },
            { headers: corsHeaders(request) }
        );
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message || error.toString() },
            { status: 400, headers: corsHeaders(request) }
        );
    }
});

async function getUrlCount(client: Client, user: string): Promise<number> {
    try {
        const query = fql`
      urls.where(user => user.user == ${user}).count()
    `;

        const result = await client.query(query);
        return result.data[0] as number;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

export function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
    });
}

// TODO: fix types
