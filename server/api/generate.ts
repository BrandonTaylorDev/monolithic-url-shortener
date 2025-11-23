import { getDb } from "../lib/mongodb";

type RequestBody = {
  url?: string;
  alias?: string;
};

type Response = {
  success: boolean;
  alias?: string;
  error?: string;
};

const MAX_ATTEMPTS = 5;

// Generate an 8‑character alias using a custom alphabet that excludes ambiguous
// characters such as 1, i, l, o, and 0. The alphabet consists of uppercase
// letters (excluding I, L, O) and digits 2‑9.
const ALIAS_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const ALIAS_LENGTH = 8;
const generateAlias = (): string => {
  let result = "";
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

export default defineEventHandler(async (event): Promise<Response> => {
  const body: RequestBody = await readBody(event);
  const database = await getDb();
  const collection = database.collection("urls");
  const normalizedUrl = body.url ? normalizeUrl(body.url) : undefined;
  let aliasToStore: string | undefined = body.alias?.trim() || undefined;

  const now = new Date();

  if (aliasToStore) {
    const aliasExists = await collection.findOne({ alias: aliasToStore });
    if (aliasExists) {
      return { success: false, error: "unavailable" };
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
      throw new Error("Failed to generate a unique alias after multiple attempts.");
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
          alias: aliasToStore,
        },
      },
      { upsert: true }
    );
    return { success: true, alias: aliasToStore };
  }

  return { success: false, error: "no_url" };
});
