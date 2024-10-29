import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export const dynamic = "edge";

export async function GET(request: Request) {
  const userAgent = request.headers.get("User-Agent") || "";
  const isSocialMediaBot = /facebookexternalhit|twitterbot|linkedinbot|whatsapp|telegram/i.test(userAgent);

  if (!isSocialMediaBot) {
    // Redirect to the main app if it's not a social media bot
    return NextResponse.redirect(new URL("/", request.url));
  }

  const { searchParams } = new URL(request.url);
  const karrotName = searchParams.get("karrot");

  if (!karrotName) {
    return new Response("No Karrot provided", { status: 400 });
  }
  const BASE_URL = "https://sepolia-faucet.kakarot.org/";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundImage: `url("${BASE_URL}/assets/spirit-og-base.png")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: "0 50px",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "30px",
            marginRight: "80px",
          }}
        >
          <img src={`${BASE_URL}/assets/spirit-karrots/${karrotName}.jpeg`} />
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
