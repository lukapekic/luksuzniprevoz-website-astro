// Keep the retired preview URL unavailable while older Pages assets expire.
export const onRequest = (): Response =>
  new Response(null, {
    status: 410,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow, noarchive",
    },
  });
