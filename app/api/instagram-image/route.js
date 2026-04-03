export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const source = searchParams.get('src');

  if (!source) {
    return new Response('Missing src parameter', { status: 400 });
  }

  try {
    const response = await fetch(source, {
      headers: {
        Referer: 'https://www.instagram.com/',
        'User-Agent': 'Mozilla/5.0',
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Image request failed with ${response.status}`);
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=86400',
        'Content-Type': contentType,
      },
      status: 200,
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
