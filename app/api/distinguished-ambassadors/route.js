const ENDPOINT = 'https://uafp.octotech.az/uathletesBackend';

function clean(value, fallback = 'Not specified') {
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizeItems(payload) {
  if (!Array.isArray(payload)) {
    return [];
  }

  const items = payload
    .map((entry, index) => {
      const firstName = clean(entry.first_name, '').trim();
      const lastName = clean(entry.last_name, '').trim();
      const name = `${firstName} ${lastName}`.trim() || `Ambassador ${index + 1}`;

      return {
        id: `${name}-${clean(entry.country, 'unknown')}-${index}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-'),
        name,
        role: clean(entry.role, 'Distinguished Ambassador'),
        country: clean(entry.country, 'International'),
        sport: clean(entry.sport),
      };
    })
    .filter((entry) => entry.name);

  const seen = new Set();

  return items.filter((item) => {
    const key = `${item.name}-${item.country}-${item.sport}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export async function GET() {
  try {
    const response = await fetch(ENDPOINT, {
      headers: {
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        Priority: 'u=3, i',
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15',
      },
      method: 'GET',
      next: { revalidate: 1800 },
    });

    if (!response.ok) {
      throw new Error(`Backend request failed with ${response.status}`);
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
