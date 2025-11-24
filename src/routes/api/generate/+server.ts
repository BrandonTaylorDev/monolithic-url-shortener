import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';
import { getDb } from '$lib/server/mongo';

type RequestBody = {
  url?: string;
  alias?: string;
};

type ResponseBody = {
  success: boolean;
  alias?: string;
  error?: string;
};

const MAX_ATTEMPTS = 5;

// Generate an 8-character alias using a custom alphabet that excludes ambiguous
// characters such as 1, i, l, o, and 0. The alphabet consists of uppercase
// letters (excluding I, L, O) and digits 2-9.
const ALIAS_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const ALIAS_LENGTH = 8;

const generateAlias = (): string => {
  let result = '';
  const alphabetLength = ALIAS_ALPHABET.length;
  for (let i = 0; i < ALIAS_LENGTH; i++) {
    const idx = Math.floor(Math.random() * alphabetLength);
    result += ALIAS_ALPHABET.charAt(idx);
  }
  return result;
};

const normalizeUrl = (raw: string): string => {
  try {
    const u = new URL(raw);
    return u.toString();
  } catch (e) {
    return raw;
  }
};

export const POST: RequestHandler = async ({ request }) => {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    const resp: ResponseBody = { success: false, error: 'invalid_json' };
    return json(resp, { status: 400 });
  }

  const database = await getDb();
  const collection = database.collection('urls');

  const normalizedUrl = body.url ? normalizeUrl(body.url) : undefined;
  let aliasToStore: string | undefined = body.alias?.trim() || undefined;

  const now = new Date();

  if (aliasToStore) {
    const aliasExists = await collection.findOne({ alias: aliasToStore });
    if (aliasExists) {
      const resp: ResponseBody = { success: false, error: 'unavailable' };
      return json(resp, { status: 409 });
    }
  } else {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const candidate = generateAlias();
      const existsAlias = await collection.findOne({ alias: candidate });
      if (!existsAlias) {
        aliasToStore = candidate;
        break;
      }
    }
    if (!aliasToStore) {
      throw new Error(
        'Failed to generate a unique alias after multiple attempts.'
      );
    }
  }

  if (normalizedUrl) {
    const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await collection.updateOne(
      { alias: aliasToStore },
      {
        $setOnInsert: {
          url: normalizedUrl,
          createdAt: now,
          expires,
          alias: aliasToStore
        }
      },
      { upsert: true }
    );

    const resp: ResponseBody = { success: true, alias: aliasToStore };
    return json(resp);
  }

  const resp: ResponseBody = { success: false, error: 'no_url' };
  return json(resp, { status: 400 });
};
