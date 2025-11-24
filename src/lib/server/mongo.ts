import { MongoClient, Db } from 'mongodb';
import { DB_CONN_STR } from '$env/static/private';

if (!DB_CONN_STR) {
  throw new Error('MongoDB credentials are missing in environment variables.');
}

const client = new MongoClient(DB_CONN_STR);

let db: Db | null = null;

export async function getDb(): Promise<Db> {
  if (db) return db;

  await client.connect();
  db = client.db('url-shortener');
  return db;
}

export async function closeDb(): Promise<void> {
  await client.close();
}
