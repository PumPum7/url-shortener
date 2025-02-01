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
    const urlShort: string = body.short;
    const password: string = body.password || "";
    const expiration: number = body.expiration || 0;
    const customAddress: string = body.customAddress || "";
    const message: string = body.message || "";
    const length: number = body.length || 0;

    let newUrl = "";
    if (customAddress) {
      newUrl = customAddress;
    } else if (length != urlShort.length) {
      newUrl = generateShortUrl(length);
    } else {
      newUrl = urlShort;
    }

    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });

    const result = await client.query(
      q.Update(
        q.Select(
          ["ref"],
          q.Get(q.Match(q.Index("user_url_ref"), [urlShort, session.user.sub]))
        ),
        {
          data: {
            password: password,
            short: newUrl,
            message: message,
          },
          ttl: expiration > 0 ? q.TimeAdd(q.Now(), expiration, "hours") : null,
        }
      )
    );

    return NextResponse.json(result, {
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
