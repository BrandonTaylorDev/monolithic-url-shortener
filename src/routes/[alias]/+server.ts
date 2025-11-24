import type { RequestHandler } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { getDb } from '$lib/server/mongo';

export const GET: RequestHandler = async ({ params }) => {
  const alias = params.alias as string | undefined;

  if (!alias) {
    throw error(400, 'Alias not provided');
  }

  const db = await getDb();
  const collection = db.collection('urls');
  const now = new Date();

  const record = await collection.findOne({
    alias,
    expires: { $gt: now }
  });

  if (!record) {
    throw error(404, 'Alias not found');
  }

  // Temporary redirect (302) to the long URL
  throw redirect(302, record.url as string);
};
