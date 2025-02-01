import { NextRequest, NextResponse } from "next/server";
import { Client, fql, type QueryOptions } from "fauna";
import { corsHeaders } from "@/lib/cors";

const client = new Client();

const query = fql`
  query ($url: String!) {
    data: Get(Match(Index("url_by_short"), $url))
  }
`;

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    const result = await client.query(query, {
        arguments: {
            url: params.url,
        },
    } as QueryOptions);
    
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
    headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
  });
}
