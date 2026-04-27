import mongoose from "mongoose";
interface MongooseCache {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

if (!process.env.MONGODB_URI) {
  throw new Error("No MONGODB_URI env variable");
}

const cache: MongooseCache = { connection: null, promise: null };

export default async function DBConnect() {
  if (cache.connection) return cache.connection;
  if (!cache.promise) {
    cache.promise = mongoose.connect(process.env.MONGODB_URI || "");
  }

  try {
    cache.connection = await cache.promise;
  } catch (err) {
    cache.promise = null;
    throw err;
  }
  return cache.connection;
}
