import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { Client, fql } from "fauna";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const client = new Client();

export const GET = async (request: NextRequest) => {
    const { user } = (await auth.api.getSession({
        headers: await headers(),
    })) || { user: null };

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = request.nextUrl.searchParams.get("url");
    if (!url) {
        return NextResponse.json(
            { error: "URL parameter is required" },
            { status: 400, headers: corsHeaders(request) }
        );
    }

    try {
        const query = fql`
      urls.firstWhere(arg => arg.short == ${url} && arg.user == ${user.id})
    `;

        const result = await client.query(query);

        return NextResponse.json(result, {
            headers: corsHeaders(request),
        });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message || error.toString() },
            { status: 400, headers: corsHeaders(request) }
        );
    }
};

export function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
    });
}
