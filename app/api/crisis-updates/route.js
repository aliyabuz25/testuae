const APPNAME = 'apidoc';

const fallbackItems = [
  'Daily Crisis • Sudan conflict displacement update',
  'Daily Crisis • Gaza humanitarian access constraints',
  'Monthly Brief • Ukraine humanitarian situation overview',
  'Monthly Brief • Afghanistan response planning update',
];

function getCountryName(field) {
  if (Array.isArray(field?.primary_country) && field.primary_country[0]?.name) {
    return field.primary_country[0].name;
  }

  if (field?.primary_country?.name) {
    return field.primary_country.name;
  }

  return 'Regional';
}

function formatMonthLabel(isoDate) {
  if (!isoDate) return 'Monthly Brief';

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(isoDate));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

function buildDailyItems(payload) {
  const items = payload?.data
    ?.map((entry) => entry.fields)
    ?.filter(Boolean)
    ?.slice(0, 4)
    ?.map((field) => `Daily Crisis • ${getCountryName(field)} — ${field.name}`);

  return items?.filter(Boolean) ?? [];
}

function buildMonthlyItems(payload) {
  const items = payload?.data
    ?.map((entry) => entry.fields)
    ?.filter(Boolean)
    ?.slice(0, 3)
    ?.map((field) => {
      const dateLabel = formatMonthLabel(field.date?.created);
      return `Monthly Brief • ${getCountryName(field)} — ${dateLabel}`;
    });

  return items?.filter(Boolean) ?? [];
}

export async function GET() {
  try {
    const [dailyResult, monthlyResult] = await Promise.allSettled([
      fetchJson(
        `https://api.reliefweb.int/v2/disasters?appname=${APPNAME}&preset=latest&limit=4&fields[include][]=name&fields[include][]=primary_country.name&fields[include][]=date.event`,
      ),
      fetchJson(
        `https://api.reliefweb.int/v2/reports?appname=${APPNAME}&preset=latest&limit=3&query[value]=monthly&query[fields][]=title&fields[include][]=title&fields[include][]=primary_country.name&fields[include][]=date.created`,
      ),
    ]);

    const dailyItems =
      dailyResult.status === 'fulfilled' ? buildDailyItems(dailyResult.value) : [];
    const monthlyItems =
      monthlyResult.status === 'fulfilled' ? buildMonthlyItems(monthlyResult.value) : [];

    const items = [...dailyItems, ...monthlyItems].filter(Boolean);

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
