// redis/cacheService.ts
import { logger } from '../utils/logger'
import redis from './redisClient'

type CacheOptions = {
  ttlSeconds?: number
  refreshOnEvent?: boolean
  keyPrefix?: string
}

const defaultTTL = 60 * 60 * 24 * 7 // 7 days

export const buildKey = (key: string, prefix = '') => `${prefix}${prefix ? ':' : ''}${key}`

export const setCache = async (key: string, value: any, options?: CacheOptions) => {
  logger.info(`Setting cache:, ${key}`)
  const ttl = options?.ttlSeconds || defaultTTL
  const fullKey = await buildKey(key, options?.keyPrefix)
  logger.info(`Cache key: ${fullKey}`)

  const serialized = JSON.stringify(value)
  await redis.set(fullKey, serialized, 'EX', ttl)
}

export const getCache = async <T = any>(key: string, options?: CacheOptions): Promise<T | null> => {
  logger.info(`Getting cache:, ${key}`)
  const fullKey = buildKey(key, options?.keyPrefix)
  logger.info(`Full cache key:, ${fullKey}`)

  const result = await redis.get(fullKey)
  logger.info(`Cache result: ${result}`)

  return result ? (JSON.parse(result) as T) : null
}

export const deleteCache = async (key: string, prefix = '') => {
  await redis.del(buildKey(key, prefix))
}

/**
 * Delete cache keys by pattern (supports wildcards)
 * This is specifically for pattern-based deletion without affecting the original deleteCache function
 */
export const deleteCacheByPattern = async (keyPattern: string) => {
  try {
    // Check if key contains wildcard pattern
    if (keyPattern.includes('*')) {
      // Use SCAN to find matching keys and delete them
      const matchingKeys = await redis.keys(keyPattern)
      if (matchingKeys.length > 0) {
        await redis.del(...matchingKeys)
        logger.info(`Deleted ${matchingKeys.length} cache keys matching pattern: ${keyPattern}`)
      } else {
        logger.info(`No cache keys found matching pattern: ${keyPattern}`)
      }
    } else {
      // Direct key deletion
      const result = await redis.del(keyPattern)
      logger.info(`Deleted cache key: ${keyPattern} (${result} keys removed)`)
    }
  } catch (error) {
    logger.error(`Error deleting cache pattern ${keyPattern}:`, error)
    throw error
  }
}

/**
 * Delete multiple cache keys by patterns
 */
export const deleteCachePatterns = async (patterns: string[]) => {
  try {
    for (const pattern of patterns) {
      await deleteCacheByPattern(pattern)
    }
    logger.info(`Deleted cache patterns: ${patterns.join(', ')}`)
  } catch (error) {
    logger.error('Error deleting cache patterns:', error)
    throw error
  }
}

/**
 * Get from cache or set it if not found
 */
export const getOrSetCache = async <T = any>(
  key: string,
  fetchFn: () => Promise<T>,
  options?: CacheOptions,
): Promise<T> => {
  logger.info(`Fetching from cache: ${key}`)

  const cached = await getCache<T>(key, options)
  if (cached) return cached

  logger.info(`Cache miss, fetching fresh data:, ${key}`)
  const freshData = await fetchFn()
  if (!freshData) {
    logger.error(`Failed to fetch fresh data for key: ${key}`)
    return null
  }
  await setCache(key, freshData, options)
  return freshData
}
