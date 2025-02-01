import { NextRequest, NextResponse } from "next/server";
import faunadb from "faunadb";
import { corsHeaders } from "@/lib/cors";

const q = faunadb.query;

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    const client = new faunadb.Client({
      secret: process.env.GO_FAUNA_SECRET_KEY_A as string,
    });
    
    const result = await client.query(
      q.Get(q.Match(q.Index("url_by_short"), params.url))
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
    headers: { ...corsHeaders(request), Allow: "GET, OPTIONS" },
  });
}
