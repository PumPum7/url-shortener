import { NextRequest, NextResponse } from "next/server";
import { Client, fql, Query } from "fauna";
import { corsHeaders } from "@/lib/cors";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const client = new Client();

function generateShortUrl(length: number): string {
    const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }
    return result;
}

export const POST = async (request: NextRequest) => {
    const { user } = (await auth.api.getSession({
        headers: await headers(),
    })) || { user: null };

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const url: string = body.longUrl;
        if (!url.startsWith("http")) {
            return NextResponse.json(
                { error: "invalid url provided" },
                { status: 400, headers: corsHeaders(request) }
            );
        }

        const password: string = body.password || "";
        const expiration: number = parseInt(body.expiration) || 0;
        const urlLength: number = body.length || 5;
        const customAddress: string = body.customAddress || "";
        const message: string = body.message || "";
        const short = customAddress || generateShortUrl(urlLength);
        let query: Query;

        if (expiration > 0) {
            query = fql`
    urls.create({
      short: ${short},
      long: ${url},
      usage: 0,
      password: ${password},
      message: ${message},
      user: ${user.id},
      ttl: Time.now().add(${expiration}, "hours")
    })`;
        } else {
            query = fql`
    urls.create({
      short: ${short},
      long: ${url},
      usage: 0,
      password: ${password},
      message: ${message},
      user: ${user.id}
    })`;
        }

        const result = await client.query(query);

        return NextResponse.json(
            {
                short: result.data.short,
            },
            {
                headers: corsHeaders(request),
            }
        );
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
        headers: { ...corsHeaders(request), Allow: "POST, OPTIONS" },
    });
}
