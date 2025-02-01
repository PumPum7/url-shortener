import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import {
    withApiAuthRequired,
    getSession,
    type Session,
} from "@auth0/nextjs-auth0";
import { Client, fql } from "fauna";

const client = new Client();

export const GET = withApiAuthRequired(async (request: NextRequest) => {
    const res = new NextResponse();
    const { user } = (await getSession(request, res)) as Session;

    const searchParams = request.nextUrl.searchParams;
    const amount = searchParams.get("amount") || "10";
    const skip = searchParams.get("skip") || "0";
    const search = searchParams.get("search") || "";

    try {
        const query = fql`
      Paginate(
        Match(Index("user_id"), ${user.sub}),
        { size: ${parseInt(amount) + parseInt(skip)} }
      )
    `;

        const result = await client.query<any>(query);
        console.log(result.data);

        const totalLinks = await getUrlCount(client, user.sub);
        let recentLinks: {
            ref: string;
            long: string;
            short: string;
            usage: number;
            timeStamp: number;
        }[] = [];

        result.data
            .slice(parseInt(skip), parseInt(skip) + parseInt(amount))
            .forEach((link: any) => {
                if (search) {
                    if (
                        !link[1].includes(search) &&
                        !link[2].includes(search)
                    ) {
                        return;
                    }
                }
                recentLinks.push({
                    ref: link[0],
                    long: link[1],
                    short: link[2],
                    usage: link[3],
                    timeStamp: link[4] / 1000,
                });
            });

        return NextResponse.json(
            { links: recentLinks, total: totalLinks },
            { headers: corsHeaders(request) }
        );
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || error.toString() },
            { status: 400, headers: corsHeaders(request) }
        );
    }
});

async function getUrlCount(client: Client, user: string): Promise<number> {
    try {
        const query = fql`
      Count(
        Paginate(Match(Index("user_id"), ${user}), { size: 10000 })
      )
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
