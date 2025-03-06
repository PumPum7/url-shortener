import { Client, fql } from "fauna";

import { NextRequest, NextResponse } from "next/server";

import { corsHeaders } from "@/lib/cors";

const client = new Client();

export async function GET(
    request: NextRequest,
    { params }: { params: { url: string } }
) {
    try {
        const { url } = await params;

        const query = fql`
      let doc = urls.firstWhere(arg => arg.short == ${url});
      doc!.update({ usage: doc!.usage + 1 });
      doc
    `;

        const result = await client.query(query);

        return NextResponse.json(result, {
            headers: corsHeaders(request),
        });
    } catch (error: any) {
        const message = error.message || error.toString();
        // If the document is not found, set a 404; otherwise use 400
        const status = message.toLowerCase().includes("not found") ? 404 : 400;
        return NextResponse.json(
            { error: message },
            { status, headers: corsHeaders(request) }
        );
    }
}

export function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
    });
}
