import { NextRequest, NextResponse } from "next/server";
import { Client, fql } from "fauna";
import { corsHeaders } from "@/lib/cors";
import { withApiAuthRequired, Session, getSession } from "@auth0/nextjs-auth0";

const client = new Client();

export const DELETE = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const {user} = await getSession(request, res) as Session;
  if (!user) {
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

    const query = fql`
      Delete(
        Select(
          ["ref"],
          Get(Match(Index("user_url_ref"), [${url}, ${user.sub}]))
        )
      )
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
})

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "DELETE, OPTIONS" },
  });
}
