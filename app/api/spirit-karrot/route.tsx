import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

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
    return new Response("No IPFS URL provided", { status: 400 });
  }
  const BASE_URL = new URL(request.url).origin;

  // Fetch the background image
  let backgroundImageData;
  try {
    const backgroundImageResponse = await fetch(`${BASE_URL}/assets/spirit-og-base.png`);
    backgroundImageData = await backgroundImageResponse.arrayBuffer();
  } catch (error) {
    return new Response("Error fetching background image", { status: 500 });
  }

  // Fetch the Karrot image
  let karrotImageData;
  try {
    const karrotImageResponse = await fetch(`${BASE_URL}/assets/spirit-karrots/${karrotName}.png`);
    karrotImageData = await karrotImageResponse.arrayBuffer();
  } catch (error) {
    return new Response("Error fetching Karrot image", { status: 500 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundImage: `url(data:image/png;base64,${Buffer.from(backgroundImageData).toString("base64")})`,
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
          <img src={`data:image/png;base64,${Buffer.from(karrotImageData).toString("base64")}`} />
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
