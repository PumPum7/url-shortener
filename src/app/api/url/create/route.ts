import { NextRequest, NextResponse } from "next/server";
import faunadb from "faunadb";
import { corsHeaders } from "@/lib/cors";
import { getSession } from "@auth0/nextjs-auth0/edge";

const q = faunadb.query;

function generateShortUrl(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function POST(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders(request) }
    );
  }

  try {
    const body = await request.json();
    const url: string = body.long;
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

    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });
    
    const result = await client.query(
      q.Create(q.Collection("urls"), {
        data: {
          short: customAddress || generateShortUrl(urlLength),
          long: url,
          usage: 0,
          password,
          message,
          user: session.user.sub,
        },
        ttl: expiration > 0 ? q.TimeAdd(q.Now(), expiration, "hours") : null,
      })
    );
    
    return NextResponse.json(result.data, {
      headers: corsHeaders(request),
    });
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 400, headers: corsHeaders(request) }
    );
  }
}

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "POST, OPTIONS" },
  });
}
