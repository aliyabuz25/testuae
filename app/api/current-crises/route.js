import { conflictZones } from '../../../src/siteData';

const APPNAME = 'apidoc';

const crisisLocationMap = {
  AFG: { coordinates: [33.9391, 67.71], region: 'asia' },
  MMR: { coordinates: [21.9162, 95.956], region: 'asia' },
  IND: { coordinates: [34.0837, 74.7973], region: 'asia' },
  PAK: { coordinates: [34.0837, 74.7973], region: 'asia' },
  CHN: { coordinates: [12, 114], region: 'asia' },
  UKR: { coordinates: [48.3794, 31.1656], region: 'europe' },
  ARM: { coordinates: [39.83, 46.75], region: 'europe' },
  AZE: { coordinates: [39.83, 46.75], region: 'europe' },
  XKX: { coordinates: [42.6026, 20.903], region: 'europe' },
  CYP: { coordinates: [35.1264, 33.4299], region: 'europe' },
  ETH: { coordinates: [14.1612, 38.8958], region: 'africa' },
  SDN: { coordinates: [12.8628, 30.2176], region: 'africa' },
  SOM: { coordinates: [5.1521, 46.1996], region: 'africa' },
  ESH: { coordinates: [24.2155, -12.8858], region: 'africa' },
  MEX: { coordinates: [23.6345, -102.5528], region: 'americas' },
  COL: { coordinates: [4.5709, -74.2973], region: 'americas' },
  HTI: { coordinates: [18.9712, -72.2852], region: 'americas' },
  VEN: { coordinates: [6.4238, -66.5897], region: 'americas' },
  PSE: { coordinates: [31.3547, 34.3088], region: 'middle-east' },
  ISR: { coordinates: [31.3547, 34.3088], region: 'middle-east' },
  SYR: { coordinates: [34.8021, 38.9968], region: 'middle-east' },
  YEM: { coordinates: [15.5527, 48.5164], region: 'middle-east' },
  LBN: { coordinates: [33.8547, 35.8623], region: 'middle-east' },
  IRN: { coordinates: [32.4279, 53.688], region: 'middle-east' },
  IRQ: { coordinates: [33.2232, 43.6793], region: 'middle-east' },
};

const fallbackItems = conflictZones;

function normalizeText(value) {
  return String(value ?? '').trim();
}

function toDescription(fields) {
  const title = normalizeText(fields.title);
  const source = Array.isArray(fields.source) ? fields.source[0]?.shortname || fields.source[0]?.name : '';
  const created = fields.date?.created
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(fields.date.created))
    : '';

  return [title, source, created].filter(Boolean).join(' • ');
}

function transformItems(payload) {
  const items = payload?.data
    ?.map((entry) => entry.fields)
    ?.filter(Boolean)
    ?.map((fields, index) => {
      const primaryCountry = Array.isArray(fields.primary_country)
        ? fields.primary_country[0]
        : fields.primary_country;

      const iso3 = primaryCountry?.iso3;
      const name = primaryCountry?.name;
      const geo = iso3 ? crisisLocationMap[iso3] : null;

      if (!geo || !name) {
        return null;
      }

      return {
        id: `${iso3.toLowerCase()}-${index}`,
        name,
        coordinates: geo.coordinates,
        description: toDescription(fields) || 'Latest crisis report from ReliefWeb.',
        region: geo.region,
      };
    })
    ?.filter(Boolean);

  const deduped = [];
  const seen = new Set();

  for (const item of items ?? []) {
    const key = `${item.name}-${item.region}`;
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(item);
  }

  return deduped;
}

export async function GET() {
  try {
    const response = await fetch(
      `https://api.reliefweb.int/v2/reports?appname=${APPNAME}&preset=latest&limit=20&query[value]=conflict humanitarian displacement violence&query[fields][]=title&fields[include][]=title&fields[include][]=primary_country.name&fields[include][]=primary_country.iso3&fields[include][]=source.shortname&fields[include][]=source.name&fields[include][]=date.created`,
      {
        headers: {
          Accept: 'application/json',
        },
        next: { revalidate: 3600 },
      },
    );

    if (!response.ok) {
      throw new Error(`ReliefWeb request failed: ${response.status}`);
    }

    const payload = await response.json();
    const items = transformItems(payload);

    return Response.json({
      items: items.length > 0 ? items : fallbackItems,
      updatedAt: new Date().toISOString(),
    });
  } catch {
    return Response.json(
      {
        items: fallbackItems,
        updatedAt: new Date().toISOString(),
      },
      { status: 200 },
    );
  }
}
