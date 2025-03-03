import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { Client, fql } from "fauna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const client = new Client({
    secret: process.env.FAUNA_SECRET,
});

export const GET = async (request: NextRequest) => {
    const { user } = (await auth.api.getSession({
        headers: await headers(),
    })) || { user: null };

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const amount = parseInt(searchParams.get("amount") || "10", 10);
    const skip = searchParams.get("skip") || "0";
    const search = searchParams.get("search") || "";

    try {
        let after: string | undefined;
        let result;
        for (let i = 0; i < Math.ceil(parseInt(skip) / amount); i++) {
            result = await handlePagination(
                client,
                amount,
                user.id,
                search,
                after
            );
            after = result.data.after;
            if (!after) break;
        }
        result = await handlePagination(client, amount, user.id, search, after);

        const totalLinks = await getUrlCount(client, user.id, search);
        let recentLinks: {
            ref: string;
            long: string;
            short: string;
            usage: number;
            timeStamp: number;
        }[] = [];

        result.data.data.forEach((link: any) => {
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
};

async function getUrlCount(
    client: Client,
    user: string,
    search?: string
): Promise<number> {
    try {
        const query = search
            ? fql`urls.where(arg => arg.user == ${user} && (arg.short.includes(${search}) || arg.long.includes(${search}))).count()`
            : fql`urls.where(arg => arg.user == ${user}).count()`;

        const result = await client.query(query);
        return result.data as number;
    } catch (error) {
        console.error(error);
        return 0;
    }
}

async function handlePagination(
    client: Client,
    amount: number,
    userId: string,
    search?: string,
    after?: string
) {
    const query = search
        ? fql`urls.where(arg => arg.user == ${userId} && (arg.short.includes(${search}) || arg.long.includes(${search}))).pageSize(${amount})`
        : fql`urls.where(arg => arg.user == ${userId}).pageSize(${amount})`;

    const result = await client.query<any>(
        after ? fql`Set.paginate(${after})` : query
    );

    return result;
}

export function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
    });
}
