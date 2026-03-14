/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const sfPro = fetch(
  new URL("../../styles/SF-Pro-Display-Medium.otf", import.meta.url),
).then((res) => res.arrayBuffer());

export default async function handler(req: NextRequest) {
  const [sfProData] = await Promise.all([sfPro]);

  const { searchParams } = req.nextUrl;
  const title = searchParams.get("title") || "boatbouncer";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <img
          src={new URL(
            `${process.env.NEXTAUTH_URL}/BoatBouncerLogo.png`,
            import.meta.url,
          ).toString()}
          alt=""
          width={500}
          height={500}
        />
        <h1
          style={{
            fontSize: "50px",
            fontFamily: "SF Pro",
            background:
              "linear-gradient(to bottom right, #44716c 21.66%, #78416c 86.47%)",
            backgroundClip: "text",
            color: "transparent",
            lineHeight: "5rem",
            letterSpacing: "-0.02em",
            position: "absolute",
            bottom: 0,
            left: 120,
          }}
        >
          {title}
        </h1>
      </div>
    ),
    {
      width: 500,
      height: 500,
      fonts: [
        {
          name: "SF Pro",
          data: sfProData,
        },
      ],
    },
  );
}
