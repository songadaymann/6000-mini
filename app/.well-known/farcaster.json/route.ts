function withValidProperties(
  properties: Record<string, undefined | string | string[]>,
) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key, value]) => {
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return !!value;
    }),
  );
}

export async function GET() {
  const rawURL = process.env.NEXT_PUBLIC_URL ?? "";
  const URL = rawURL.replace(/\/+$/, ""); // strip trailing slashes for safe concatenation

  return Response.json({
    accountAssociation: {
      header:
        "eyJmaWQiOjQ5NTksInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhBYjRmQjk1ZEFDOTgyREQ2Q2Y0ZkVBOGEyRTlEM0UxQ2U3N0Q5M2I3In0",
      payload: "eyJkb21haW4iOiI2MDAwLW1pbmkudmVyY2VsLmFwcCJ9",
      signature:
        "MHhiMGIyZDQwNzMwYmZmZDg4ZTUyM2Y3NzgxYzQ4YWVmNzE2NWZmN2Y1MjcyYjk3MDAxY2QzOWZmNmZkYzczODkyNDA4ZGYwOGU5NGZjNGYwZTljYzNkOTkxYTllYmViMDE2YzcxNzFmOGQ5ZDE2M2Y3ZTM3ZWI5Y2U4Y2I3NDU1MTFj",
    },
    frame: withValidProperties({
      version: "1",
      name: process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME,
      subtitle: process.env.NEXT_PUBLIC_APP_SUBTITLE,
      description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
      screenshotUrls: [],
      iconUrl: process.env.NEXT_PUBLIC_APP_ICON || process.env.NEXT_PUBLIC_ICON_URL,
      splashImageUrl: process.env.NEXT_PUBLIC_APP_SPLASH_IMAGE,
      splashBackgroundColor: process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR,
      homeUrl: URL,
      webhookUrl: `${URL}/api/webhook`,
      primaryCategory: process.env.NEXT_PUBLIC_APP_PRIMARY_CATEGORY,
      tags: [],
      heroImageUrl: process.env.NEXT_PUBLIC_APP_HERO_IMAGE,
      tagline: process.env.NEXT_PUBLIC_APP_TAGLINE,
      ogTitle: process.env.NEXT_PUBLIC_APP_OG_TITLE,
      ogDescription: process.env.NEXT_PUBLIC_APP_OG_DESCRIPTION,
      ogImageUrl: process.env.NEXT_PUBLIC_APP_OG_IMAGE,
    }),
  });
}
