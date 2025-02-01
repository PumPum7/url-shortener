import { NextRequest, NextResponse } from "next/server";
import { corsHeaders } from "@/lib/cors";
import { withApiAuthRequired, getSession, type Session } from "@auth0/nextjs-auth0";
import { Client, fql } from "fauna";

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

    const query = fql`
      Update(
        Select(
          ["ref"],
          Get(Match(Index("url_by_short"), [${urlShort}, ${user.sub}]))
        ),
        {
          data: {
            password: ${password},
            short: ${newUrl},
            message: ${message},
          },
          ttl: ${expiration} > 0 ? q.TimeAdd(q.Now(), ${expiration}, "hours") : null,
        }
      )
    `;

    const result = await client.query(
      query
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
})

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "POST, OPTIONS" },
  });
}
