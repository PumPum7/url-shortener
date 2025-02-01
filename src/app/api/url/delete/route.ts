import { NextRequest, NextResponse } from "next/server";
import faunadb from "faunadb";
import { corsHeaders } from "@/lib/cors";
import { getSession } from "@auth0/nextjs-auth0/edge";

const q = faunadb.query;

export async function DELETE(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders(request) }
    );
  }

  const url = request.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: "URL parameter is required" },
      { status: 400, headers: corsHeaders(request) }
    );
  }

  try {
    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });

    const result = await client.query(
      q.Delete(
        q.Select(
          ["ref"],
          q.Get(q.Match(q.Index("user_url_ref"), [url, session.user.sub]))
        )
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
    headers: { ...corsHeaders(request), Allow: "DELETE, OPTIONS" },
  });
}
