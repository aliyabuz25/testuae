const ENDPOINT = 'https://www.instagram.com/api/v1/feed/user/unitedathletesforpeace/username/?count=6';

function clean(value, fallback = '') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizeItems(payload) {
  if (!Array.isArray(payload?.items)) {
    return [];
  }

  return payload.items
    .map((item) => {
      const code = clean(item.code);
      const imageUrl = clean(item.display_uri || item.image_versions2?.candidates?.[0]?.url);
      const caption = clean(item.caption?.text, 'View post on Instagram');

      if (!code || !imageUrl) {
        return null;
      }

      return {
        caption: caption.length > 160 ? `${caption.slice(0, 157)}...` : caption,
        imageUrl: `/api/instagram-image?src=${encodeURIComponent(imageUrl)}`,
        url: `https://www.instagram.com/p/${code}/`,
      };
    })
    .filter(Boolean);
}

export async function GET() {
  try {
    const response = await fetch(ENDPOINT, {
      headers: {
        'user-agent': 'Mozilla/5.0',
        'x-ig-app-id': '936619743392459',
      },
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Instagram request failed with ${response.status}`);
    }

    const payload = await response.json();
    const items = normalizeItems(payload);

    return Response.json({
      items,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        items: [],
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
