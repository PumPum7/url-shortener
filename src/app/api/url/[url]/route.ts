import { Client, fql } from "fauna";

import { NextRequest, NextResponse } from "next/server";

import { corsHeaders } from "@/lib/cors";
import { getGeoFromIP } from "@/lib/geo";

const client = new Client();

export async function GET(
    request: NextRequest,
    { params }: { params: { url: string } }
) {
    try {
        const { url } = await params;
        const ip = request.headers.get("x-forwarded-for") || "unknown";
        const userAgent = request.headers.get("user-agent") || "unknown";

        // Get geo data from IP
        const geoData =
            ip !== "unknown"
                ? await getGeoFromIP(ip)
                : { country: "unknown", region: "unknown", city: "unknown" };

        const query = fql`
            let doc = urls.byShort(${url}).first();
            doc!.update({ usage: doc!.usage + 1 });

            // Record the click details
            url_clicks.create({
                url_id: doc!.id.toString(),
                timestamp: Time.now(),
                country: ${geoData.country || "unknown"},
                region: ${geoData.region || "unknown"},
                city: ${geoData.city || "unknown"},
                userAgent: ${userAgent}
            });

            doc
        `;

        const result = await client.query(query);

        return NextResponse.json(result, {
            headers: corsHeaders(request),
        });
    } catch (error: any) {
        const message = error.message || error.toString();
        console.error(message);
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
