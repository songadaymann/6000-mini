import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";
// import CrtOverlay from "./components/CrtOverlay"; // Commented out

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL ?? "https://6000-mini.vercel.app";
  const TITLE = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME;
  const DESC = process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION;
  const IMG = process.env.NEXT_PUBLIC_APP_OG_IMAGE;
  const FRAME_IMAGE =
    process.env.NEXT_PUBLIC_APP_FRAME_IMAGE ||
    process.env.NEXT_PUBLIC_APP_HERO_IMAGE ||
    IMG;

  return {
    title: TITLE,
    description: DESC,
    openGraph: {
      title: TITLE,
      description: DESC,
      url: URL,
      siteName: TITLE,
      images: [
        {
          url: IMG ?? "",
          width: 1200,
          height: 628,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESC,
      images: IMG ? [IMG] : [],
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: FRAME_IMAGE,
        button: {
          title: `Launch ${TITLE}`,
          action: {
            type: "launch_frame",
            name: TITLE,
            url: URL,
            splashImageUrl: process.env.NEXT_PUBLIC_SPLASH_IMAGE,
            splashBackgroundColor:
              process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background crt-mode">
        {/* <CrtOverlay /> */}{/* Commented out */}
        <div className="frame-preview-wrapper">
          <div id="terminal-container">
            <div id="terminal-inner">
              <Providers>{children}</Providers>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
