import { NextRequest, NextResponse } from "next/server";
import { Client, fql } from "fauna";
import { corsHeaders } from "@/lib/cors";

const client = new Client();

export async function GET(
  request: NextRequest,
  { params }: { params: { url: string } }
) {
  try {
    const {url} = await params;
    const query = fql`
      urls.firstWhere(arg => arg.short == ${url})
    `;

    const result = await client.query(query);

    if (!result.data) {
      return NextResponse.json(
        { error: "URL not found" },
        { status: 404, headers: corsHeaders(request) }
      );
    }

    // increase usage
    const usageQuery = fql`
      let url = urls.where(arg => arg.short == ${url})
      url!.update({usage: url!.usage + 1})
    `;

    await client.query(usageQuery);

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
