import { logger } from '@/utils/logger'
import { NextFunction, Request, Response } from 'express'
import { ICacheResourceMap } from '../interfaces/cache.interface'
import { deleteCacheByPattern, getCache, setCache } from '../redis/cacheService'

interface CachedRequest extends Request {
  cacheKey?: string
  skipCache?: boolean
}

interface CacheOptions {
  ttlSeconds?: number
  keyPrefix?: string
  tags?: string[]
}

// Cache tags for invalidation patterns
export const CACHE_TAGS = {
  STAGES: 'chatbot:stages',
  CONTENT: 'chatbot:content',
  QUERIES: 'chatbot:queries',
  QUERY_DETAILS: 'chatbot:query_details',
  ALL: 'chatbot:all',
} as const

// Cache TTL configurations (in seconds)
export const CACHE_TTL = {
  STAGES: 60 * 15, // 15 minutes
  CONTENT: 60 * 10, // 10 minutes
  QUERIES: 60 * 5, // 5 minutes
  QUERY_DETAILS: 60 * 2, // 2 minutes for individual query details
} as const

// Cache key generation helper
const generateCacheKey = (req: Request): string => {
  const { method, originalUrl, query, params } = req
  const customer = (req as any).customer

  // Include customer ID in cache key if present for user-specific caching
  const customerPart = customer?.id ? `_customer_${customer.id}` : ''

  // Create a consistent key from URL, query params, and route params
  const queryString = Object.keys(query).length > 0 ? JSON.stringify(query) : ''
  const paramsString = Object.keys(params).length > 0 ? JSON.stringify(params) : ''

  // Build key without using buildKey to avoid double prefixes
  return `${method}_${originalUrl}_${queryString}_${paramsString}${customerPart}`
}

/**
 * Cache resource map with dependency relationships
 * This defines which cache types depend on each other for proper invalidation
 */
export const CACHE_RESOURCE_MAP: ICacheResourceMap = {
  [CACHE_TAGS.STAGES]: {
    prefix: 'chatbot_stages',
    pattern: 'chatbot_stages:*',
    dependencies: [CACHE_TAGS.CONTENT], // Stage changes affect content (via stage_name in metadata)
  },
  [CACHE_TAGS.CONTENT]: {
    prefix: 'chatbot_content',
    pattern: 'chatbot_content:*',
    dependencies: [], // Content changes don't affect other resources
  },
  [CACHE_TAGS.QUERIES]: {
    prefix: 'chatbot_queries',
    pattern: 'chatbot_queries:*',
    dependencies: [], // Queries don't affect other resources
  },
  [CACHE_TAGS.QUERY_DETAILS]: {
    prefix: 'chatbot_query_details',
    pattern: 'chatbot_query_details:*',
    dependencies: [], // Query details don't affect other resources
  },
}

/**
 * Redis cache middleware for chatbot CRM endpoints
 */
export const chatbotCacheMiddleware = (options: CacheOptions = {}) => {
  return async (req: CachedRequest, res: Response, next: NextFunction) => {
    const { method } = req
    const { keyPrefix = 'chatbot_crm', ttlSeconds = 300 } = options

    try {
      // Only cache GET requests
      if (method !== 'GET') {
        return next()
      }

      // Generate cache key without prefix (prefix will be added by getCache)
      const cacheKey = generateCacheKey(req)
      req.cacheKey = cacheKey

      logger.info(`[Cache] Checking cache for key: ${keyPrefix}:${cacheKey}`)

      // Try to get cached response
      const cachedData = await getCache(cacheKey, { keyPrefix, ttlSeconds })

      if (cachedData) {
        logger.info(`[Cache] Cache HIT for key: ${cacheKey}`)
        return res.json(cachedData)
      }

      logger.info(`[Cache] Cache MISS for key: ${cacheKey}`)

      // Store original res.json method
      const originalJson = res.json.bind(res)

      // Override res.json to cache the response
      res.json = function (data: any) {
        // Only cache successful responses (2xx status codes)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          setCache(cacheKey, data, { keyPrefix, ttlSeconds })
            .then(() => {
              logger.info(`[Cache] Cached response for key: ${cacheKey}`)
            })
            .catch(error => {
              logger.error(`[Cache] Failed to cache response for key: ${cacheKey}`, error)
            })
        }

        return originalJson(data)
      }

      next()
    } catch (error) {
      logger.error('[Cache] Cache middleware error:', error)
      // Continue without caching if there's an error
      next()
    }
  }
}

/**
 * Cache invalidation middleware for mutating operations
 */
export const chatbotCacheInvalidation = (tags: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { method } = req

    try {
      // Store original res.json method
      const originalJson = res.json.bind(res)

      // Override res.json to invalidate cache after successful mutations
      res.json = function (data: any) {
        // Only invalidate cache for successful mutations (2xx status codes)
        if (
          res.statusCode >= 200 &&
          res.statusCode < 300 &&
          ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)
        ) {
          invalidateRelatedCaches(req, tags)
            .then(() => {
              logger.info(`[Cache] Invalidated caches for tags: ${tags.join(', ')}`)
            })
            .catch(error => {
              logger.error('[Cache] Failed to invalidate caches:', error)
            })
        }

        return originalJson(data)
      }

      next()
    } catch (error) {
      logger.error('[Cache] Cache invalidation middleware error:', error)
      next()
    }
  }
}

/**
 * Invalidate related caches based on operation and tags
 */
async function invalidateRelatedCaches(req: Request, tags: string[] = []) {
  const { originalUrl } = req

  try {
    // Track which resources need to be invalidated (including dependencies)
    const resourcesNeedingInvalidation = new Set<string>()

    // First, determine resources to invalidate based on URL
    if (originalUrl.includes('/stages')) {
      resourcesNeedingInvalidation.add(CACHE_TAGS.STAGES)
    }

    if (originalUrl.includes('/content')) {
      resourcesNeedingInvalidation.add(CACHE_TAGS.CONTENT)
    }

    if (originalUrl.includes('/queries')) {
      // Determine if it's a specific query detail or general queries endpoint
      if (originalUrl.includes('/queries') && originalUrl.includes('/:id')) {
        resourcesNeedingInvalidation.add(CACHE_TAGS.QUERY_DETAILS)
        resourcesNeedingInvalidation.add(CACHE_TAGS.QUERIES) // Update to query also affects query listing
      } else {
        resourcesNeedingInvalidation.add(CACHE_TAGS.QUERIES)
      }
    }

    // Add tags specified in the middleware configuration
    tags.forEach(tag => {
      if (tag === CACHE_TAGS.ALL) {
        // Special case for ALL tag - add all resource types
        Object.keys(CACHE_RESOURCE_MAP).forEach(resourceTag => {
          resourcesNeedingInvalidation.add(resourceTag)
        })
      } else {
        resourcesNeedingInvalidation.add(tag)
      }
    })

    // Generate patterns to invalidate (including dependencies)
    const invalidationPatterns = new Set<string>()

    // Process each resource and its dependencies
    resourcesNeedingInvalidation.forEach(resourceTag => {
      const resource = CACHE_RESOURCE_MAP[resourceTag]
      if (resource) {
        // Add the resource's own pattern
        invalidationPatterns.add(resource.pattern)

        // Add patterns for any dependencies
        resource.dependencies.forEach(dependencyTag => {
          const dependency = CACHE_RESOURCE_MAP[dependencyTag]
          if (dependency) {
            invalidationPatterns.add(dependency.pattern)
          }
        })
      }
    })

    // Execute cache invalidation for all patterns
    for (const pattern of invalidationPatterns) {
      await deleteCacheByPattern(pattern)
      logger.info(`[Cache] Invalidated cache pattern: ${pattern}`)
    }
  } catch (error) {
    logger.error('[Cache] Error invalidating caches:', error)
    throw error
  }
}

/**
 * Manual cache invalidation utility
 */
export const invalidateChatbotCache = async (patterns: string[] = [], tags: string[] = []) => {
  try {
    let patternsToInvalidate: string[] = []

    // If specific patterns are provided, use those
    if (patterns.length > 0) {
      patternsToInvalidate = patterns
    }
    // If specific tags are provided, use those
    else if (tags.length > 0) {
      tags.forEach(tag => {
        const resource = CACHE_RESOURCE_MAP[tag]
        if (resource) {
          patternsToInvalidate.push(resource.pattern)

          // Add dependencies
          resource.dependencies.forEach(dependencyTag => {
            const dependency = CACHE_RESOURCE_MAP[dependencyTag]
            if (dependency) {
              patternsToInvalidate.push(dependency.pattern)
            }
          })
        }
      })
    }
    // Otherwise invalidate all cache resources
    else {
      Object.values(CACHE_RESOURCE_MAP).forEach(resource => {
        patternsToInvalidate.push(resource.pattern)
      })
    }

    // Remove duplicates
    patternsToInvalidate = [...new Set(patternsToInvalidate)]

    // Invalidate all patterns
    for (const pattern of patternsToInvalidate) {
      await deleteCacheByPattern(pattern)
      logger.info(`[Cache] Manually invalidated cache pattern: ${pattern}`)
    }

    return {
      success: true,
      invalidatedPatterns: patternsToInvalidate,
      invalidatedResources: tags.length > 0 ? tags : Object.keys(CACHE_RESOURCE_MAP),
    }
  } catch (error) {
    logger.error('[Cache] Error in manual cache invalidation:', error)
    throw error
  }
}
