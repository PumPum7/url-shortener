import { NextRequest, NextResponse } from "next/server";
import faunadb from "faunadb";
import { corsHeaders } from "@/lib/cors";
import { getSession } from "@auth0/nextjs-auth0/edge";

const q = faunadb.query;

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
    const url: string = body.url;
    const password: string = body.password;

    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });

    const result = await client.query(
      q.Get(q.Match(q.Index("user_url_ref"), [url, session.user.sub]))
    );

    if (result.data.password === password) {
      return NextResponse.json({ success: true }, {
        headers: corsHeaders(request),
      });
    } else {
      return NextResponse.json(
        { error: "Invalid password" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

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
