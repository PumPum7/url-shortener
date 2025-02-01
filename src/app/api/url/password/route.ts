import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { withApiAuthRequired, getSession, type Session } from "@auth0/nextjs-auth0";
import { Client, fql } from "fauna";

const client = new Client();

export const POST = withApiAuthRequired(async (request: NextRequest) => {
  const res = new NextResponse();
  const {user} = await getSession(request, res) as Session;
  if (!user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders(request) }
    );
  }

  try {
    const body = await request.json();
    const url: string = body.url;
    const password: string = body.password;

    const query = fql`
      urls.firstWhere(arg => arg.short == ${url} && arg.user == ${user.sub})
    `;

    const result = await client.query(query);

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
})

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "POST, OPTIONS" },
  });
}
