import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.NEXT_PUBLIC_STRAVA_CLIENT_ID;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const redirectUri = `${baseUrl}/auth/callback`;

  if (!clientId) {
    return NextResponse.json(
      { error: "Strava Client ID is not configured" },
      { status: 500 }
    );
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    approval_prompt: "auto",
    scope: "read,read_all,profile:read_all,activity:read_all",
  });

  const authUrl = `https://www.strava.com/oauth/authorize?${params.toString()}`;

  return NextResponse.redirect(authUrl);
}
