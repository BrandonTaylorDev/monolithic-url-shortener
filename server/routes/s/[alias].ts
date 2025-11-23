import { getDb } from "../../lib/mongodb";
import { sendRedirect, createError } from "h3";

export default defineEventHandler(async (event) => {
  const alias = event.context.params?.alias as string | undefined;
  if (!alias) {
    throw createError({ statusCode: 400, statusMessage: "Alias not provided" });
  }

  const db = await getDb();
  const collection = db.collection("urls");
  const now = new Date();
  const record = await collection.findOne({ alias, expires: { $gt: now } });

  if (!record) {
    throw createError({ statusCode: 404, statusMessage: "Alias not found" });
  }

  // Perform a temporary redirect (302) to the long URL.
  return sendRedirect(event, record.url, 302);
});
