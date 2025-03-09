import { Client, fql } from "fauna";

import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { corsHeaders } from "@/lib/cors";

const client = new Client();

export async function GET(
    request: NextRequest,
    { params }: { params: { url: string } }
) {
    try {
        const { user } = (await auth.api.getSession({
            headers: await headers(),
        })) || { user: null };

        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { url } = await params;

        // Get the URL and validate ownership
        const urlDoc = await client.query(
            fql`urls.firstWhere(arg => arg.short == ${url} && arg.user == ${user.id})`
        );

        if (!urlDoc.data) {
            return NextResponse.json(
                { error: "URL not found or you don't have permission" },
                { status: 404 }
            );
        }

        // Get click statistics
        const clicksQuery = fql`
            let urlDoc = urls.byShort(${url}).first();
            let clicks = url_clicks.by_url(urlDoc!.id.toString());

            // Calculate statistics
            let totalClicks = clicks.count();

            let groupBy = (set, key_fn) => {
              set.fold(
                // Start with an empty object.
                {},
                (acc, val) => {
                  let key = key_fn(val)

                  let existing_group = acc[key] ?? []

                  let new_group = existing_group.append(val)

                  let new_entry = Object.fromEntries([
                    [key, new_group]
                  ])

                  Object.assign(acc, new_entry)
                }
              )
            }

            // Get recent clicks
            let recentClicks = clicks.order(desc(.timestamp)).take(100);

            {
            	"clicksByCountry": groupBy(clicks, .country),
             	"clicksByDay": groupBy(clicks, click =>
              click.timestamp.year.toString() + "-" +
              click.timestamp.month.toString() + "-" +
              click.timestamp.dayOfMonth.toString()),
              "totalClicks": totalClicks,
              "recentClicks": recentClicks
            }

        `;

        const stats = await client.query(clicksQuery);

        return NextResponse.json(stats.data, {
            headers: corsHeaders(request),
        });
    } catch (error: any) {
        console.error("Stats error:", error);
        return NextResponse.json(
            { error: error.message || error.toString() },
            { status: 400, headers: corsHeaders(request) }
        );
    }
}

export function OPTIONS(request: NextRequest) {
    return new NextResponse(null, {
        status: 200,
        headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
    });
}
