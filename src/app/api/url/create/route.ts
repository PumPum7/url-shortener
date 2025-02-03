import { NextRequest, NextResponse } from "next/server";
import { Client, fql } from "fauna";
import { corsHeaders } from "@/lib/cors";
import { withApiAuthRequired, getSession, type Session } from "@auth0/nextjs-auth0";

const client = new Client();

function generateShortUrl(length: number): string {
  const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

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

    const query = fql`
    urls.create({
      short: ${customAddress || generateShortUrl(urlLength)},
      long: ${url},
      usage: 0,
      password: ${password},
      message: ${message},
      user: ${user.sub},
      ttl: ${expiration} > 0 ? Time.now().add(${expiration}, 'hours') : null
    })`;
    
    const result = await client.query(
      query,
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
})

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "POST, OPTIONS" },
  });
}
