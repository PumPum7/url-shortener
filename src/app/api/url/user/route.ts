import { NextRequest, NextResponse } from "next/server";
import faunadb from "faunadb";
import { corsHeaders } from "@/lib/cors";
import { getSession } from "@auth0/nextjs-auth0/edge";

const q = faunadb.query;

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401, headers: corsHeaders(request) }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const amount = searchParams.get("amount") || "10";
  const skip = searchParams.get("skip") || "0";
  const search = searchParams.get("search") || "";

  try {
    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });

    const result = await client.query(
      q.Paginate(q.Match(q.Index("user_id"), session.user.sub), {
        size: parseInt(amount) + parseInt(skip),
      })
    );

    const totalLinks = await getUrlCount(client, q, session.user.sub);
    let recentLinks = [];

    result.data
      .slice(
        parseInt(skip),
        parseInt(skip) + parseInt(amount)
      )
      .forEach((link) => {
        if (search) {
          if (
            !link[1].includes(search) &&
            !link[2].includes(search)
          ) {
            return;
          }
        }
        recentLinks.push({
          ref: link[0],
          long: link[1],
          short: link[2],
          usage: link[3],
          timeStamp: link[4] / 1000,
        });
      });

    return NextResponse.json(
      { links: recentLinks, total: totalLinks },
      { headers: corsHeaders(request) }
    );

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || error.toString() },
      { status: 400, headers: corsHeaders(request) }
    );
  }
}

async function getUrlCount(
  client: any,
  q: any,
  user: string
): Promise<number> {
  try {
    const result = await client.query(
      q.Count(
        q.Paginate(q.Match(q.Index("user_id"), user), { size: 10000 })
      )
    );
    return result.data[0] as number;
  } catch (error) {
    console.error(error);
    return 0;
  }
}

export function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
  });
}
