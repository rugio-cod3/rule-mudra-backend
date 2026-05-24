import Redis from "ioredis";

const redis = new Redis();

async function setKey(
  key: string,
  value: Record<string, any>,
  expireInSeconds?: number
): Promise<void> {
  const serializedValue = JSON.stringify(value);

  if (expireInSeconds) {
    await redis.set(key, serializedValue, "EX", expireInSeconds);
  } else {
    await redis.set(key, serializedValue);
  }
}

async function getKey<T = any>(key: string): Promise<T | null> {
  const value = await redis.get(key);
  if (value === null) return null;

  try {
    return JSON.parse(value) as T;
  } catch {
    return value as unknown as T;
  }
}

async function deleteKey(key: string): Promise<void> {
  await redis.del(key);
}

const redisClient = {
  setKey,
  getKey,
  deleteKey,
  raw: redis,
};

export default redisClient;
