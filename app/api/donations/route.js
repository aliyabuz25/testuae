import { appendFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const STORAGE_DIR = '/tmp/uafp';
const STORAGE_FILE = join(STORAGE_DIR, 'donations.ndjson');

function cleanText(value, maxLength = 500) {
  return String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')
    .slice(0, maxLength);
}

function parseAmount(value) {
  const numeric = Number(String(value ?? '').replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(numeric) || numeric <= 0) {
    return null;
  }

  return Math.round(numeric * 100) / 100;
}

async function parseRequestBody(request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    return request.json();
  }

  if (
    contentType.includes('application/x-www-form-urlencoded') ||
    contentType.includes('multipart/form-data')
  ) {
    const formData = await request.formData();

    return {
      name: formData.get('name'),
      donationAmount: formData.get('donationAmount'),
      donationCountry: formData.get('donationCountry'),
      comment: formData.get('comment'),
    };
  }

  return request.json();
}

function buildResponse(data, status = 200) {
  return Response.json(data, {
    status,
    headers: {
      Allow: 'GET, POST, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: 'GET, POST, OPTIONS',
      'Cache-Control': 'no-store',
    },
  });
}

async function readStoredDonations() {
  try {
    const raw = await readFile(STORAGE_FILE, 'utf8');

    return raw
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => {
        try {
          return JSON.parse(line);
        } catch {
          return null;
        }
      })
      .filter(Boolean)
      .sort((a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime());
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
      return [];
    }

    throw error;
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const since = searchParams.get('since');
    const limit = Math.min(Number(searchParams.get('limit') || 10), 50);
    const storedDonations = await readStoredDonations();

    const filteredDonations = since
      ? storedDonations.filter(
          (donation) => new Date(donation.receivedAt).getTime() > new Date(since).getTime(),
        )
      : storedDonations.slice(-limit);

    return buildResponse({
      ok: true,
      donations: filteredDonations,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    return buildResponse(
      {
        ok: false,
        donations: [],
        error: 'Donations could not be loaded.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      500,
    );
  }
}

export async function POST(request) {
  try {
    const payload = await parseRequestBody(request);

    const name = cleanText(payload?.name, 120);
    const donationCountry = cleanText(payload?.donationCountry, 120);
    const comment = cleanText(payload?.comment, 600);
    const donationAmount = parseAmount(payload?.donationAmount);

    if (!name) {
      return buildResponse(
        {
          ok: false,
          error: 'The `name` field is required.',
        },
        400,
      );
    }

    if (!donationAmount) {
      return buildResponse(
        {
          ok: false,
          error: 'The `donationAmount` field must be a positive number.',
        },
        400,
      );
    }

    if (!donationCountry) {
      return buildResponse(
        {
          ok: false,
          error: 'The `donationCountry` field is required.',
        },
        400,
      );
    }

    const donation = {
      id: crypto.randomUUID(),
      name,
      donationAmount,
      donationCountry,
      comment,
      receivedAt: new Date().toISOString(),
    };

    await mkdir(STORAGE_DIR, { recursive: true });
    await appendFile(STORAGE_FILE, `${JSON.stringify(donation)}\n`, 'utf8');

    return buildResponse({
      ok: true,
      donation,
      message: 'Donation information received successfully.',
    });
  } catch (error) {
    return buildResponse(
      {
        ok: false,
        error: 'The donation payload could not be processed.',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      400,
    );
  }
}
