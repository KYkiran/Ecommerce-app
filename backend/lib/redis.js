import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.UPSTASH_REDIS_URL);

if (!process.env.UPSTASH_REDIS_URL) {
  throw new Error("UPSTASH_REDIS_URL is not defined in environment variables");
}

export const redis = new Redis(process.env.UPSTASH_REDIS_URL);