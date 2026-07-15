import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "Please define MONGODB_URI environment first to catch the variable",
  );
}

interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}
// lib/db.ts
const opts = {
  bufferCommands: false,
  family: 4, // Forces Mongoose to use IPv4 instead of IPv6
};

cached.promise = mongoose
  .connect(MONGODB_URI, opts)
  .then((mongooseInstance) => {
    console.log("✅ SUCCESS! MongoDB Connected Successfully!");
    return mongooseInstance;
  });

async function dbConnect() {
  if (cached!.conn) {
    return cached!.conn;
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    };
    cached!.promise = mongoose
      .connect(MONGODB_URI!, opts)
      .then((mongooseInstance) => {
        return mongooseInstance;
      });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    throw e;
  }

  return cached!.conn;
}

export default dbConnect;
