import { buildApiPayload } from "@/lib/api-payload";

export const dynamic = "force-static";

export function GET() {
  return Response.json(buildApiPayload(), {
    headers: { "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" },
  });
}
