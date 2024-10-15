import { ImageResponse } from "next/og";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ipfsUrl = searchParams.get("ipfsUrl");

  if (!ipfsUrl) {
    return new Response("No IPFS URL provided", { status: 400 });
  }
  const cid = ipfsUrl.split("/")[2];

  const IPFS_URL = `https://dweb.link/ipfs/${cid}/0`;
  const BASE_URL = "https://sepolia-faucet.kakarot.org";
  console.log("IPFS_URL", IPFS_URL);

  // Fetch the background image
  let backgroundImageData;
  try {
    const backgroundImageResponse = await fetch(`${BASE_URL}/assets/spirit-og-base.png`);
    backgroundImageData = await backgroundImageResponse.arrayBuffer();
  } catch (error) {
    console.error("Error fetching background image:", error);
    return new Response("Error fetching background image", { status: 500 });
  }

  // Fetch the IPFS image
  let ipfsImageData;
  try {
    const ipfsImageResponse = await fetch(IPFS_URL);
    ipfsImageData = await ipfsImageResponse.arrayBuffer();
  } catch (error) {
    console.error("Error fetching IPFS image:", error);
    return new Response("Error fetching IPFS image", { status: 500 });
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          backgroundImage: `url(data:image/png;base64,${Buffer.from(backgroundImageData).toString('base64')})`,
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
          <img
            src={`data:image/png;base64,${Buffer.from(ipfsImageData).toString('base64')}`}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              width: "400px",
              height: "400px",
            }}
          />
        </div>
      </div>
    ),
    {
      width: 1920,
      height: 1080,
    }
  );
}
