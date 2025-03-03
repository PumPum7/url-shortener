import { NextRequest, NextResponse } from "next/server";
import { Client, fql } from "fauna";
import { corsHeaders } from "@/lib/cors";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const client = new Client();

export const DELETE = async (request: NextRequest) => {
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
        let url = urls.firstWhere(arg => arg.short == ${url} && arg.user == ${user.id})
        url!.delete()
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
        headers: { ...corsHeaders(request), Allow: "DELETE, OPTIONS" },
    });
}
