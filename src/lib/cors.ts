export function corsHeaders(request: Request | null = null): Record<string, string> {
  const origin = request?.headers.get("origin") || "*";
  return {
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
    "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Content-Type, Authorization"
  };
}

export function handleOptions() {
  return new Response(null, {
    status: 200,
    headers: corsHeaders(),
  });
}
